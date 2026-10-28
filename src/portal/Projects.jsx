
import React, { useState } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Residential Solar Installation",
      customer: "Rahul Sharma",
      location: "Kolkata",
      capacity: "5 kW",
      startDate: "",
      status: "Planning",
    },
    {
      id: 2,
      name: "Rooftop Solar Project",
      customer: "Priya Das",
      location: "Howrah",
      capacity: "3 kW",
      startDate: "",
      status: "Installation",
    },
  ]);

  const emptyForm = {
    name: "",
    customer: "",
    location: "",
    capacity: "",
    startDate: "",
    status: "Planning",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      customer: project.customer,
      location: project.location,
      capacity: project.capacity,
      startDate: project.startDate,
      status: project.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? { ...project, ...formData }
            : project
        )
      );
    } else {
      setProjects((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (confirmed) {
      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      );
    }
  };

  const filteredProjects = projects.filter((project) =>
    [
      project.name,
      project.customer,
      project.location,
      project.capacity,
      project.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getCount = (status) =>
    projects.filter((project) => project.status === status).length;

  const statusClass = (status) =>
    status.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="projects-page">
      <div className="projects-page-header">
        <div>
          <h1>Solar Projects</h1>
          <p>Manage solar installations and track project progress.</p>
        </div>

        <button type="button" onClick={openAddForm}>
          + Add Project
        </button>
      </div>

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
          <span>Installation</span>
          <strong>{getCount("Installation")}</strong>
        </div>

        <div className="project-summary-card">
          <span>Completed</span>
          <strong>{getCount("Completed")}</strong>
        </div>
      </div>

      {showForm && (
        <form className="project-form" onSubmit={handleSubmit}>
          <h2>
            {editingId !== null ? "Edit Project" : "Add New Project"}
          </h2>

          <label>
            Project Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
            />
          </label>

          <label>
            Customer Name
            <input
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
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
            System Capacity
            <select
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            >
              <option value="">Select capacity</option>
              <option value="1 kW">1 kW</option>
              <option value="2 kW">2 kW</option>
              <option value="3 kW">3 kW</option>
              <option value="5 kW">5 kW</option>
              <option value="10 kW">10 kW</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Start Date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
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
              <option value="Planning">Planning</option>
              <option value="Site Survey">Site Survey</option>
              <option value="Documentation">Documentation</option>
              <option value="Installation">Installation</option>
              <option value="Commissioning">Commissioning</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </label>

          <div className="project-form-actions">
            <button type="submit">
              {editingId !== null ? "Update Project" : "Save Project"}
            </button>

            <button
              type="button"
              className="project-cancel-button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData(emptyForm);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="projects-list-card">
        <div className="projects-list-heading">
          <div>
            <h2>All Projects</h2>
            <p>Track your solar project pipeline.</p>
          </div>

          <span>{filteredProjects.length} records</span>
        </div>

        <div className="project-search">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search projects, customers, location..."
            aria-label="Search solar projects"
          />
        </div>

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
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.name}</strong>
                  </td>
                  <td>{project.customer}</td>
                  <td>{project.location}</td>
                  <td>{project.capacity}</td>
                  <td>{project.startDate || "Not set"}</td>

                  <td>
                    <span
                      className={`project-status status-${statusClass(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>

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
                          handleDelete(project.id, project.name)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="7" className="project-empty">
                    No projects found. Try another search or add a project.
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
