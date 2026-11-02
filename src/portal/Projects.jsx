
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  project_name: "",
  customer_id: "",
  location: "",
  capacity_kw: "",
  budget: "",
  status: "Planning",
  start_date: "",
  completion_date: "",
  description: "",
};

const statusOptions = [
  "Planning",
  "In Progress",
  "Completed",
  "On Hold",
  "Cancelled",
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // FETCH USER, CUSTOMERS AND PROJECTS
  // =====================================

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("Please login to access projects.");
      }

      setUserId(user.id);

      // Get logged-in user's role
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      if (profileError) throw profileError;

      setRole(profile.role);

      if (
        profile.role !== "admin" &&
        profile.role !== "customer"
      ) {
        setProjects([]);
        setCustomers([]);
        return;
      }

      // Fetch registered customers for admin
      let customerList = [];

      if (profile.role === "admin") {
        const { data, error: customerError } =
          await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("role", "customer")
            .eq("status", "active")
            .order("full_name");

        if (customerError) throw customerError;

        customerList = data || [];
      } else {
        // Customer can only see their own profile
        const { data, error: customerError } =
          await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("id", user.id)
            .single();

        if (customerError) throw customerError;

        customerList = data ? [data] : [];
      }

      setCustomers(customerList);

      // Fetch projects
      let projectQuery = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      // Customer can only request their own projects
      if (profile.role === "customer") {
        projectQuery = projectQuery.eq(
          "customer_id",
          user.id
        );
      }

      const { data: projectData, error: projectError } =
        await projectQuery;

      if (projectError) throw projectError;

      // Map customer names to project records
      const customerMap = {};

      customerList.forEach((customer) => {
        customerMap[customer.id] = customer.full_name;
      });

      const formattedProjects = (projectData || []).map(
        (project) => ({
          ...project,
          customer_name:
            customerMap[project.customer_id] ||
            "Customer",
        })
      );

      setProjects(formattedProjects);
    } catch (err) {
      console.error("Projects loading error:", err);
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================
  // FORM HANDLING
  // =====================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);

    setFormData({
      project_name: project.project_name || "",
      customer_id: project.customer_id || "",
      location: project.location || "",
      capacity_kw: project.capacity_kw ?? "",
      budget: project.budget ?? "",
      status: project.status || "Planning",
      start_date: project.start_date || "",
      completion_date: project.completion_date || "",
      description: project.description || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // =====================================
  // ADD / UPDATE PROJECT
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (role !== "admin") {
        throw new Error("Only administrators can manage projects.");
      }

      if (!formData.customer_id) {
        throw new Error("Please select a customer.");
      }

      const payload = {
        project_name: formData.project_name.trim(),
        customer_id: formData.customer_id,
        location: formData.location.trim(),
        capacity_kw: formData.capacity_kw
          ? Number(formData.capacity_kw)
          : null,
        budget: formData.budget
          ? Number(formData.budget)
          : null,
        status: formData.status,
        start_date: formData.start_date || null,
        completion_date: formData.completion_date || null,
        description: formData.description.trim(),
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        // Update existing project
        const { error: updateError } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setSuccess("Project updated successfully.");
      } else {
        // Create new project
        const { error: insertError } = await supabase
          .from("projects")
          .insert({
            ...payload,
            created_by: userId,
          });

        if (insertError) throw insertError;

        setSuccess("Project created successfully.");
      }

      closeForm();
      await fetchData();
    } catch (err) {
      console.error("Project save error:", err);
      setError(err.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE PROJECT
  // =====================================

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      if (role !== "admin") {
        throw new Error("Only administrators can delete projects.");
      }

      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setSuccess("Project deleted successfully.");

      await fetchData();
    } catch (err) {
      console.error("Project delete error:", err);
      setError(err.message || "Unable to delete project.");
    }
  };

  // =====================================
  // SEARCH AND SUMMARY
  // =====================================

  const filteredProjects = projects.filter((project) =>
    [
      project.project_name,
      project.customer_name,
      project.location,
      project.capacity_kw,
      project.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getCount = (status) =>
    projects.filter(
      (project) => project.status === status
    ).length;

  const statusClass = (status) =>
    status.toLowerCase().replaceAll(" ", "-");

  // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {
    return (
      <div className="projects-page">
        <h2>Loading Solar Projects...</h2>
        <p>Please wait while we connect to Supabase.</p>
      </div>
    );
  }

  // =====================================
  // ACCESS CONTROL
  // =====================================

  if (error && !userId) {
    return (
      <div className="projects-page">
        <h2>Unable to access projects</h2>
        <p>{error}</p>
        <button type="button" onClick={fetchData}>
          Try Again
        </button>
      </div>
    );
  }

  if (role !== "admin" && role !== "customer") {
    return (
      <div className="projects-page">
        <h1>Access Restricted</h1>
        <p>You do not have permission to view solar projects.</p>
      </div>
    );
  }

  // =====================================
  // MAIN INTERFACE
  // =====================================

  return (
    <div className="projects-page">

      {/* PAGE HEADER */}

      <div className="projects-page-header">
        <div>
          <h1>
            {role === "admin"
              ? "Solar Projects"
              : "My Solar Projects"}
          </h1>

          <p>
            {role === "admin"
              ? "Manage solar installations and track project progress."
              : "View your personal solar project information."}
          </p>
        </div>

        {role === "admin" && (
          <button type="button" onClick={openAddForm}>
            + Add Project
          </button>
        )}
      </div>

      {/* NOTIFICATIONS */}

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "8px",
          }}
        >
          {success}
        </div>
      )}

      {/* PROJECT SUMMARY */}

      <div className="projects-summary">

        <div className="project-summary-card">
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
        </div>

        <div className="project-summary-card">
          <span>Planning</span>
          <strong>{getCount("Planning")}</strong>
        </div>

        <div className="project-summary-card">
          <span>In Progress</span>
          <strong>{getCount("In Progress")}</strong>
        </div>

        <div className="project-summary-card">
          <span>Completed</span>
          <strong>{getCount("Completed")}</strong>
        </div>

      </div>

      {/* ADD / EDIT FORM */}

      {showForm && role === "admin" && (
        <form
          className="project-form"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>

          <label>
            Project Name

            <input
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
            />
          </label>

          <label>
            Select Customer

            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
            >
              <option value="">Select registered customer</option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.full_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Installation Location

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter site location"
              required
            />
          </label>

          <label>
            System Capacity (kW)

            <input
              type="number"
              name="capacity_kw"
              value={formData.capacity_kw}
              onChange={handleChange}
              placeholder="Example: 5"
              min="0"
              step="0.01"
            />
          </label>

          <label>
            Project Budget (₹)

            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter project budget"
              min="0"
              step="0.01"
            />
          </label>

          <label>
            Start Date

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </label>

          <label>
            Completion Date

            <input
              type="date"
              name="completion_date"
              value={formData.completion_date}
              onChange={handleChange}
            />
          </label>

          <label>
            Project Status

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Project Description

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project details..."
              rows="4"
            />
          </label>

          <div className="project-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Save Project"}
            </button>

            <button
              type="button"
              className="project-cancel-button"
              onClick={closeForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* PROJECT LIST */}

      <div className="projects-list-card">

        <div className="projects-list-heading">
          <div>
            <h2>
              {role === "admin"
                ? "All Projects"
                : "My Projects"}
            </h2>

            <p>
              Track your solar project pipeline.
            </p>
          </div>

          <span>{filteredProjects.length} records</span>
        </div>

        {/* SEARCH */}

        <div className="project-search">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search projects, customers, location..."
            aria-label="Search solar projects"
          />
        </div>

        {/* TABLE */}

        <div className="projects-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Start Date</th>
                <th>Status</th>

                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>

                  <td>
                    <strong>{project.project_name}</strong>
                  </td>

                  <td>{project.customer_name}</td>

                  <td>{project.location || "—"}</td>

                  <td>
                    {project.capacity_kw
                      ? `${project.capacity_kw} kW`
                      : "—"}
                  </td>

                  <td>
                    {project.start_date || "Not set"}
                  </td>

                  <td>
                    <span
                      className={`project-status status-${statusClass(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  {role === "admin" && (
                    <td>
                      <div className="project-action-buttons">

                        <button
                          type="button"
                          onClick={() => handleEdit(project)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="project-delete-button"
                          onClick={() =>
                            handleDelete(
                              project.id,
                              project.project_name
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  )}

                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={role === "admin" ? 7 : 6}
                    className="project-empty"
                  >
                    {searchTerm
                      ? "No matching projects found."
                      : "No projects available yet."}
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default Projects;
