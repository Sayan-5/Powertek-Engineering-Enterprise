
import React, { useState } from "react";

const Attendance = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      employee: "Example Employee",
      date: new Date().toISOString().slice(0, 10),
      attendance: "Present",
      leaveType: "—",
      leaveStatus: "—",
      remarks: "",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const emptyForm = {
    employee: "",
    date: new Date().toISOString().slice(0, 10),
    attendance: "Present",
    leaveType: "—",
    leaveStatus: "—",
    remarks: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "attendance" && value !== "Leave Requested") {
        updated.leaveType = "—";
        updated.leaveStatus = "—";
      }

      if (name === "attendance" && value === "Leave Requested") {
        updated.leaveType = "Casual Leave";
        updated.leaveStatus = "Pending";
      }

      return updated;
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      employee: record.employee,
      date: record.date,
      attendance: record.attendance,
      leaveType: record.leaveType,
      leaveStatus: record.leaveStatus,
      remarks: record.remarks,
    });
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === editingId ? { ...record, ...formData } : record
        )
      );
    } else {
      setRecords((previous) => [
        ...previous,
        { id: Date.now(), ...formData },
      ]);
    }

    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id, employee) => {
    if (window.confirm(`Delete the record for ${employee}?`)) {
      setRecords((previous) =>
        previous.filter((record) => record.id !== id)
      );
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = [
      record.employee,
      record.attendance,
      record.leaveType,
      record.leaveStatus,
      record.remarks,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDate = !filterDate || record.date === filterDate;

    return matchesSearch && matchesDate;
  });

  const countStatus = (status) =>
    records.filter((record) => record.attendance === status).length;

  const leaveRequests = records.filter(
    (record) => record.attendance === "Leave Requested"
  );

  const leaveStatusClass = (status) =>
    status.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="attendance-page">
      <div className="attendance-page-header">
        <div>
          <h1>Attendance & Leave</h1>
          <p>Track daily attendance and manage employee leave requests.</p>
        </div>

        <button type="button" onClick={openAddForm}>
          + Add Record
        </button>
      </div>

      <div className="attendance-summary">
        <div className="attendance-summary-card">
          <span>Total Records</span>
          <strong>{records.length}</strong>
        </div>

        <div className="attendance-summary-card">
          <span>Present</span>
          <strong>{countStatus("Present")}</strong>
        </div>

        <div className="attendance-summary-card">
          <span>Absent</span>
          <strong>{countStatus("Absent")}</strong>
        </div>

        <div className="attendance-summary-card">
          <span>Pending Leave Requests</span>
          <strong>
            {leaveRequests.filter((record) => record.leaveStatus === "Pending").length}
          </strong>
        </div>
      </div>

      {showForm && (
        <form className="attendance-form" onSubmit={handleSubmit}>
          <h2>
            {editingId !== null ? "Edit Attendance Record" : "Add Attendance Record"}
          </h2>

          <label>
            Employee Name
            <input
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </label>

          <label>
            Date
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Attendance Status
            <select
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave Requested">Leave Requested</option>
            </select>
          </label>

          {formData.attendance === "Leave Requested" && (
            <>
              <label>
                Leave Type
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Leave Approval Status
                <select
                  name="leaveStatus"
                  value={formData.leaveStatus}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>
            </>
          )}

          <label>
            Remarks
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Optional notes"
              rows="3"
            />
          </label>

          <div className="attendance-form-actions">
            <button type="submit">
              {editingId !== null ? "Update Record" : "Save Record"}
            </button>

            <button
              type="button"
              className="attendance-cancel-button"
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

      <div className="attendance-list-card">
        <div className="attendance-list-heading">
          <div>
            <h2>Attendance Records</h2>
            <p>Review daily attendance and leave requests.</p>
          </div>

          <span>{filteredRecords.length} records</span>
        </div>

        <div className="attendance-filters">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search employee or status..."
            aria-label="Search attendance records"
          />

          <label>
            Filter by date
            <input
              type="date"
              value={filterDate}
              onChange={(event) => setFilterDate(event.target.value)}
            />
          </label>
        </div>

        <div className="attendance-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Attendance</th>
                <th>Leave Type</th>
                <th>Leave Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td><strong>{record.employee}</strong></td>
                  <td>{record.date}</td>

                  <td>
                    <span
                      className={`attendance-status attendance-${leaveStatusClass(
                        record.attendance
                      )}`}
                    >
                      {record.attendance}
                    </span>
                  </td>

                  <td>{record.leaveType}</td>

                  <td>
                    {record.leaveStatus === "—" ? (
                      "—"
                    ) : (
                      <span
                        className={`attendance-status attendance-${leaveStatusClass(
                          record.leaveStatus
                        )}`}
                      >
                        {record.leaveStatus}
                      </span>
                    )}
                  </td>

                  <td>{record.remarks || "—"}</td>

                  <td>
                    <div className="attendance-action-buttons">
                      <button
                        type="button"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="attendance-delete-button"
                        onClick={() =>
                          handleDelete(record.id, record.employee)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="7" className="attendance-empty">
                    No matching records found.
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

export default Attendance;
