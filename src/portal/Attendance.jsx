
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const Attendance = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const emptyForm = {
    employee_id: "",
    attendance_date: today,
    attendance_status: "Present",
    leave_type: "—",
    remarks: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authData.user) throw new Error("Please log in again.");

      setUser(authData.user);

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, full_name, employee_code, department, role, status")
          .eq("id", authData.user.id)
          .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      if (profileData.role === "admin") {
        const { data: employeeData, error: employeeError } =
          await supabase
            .from("profiles")
            .select("id, full_name, employee_code, department, role, status")
            .eq("role", "employee");

        if (employeeError) throw employeeError;

        setEmployees(employeeData || []);
      }

      await loadRecords(authData.user.id, profileData.role);
    } catch (err) {
      setError(err.message || "Unable to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async (userId, role) => {
    let query = supabase
      .from("attendance")
      .select("*")
      .order("attendance_date", { ascending: false });

    if (role !== "admin") {
      query = query.eq("employee_id", userId);
    }

    const { data, error: recordsError } = await query;

    if (recordsError) throw recordsError;

    const employeeIds = [
      ...new Set((data || []).map((record) => record.employee_id)),
    ];

    let profileMap = {};

    if (employeeIds.length > 0) {
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, full_name, employee_code, department")
          .in("id", employeeIds);

      if (profileError) throw profileError;

      profileMap = Object.fromEntries(
        (profileData || []).map((employee) => [
          employee.id,
          employee,
        ])
      );
    }

    setRecords(
      (data || []).map((record) => ({
        ...record,
        employee: profileMap[record.employee_id]?.full_name || "Employee",
        employee_code:
          profileMap[record.employee_id]?.employee_code || "—",
      }))
    );
  };

  const refreshRecords = async () => {
    if (user && profile) {
      await loadRecords(user.id, profile.role);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setError("");
    setFormData({
      ...emptyForm,
      employee_id: isAdmin ? "" : user.id,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      ...emptyForm,
      employee_id: isAdmin ? "" : user?.id || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !profile) return;

    setSaving(true);
    setError("");

    try {
      let payload;

      if (isAdmin) {
        if (!formData.employee_id) {
          throw new Error("Please select an employee.");
        }

        payload = {
          employee_id: formData.employee_id,
          attendance_date: formData.attendance_date,
          attendance_status: formData.attendance_status,
          leave_type: "—",
          leave_status: "—",
          remarks: formData.remarks.trim(),
          created_by: user.id,
        };
      } else {
        payload = {
          employee_id: user.id,
          attendance_date: formData.attendance_date,
          attendance_status: "Leave Requested",
          leave_type: formData.leave_type,
          leave_status: "Pending",
          remarks: formData.remarks.trim(),
          created_by: user.id,
        };
      }

      const { error: insertError } = await supabase
        .from("attendance")
        .insert(payload);

      if (insertError) throw insertError;

      closeForm();
      await refreshRecords();
    } catch (err) {
      setError(err.message || "Unable to save attendance record.");
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveDecision = async (record, decision) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${decision.toLowerCase()} this leave request?`
    );

    if (!confirmed) return;

    setError("");

    try {
      const { error: updateError } = await supabase
        .from("attendance")
        .update({ leave_status: decision })
        .eq("id", record.id);

      if (updateError) throw updateError;

      await refreshRecords();
    } catch (err) {
      setError(err.message || "Unable to update leave request.");
    }
  };

  const filteredRecords = records.filter((record) => {
    const searchText = [
      record.employee,
      record.employee_code,
      record.attendance_status,
      record.leave_type,
      record.leave_status,
      record.remarks,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());

    const matchesDate =
      !filterDate || record.attendance_date === filterDate;

    return matchesSearch && matchesDate;
  });

  const countStatus = (status) =>
    records.filter((record) => record.attendance_status === status).length;

  const pendingLeaves = records.filter(
    (record) =>
      record.attendance_status === "Leave Requested" &&
      record.leave_status === "Pending"
  ).length;

  const leaveStatusClass = (status) =>
    String(status || "").toLowerCase().replaceAll(" ", "-");

  if (loading) {
    return (
      <div className="attendance-page">
        <p>Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <div className="attendance-page-header">
        <div>
          <h1>Attendance & Leave</h1>
          <p>
            {isAdmin
              ? "Manage employee attendance and leave requests."
              : "View your attendance and submit leave requests."}
          </p>
        </div>

        <button type="button" onClick={openAddForm}>
          {isAdmin ? "+ Add Attendance" : "+ Apply for Leave"}
        </button>
      </div>

      {error && (
        <div className="attendance-error" role="alert">
          {error}
        </div>
      )}

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
          <strong>{pendingLeaves}</strong>
        </div>
      </div>

      {showForm && (
        <form className="attendance-form" onSubmit={handleSubmit}>
          <h2>
            {isAdmin ? "Add Attendance Record" : "Apply for Leave"}
          </h2>

          {isAdmin && (
            <label>
              Employee
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name} ({employee.employee_code || "No ID"})
                  </option>
                ))}
              </select>
            </label>
          )}

          {!isAdmin && (
            <label>
              Employee Name
              <input value={profile?.full_name || ""} disabled />
            </label>
          )}

          <label>
            Date
            <input
              type="date"
              name="attendance_date"
              value={formData.attendance_date}
              onChange={handleChange}
              required
            />
          </label>

          {isAdmin ? (
            <label>
              Attendance Status
              <select
                name="attendance_status"
                value={formData.attendance_status}
                onChange={handleChange}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
              </select>
            </label>
          ) : (
            <label>
              Leave Type
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Other">Other</option>
              </select>
            </label>
          )}

          <label>
            {isAdmin ? "Remarks" : "Reason for Leave"}
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder={
                isAdmin
                  ? "Optional notes"
                  : "Explain why you need leave..."
              }
              rows="3"
            />
          </label>

          <div className="attendance-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : isAdmin
                ? "Save Attendance"
                : "Submit Leave Request"}
            </button>

            <button
              type="button"
              className="attendance-cancel-button"
              onClick={closeForm}
              disabled={saving}
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
            <p>Review attendance and leave request details.</p>
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
                {isAdmin && <th>Employee</th>}
                <th>Date</th>
                <th>Attendance</th>
                <th>Leave Type</th>
                <th>Leave Status</th>
                <th>Remarks</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  {isAdmin && (
                    <td>
                      <strong>{record.employee}</strong>
                      <br />
                      <small>{record.employee_code}</small>
                    </td>
                  )}

                  <td>{record.attendance_date}</td>

                  <td>
                    <span
                      className={`attendance-status attendance-${leaveStatusClass(
                        record.attendance_status
                      )}`}
                    >
                      {record.attendance_status}
                    </span>
                  </td>

                  <td>{record.leave_type || "—"}</td>

                  <td>
                    {record.leave_status === "—" ? (
                      "—"
                    ) : (
                      <span
                        className={`attendance-status attendance-${leaveStatusClass(
                          record.leave_status
                        )}`}
                      >
                        {record.leave_status}
                      </span>
                    )}
                  </td>

                  <td>{record.remarks || "—"}</td>

                  {isAdmin && (
                    <td>
                      {record.attendance_status === "Leave Requested" &&
                      record.leave_status === "Pending" ? (
                        <div className="attendance-action-buttons">
                          <button
                            type="button"
                            onClick={() =>
                              handleLeaveDecision(record, "Approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            className="attendance-delete-button"
                            onClick={() =>
                              handleLeaveDecision(record, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 5}
                    className="attendance-empty"
                  >
                    No matching attendance records found.
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
