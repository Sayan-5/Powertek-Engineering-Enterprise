
import React, { useState } from "react";

const SiteVisits = () => {
  const emptyForm = {
    customer: "",
    location: "",
    employee: "",
    visitDate: new Date().toISOString().slice(0, 10),
    roofCondition: "Good",
    feasibility: "Feasible",
    requirements: "",
    recommendations: "",
    status: "Scheduled",
  };

  const [visits, setVisits] = useState([
    {
      id: 1,
      customer: "Rahul Sharma",
      location: "Kolkata",
      employee: "Example Employee",
      visitDate: new Date().toISOString().slice(0, 10),
      roofCondition: "Good",
      feasibility: "Feasible",
      requirements: "5 kW rooftop solar installation",
      recommendations: "Proceed with detailed measurements.",
      status: "Completed",
    },
  ]);

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
    setFormData({ ...emptyForm });
    setShowForm(true);
  };

  const handleEdit = (visit) => {
    setEditingId(visit.id);
    setFormData({
      customer: visit.customer,
      location: visit.location,
      employee: visit.employee,
      visitDate: visit.visitDate,
      roofCondition: visit.roofCondition,
      feasibility: visit.feasibility,
      requirements: visit.requirements,
      recommendations: visit.recommendations,
      status: visit.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setVisits((previous) =>
        previous.map((visit) =>
          visit.id === editingId ? { ...visit, ...formData } : visit
        )
      );
    } else {
      setVisits((previous) => [
        ...previous,
        { id: Date.now(), ...formData },
      ]);
    }

    setFormData({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id, customer) => {
    if (
      window.confirm(
        `Are you sure you want to delete the site visit for ${customer}?`
      )
    ) {
      setVisits((previous) =>
        previous.filter((visit) => visit.id !== id)
      );
    }
  };

  const filteredVisits = visits.filter((visit) =>
    [
      visit.customer,
      visit.location,
      visit.employee,
      visit.roofCondition,
      visit.feasibility,
      visit.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const countStatus = (status) =>
    visits.filter((visit) => visit.status === status).length;

  const statusClass = (value) =>
    value.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="site-visits-page">
      <div className="site-visits-header">
        <div>
          <h1>Site Visit Reports</h1>
          <p>Record site inspections and assess solar installation feasibility.</p>
        </div>

        <button type="button" onClick={openAddForm}>
          + Add Site Visit
        </button>
      </div>

      <div className="site-visits-summary">
        <div className="site-visit-summary-card">
          <span>Total Visits</span>
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
          <h2>{editingId !== null ? "Edit Site Visit" : "New Site Visit"}</h2>

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
            <input
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
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
              <option value="Scheduled">Scheduled</option>
              <option value="Report Pending">Report Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <div className="site-visit-form-actions">
            <button type="submit">
              {editingId !== null ? "Update Report" : "Save Report"}
            </button>

            <button
              type="button"
              className="site-visit-cancel-button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ ...emptyForm });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="site-visits-list-card">
        <div className="site-visits-list-heading">
          <div>
            <h2>All Site Visits</h2>
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
                <th>Assigned Employee</th>
                <th>Visit Date</th>
                <th>Roof Condition</th>
                <th>Feasibility</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredVisits.map((visit) => (
                <tr key={visit.id}>
                  <td>
                    <strong>{visit.customer}</strong>
                    <p className="site-visit-location">{visit.location}</p>
                  </td>

                  <td>{visit.employee}</td>
                  <td>{visit.visitDate}</td>
                  <td>{visit.roofCondition}</td>
                  <td>{visit.feasibility}</td>

                  <td>
                    <span
                      className={`site-visit-status status-${statusClass(
                        visit.status
                      )}`}
                    >
                      {visit.status}
                    </span>
                  </td>

                  <td>
                    <div className="site-visit-action-buttons">
                      <button
                        type="button"
                        onClick={() => handleEdit(visit)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="site-visit-delete-button"
                        onClick={() =>
                          handleDelete(visit.id, visit.customer)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredVisits.length === 0 && (
                <tr>
                  <td colSpan="7" className="site-visit-empty">
                    No site visits found. Try another search or add a report.
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

export default SiteVisits;
