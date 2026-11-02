import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const EMPTY_FORM = {
  customer: "",
  location: "",
  employeeId: "",
  visitDate: new Date().toISOString().slice(0, 10),
  roofCondition: "Good",
  feasibility: "Feasible",
  requirements: "",
  recommendations: "",
  status: "Scheduled",
};

const SiteVisits = () => {
  const [profile, setProfile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isAdmin = profile?.role === "admin";

  const loadData = useCallback(async (currentProfile) => {
    if (!currentProfile?.id) return;
    setLoading(true);
    setError("");

    try {
      let query = supabase
        .from("site_visits")
        .select("*")
        .order("visit_date", { ascending: false });

      if (currentProfile.role !== "admin") {
        query = query.eq("employee_id", currentProfile.id);
      }

      const [visitResult, employeeResult] = await Promise.all([
        query,
        currentProfile.role === "admin"
          ? supabase
              .from("profiles")
              .select("id, full_name, employee_code")
              .eq("role", "employee")
              .order("full_name")
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (visitResult.error) throw visitResult.error;
      if (employeeResult.error) throw employeeResult.error;

      const employeeList = employeeResult.data || [];
      const employeeMap = new Map(employeeList.map((item) => [item.id, item]));

      setEmployees(employeeList);
      setVisits(
        (visitResult.data || []).map((visit) => {
          const employee = employeeMap.get(visit.employee_id);
          return {
            ...visit,
            customer: visit.customer_name,
            visitDate: visit.visit_date || "",
            employeeId: visit.employee_id,
            employee: employee?.full_name || "Assigned employee",
            employeeCode: employee?.employee_code || "",
            roofCondition: visit.roof_condition || "Not Assessed",
            feasibility: visit.feasibility || "Not Assessed",
            requirements: visit.requirements || "",
            recommendations: visit.recommendations || "",
          };
        })
      );
    } catch (err) {
      setError(err.message || "Unable to load site visits.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Please sign in to view site visits.");
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        setError(profileError.message || "Unable to load your profile.");
        setLoading(false);
        return;
      }

      setProfile(data);
      await loadData(data);
    };

    initialize();
  }, [loadData]);

  const filteredVisits = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return visits;
    return visits.filter((visit) =>
      [
        visit.customer,
        visit.location,
        visit.employee,
        visit.employeeCode,
        visit.roofCondition,
        visit.feasibility,
        visit.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [visits, searchTerm]);

  const countStatus = (status) =>
    visits.filter((visit) => visit.status === status).length;

  const statusClass = (value = "") =>
    value.toLowerCase().replaceAll(" ", "-");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVisit(null);
    setFormData({ ...EMPTY_FORM });
  };

  const openAddForm = () => {
    setError("");
    setNotice("");
    setEditingVisit(null);
    setFormData({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const openAdminEdit = (visit) => {
    setError("");
    setNotice("");
    setEditingVisit(visit);
    setFormData({
      customer: visit.customer || "",
      location: visit.location || "",
      employeeId: visit.employeeId || "",
      visitDate: visit.visitDate || "",
      roofCondition: visit.roofCondition,
      feasibility: visit.feasibility,
      requirements: visit.requirements,
      recommendations: visit.recommendations,
      status: visit.status || "Scheduled",
    });
    setShowForm(true);
  };

  const openEmployeeReport = (visit) => {
    setError("");
    setNotice("");
    setEditingVisit(visit);
    setFormData({
      ...EMPTY_FORM,
      customer: visit.customer || "",
      location: visit.location || "",
      employeeId: visit.employeeId || "",
      visitDate: visit.visitDate || "",
      roofCondition: visit.roofCondition,
      feasibility: visit.feasibility,
      requirements: visit.requirements,
      recommendations: visit.recommendations,
      status: visit.status === "Completed" ? "Completed" : "Report Pending",
    });
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profile?.id) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (isAdmin) {
        if (!formData.employeeId) {
          throw new Error("Please select an assigned employee.");
        }

        const payload = {
          customer_name: formData.customer.trim(),
          location: formData.location.trim(),
          employee_id: formData.employeeId,
          visit_date: formData.visitDate,
          roof_condition: formData.roofCondition,
          feasibility: formData.feasibility,
          requirements: formData.requirements.trim(),
          recommendations: formData.recommendations.trim(),
          status: formData.status,
        };

        if (editingVisit) {
          const { error: updateError } = await supabase
            .from("site_visits")
            .update(payload)
            .eq("id", editingVisit.id);
          if (updateError) throw updateError;
          setNotice("Site visit updated successfully.");
        } else {
          const { error: insertError } = await supabase
            .from("site_visits")
            .insert({ ...payload, created_by: profile.id });
          if (insertError) throw insertError;
          setNotice("Site visit assigned successfully.");
        }
      } else {
        if (!editingVisit) {
          throw new Error("Choose one of your assigned visits first.");
        }

        const payload = {
          roof_condition: formData.roofCondition,
          feasibility: formData.feasibility,
          requirements: formData.requirements.trim(),
          recommendations: formData.recommendations.trim(),
          status: formData.status === "Completed" ? "Completed" : "Report Pending",
        };

        const { error: updateError } = await supabase
          .from("site_visits")
          .update(payload)
          .eq("id", editingVisit.id)
          .eq("employee_id", profile.id);

        if (updateError) throw updateError;
        setNotice("Your site visit report has been submitted.");
      }

      resetForm();
      await loadData(profile);
    } catch (err) {
      setError(err.message || "Unable to save the site visit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (visit) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the site visit for ${visit.customer}?`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");
    const { error: deleteError } = await supabase
      .from("site_visits")
      .delete()
      .eq("id", visit.id);

    if (deleteError) {
      setError(deleteError.message || "Unable to delete this site visit.");
      return;
    }

    setNotice("Site visit deleted successfully.");
    await loadData(profile);
  };

  return (
    <div className="site-visits-page">
      <div className="site-visits-header">
        <div>
          <h1>Site Visit Reports</h1>
          <p>
            {isAdmin
              ? "Create site inspections, assign employees and review reports."
              : "View your assigned site visits and submit inspection reports."}
          </p>
        </div>
        {isAdmin && (
          <button type="button" onClick={openAddForm}>
            + Add Site Visit
          </button>
        )}
      </div>

      {error && <div className="site-visit-alert site-visit-alert-error">{error}</div>}
      {notice && (
        <div className="site-visit-alert site-visit-alert-success">{notice}</div>
      )}

      <div className="site-visits-summary">
        <div className="site-visit-summary-card">
          <span>{isAdmin ? "Total Visits" : "Assigned Visits"}</span>
          <strong>{visits.length}</strong>
        </div>
        <div className="site-visit-summary-card">
          <span>Scheduled</span>
          <strong>{countStatus("Scheduled")}</strong>
        </div>
        <div className="site-visit-summary-card">
          <span>Completed</span>
          <strong>{countStatus("Completed")}</strong>
        </div>
        <div className="site-visit-summary-card">
          <span>Reports Pending</span>
          <strong>{countStatus("Report Pending")}</strong>
        </div>
      </div>

      {showForm && (
        <form className="site-visit-form" onSubmit={handleSubmit}>
          <h2>
            {isAdmin
              ? editingVisit
                ? "Edit Site Visit"
                : "New Site Visit"
              : "Submit Site Visit Report"}
          </h2>

          {isAdmin ? (
            <>
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
                Site Location
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter site address or area"
                  required
                />
              </label>
              <label>
                Assigned Employee
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name}
                      {employee.employee_code ? ` (${employee.employee_code})` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Visit Date
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Customer Name
                <input value={formData.customer} readOnly />
              </label>
              <label>
                Site Location
                <input value={formData.location} readOnly />
              </label>
              <label>
                Visit Date
                <input type="date" value={formData.visitDate} readOnly />
              </label>
            </>
          )}

          <label>
            Roof Condition
            <select
              name="roofCondition"
              value={formData.roofCondition}
              onChange={handleChange}
            >
              <option value="Good">Good</option>
              <option value="Needs Repair">Needs Repair</option>
              <option value="Unsuitable">Unsuitable</option>
              <option value="Not Assessed">Not Assessed</option>
            </select>
          </label>

          <label>
            Installation Feasibility
            <select
              name="feasibility"
              value={formData.feasibility}
              onChange={handleChange}
            >
              <option value="Feasible">Feasible</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Not Feasible">Not Feasible</option>
              <option value="Not Assessed">Not Assessed</option>
            </select>
          </label>

          <label className="site-visit-full-width">
            Customer Requirements
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="System capacity, electricity needs, and other requirements"
              rows="3"
            />
          </label>

          <label className="site-visit-full-width">
            Recommendations
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
              placeholder="Inspection findings and recommended next steps"
              rows="3"
            />
          </label>

          <label>
            Report Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {(
                isAdmin
                  ? ["Scheduled", "Report Pending", "Completed"]
                  : ["Report Pending", "Completed"]
              ).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <div className="site-visit-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : isAdmin
                ? editingVisit
                  ? "Update Site Visit"
                  : "Assign Site Visit"
                : "Submit Report"}
            </button>
            <button
              type="button"
              className="site-visit-cancel-button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="site-visits-list-card">
        <div className="site-visits-list-heading">
          <div>
            <h2>{isAdmin ? "All Site Visits" : "My Assigned Site Visits"}</h2>
            <p>Review inspection reports and recommendations.</p>
          </div>
          <span>{filteredVisits.length} records</span>
        </div>

        <div className="site-visit-search">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search customer, location, employee, or status..."
            aria-label="Search site visits"
          />
        </div>

        <div className="site-visits-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer / Site</th>
                {isAdmin && <th>Assigned Employee</th>}
                <th>Visit Date</th>
                <th>Roof Condition</th>
                <th>Feasibility</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="site-visit-empty">
                    Loading site visits...
                  </td>
                </tr>
              ) : filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="site-visit-empty">
                    {isAdmin
                      ? "No site visits found. Add a site visit to get started."
                      : "No site visits have been assigned to you yet."}
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td>
                      <strong>{visit.customer}</strong>
                      <p className="site-visit-location">{visit.location}</p>
                    </td>
                    {isAdmin && (
                      <td>
                        {visit.employee}
                        {visit.employeeCode && (
                          <p className="site-visit-location">{visit.employeeCode}</p>
                        )}
                      </td>
                    )}
                    <td>{visit.visitDate || "—"}</td>
                    <td>{visit.roofCondition}</td>
                    <td>{visit.feasibility}</td>
                    <td>
                      <span
                        className={`site-visit-status status-${statusClass(
                          visit.status || "scheduled"
                        )}`}
                      >
                        {visit.status}
                      </span>
                    </td>
                    <td>
                      <div className="site-visit-action-buttons">
                        {isAdmin ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openAdminEdit(visit)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="site-visit-delete-button"
                              onClick={() => handleDelete(visit)}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openEmployeeReport(visit)}
                          >
                            {visit.status === "Completed"
                              ? "View / Edit Report"
                              : "Submit Report"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SiteVisits;
