
import React, { useState } from "react";

const Employees = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Example Employee",
      role: "Solar Technician",
      status: "Active",
      phone: "",
      email: "",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    role: "",
    phone: "",
    email: "",
  };

  const [formData, setFormData] = useState(emptyForm);

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

  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setFormData({
      name: employee.name,
      role: employee.role,
      phone: employee.phone,
      email: employee.email,
    });

    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingId
            ? { ...employee, ...formData }
            : employee
        )
      );
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
        status: "Active",
      };

      setEmployees((previous) => [...previous, newEmployee]);
    }

    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== id)
    );
  };

  return (
    <div className="employees-page">
      <h1>Employee Management</h1>
      <p>Manage your company's employees and their work status.</p>

      <div className="employees-card">
        <div className="employees-header">
          <h2>All Employees</h2>

          <button type="button" onClick={openAddForm}>
            + Add Employee
          </button>
        </div>

        {showForm && (
          <form className="employee-form" onSubmit={handleSubmit}>
            <h3>
              {editingId !== null ? "Edit Employee" : "Add New Employee"}
            </h3>

            <label>
              Full Name
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
              />
            </label>

            <label>
              Role
              <input
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Solar Technician"
                required
              />
            </label>

            <label>
              Phone
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </label>

            <button type="submit">
              {editingId !== null ? "Update Employee" : "Save Employee"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData(emptyForm);
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="employees-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>EMP-{String(index + 1).padStart(3, "0")}</td>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.phone || "—"}</td>
                  <td>{employee.email || "—"}</td>
                  <td>
                    <span className="employee-status">
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(employee.id, employee.name)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td colSpan="7">No employees found. Add an employee to begin.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
