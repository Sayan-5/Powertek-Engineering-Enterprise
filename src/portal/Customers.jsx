
import React, { useState } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@example.com",
      location: "Kolkata",
      systemSize: "5 kW",
      status: "New Lead",
    },
    {
      id: 2,
      name: "Priya Das",
      phone: "9876501234",
      email: "priya@example.com",
      location: "Howrah",
      systemSize: "3 kW",
      status: "Quotation Sent",
    },
  ]);

  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    location: "",
    systemSize: "",
    status: "New Lead",
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

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      location: customer.location,
      systemSize: customer.systemSize,
      status: customer.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingId
            ? { ...customer, ...formData }
            : customer
        )
      );
    } else {
      setCustomers((previous) => [
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
      `Are you sure you want to delete customer "${name}"?`
    );

    if (confirmed) {
      setCustomers((previous) =>
        previous.filter((customer) => customer.id !== id)
      );
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    [
      customer.name,
      customer.phone,
      customer.email,
      customer.location,
      customer.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getCount = (status) =>
    customers.filter((customer) => customer.status === status).length;

  const statusClass = (status) =>
    status.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="customers-page">
      <div className="customers-page-header">
        <div>
          <h1>Customer Management</h1>
          <p>Manage customer enquiries and solar sales opportunities.</p>
        </div>

        <button type="button" onClick={openAddForm}>
          + Add Customer
        </button>
      </div>

      <div className="customers-summary">
        <div className="customer-summary-card">
          <span>Total Customers</span>
          <strong>{customers.length}</strong>
        </div>

        <div className="customer-summary-card">
          <span>New Leads</span>
          <strong>{getCount("New Lead")}</strong>
        </div>

        <div className="customer-summary-card">
          <span>Quotations Sent</span>
          <strong>{getCount("Quotation Sent")}</strong>
        </div>

        <div className="customer-summary-card">
          <span>Converted</span>
          <strong>{getCount("Converted")}</strong>
        </div>
      </div>

      {showForm && (
        <form className="customer-form" onSubmit={handleSubmit}>
          <h2>
            {editingId !== null ? "Edit Customer" : "Add New Customer"}
          </h2>

          <label>
            Customer Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </label>

          <label>
            Phone Number
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </label>

          <label>
            Email Address
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City or site location"
            />
          </label>

          <label>
            Solar System Size
            <select
              name="systemSize"
              value={formData.systemSize}
              onChange={handleChange}
            >
              <option value="">Select system size</option>
              <option value="1 kW">1 kW</option>
              <option value="2 kW">2 kW</option>
              <option value="3 kW">3 kW</option>
              <option value="5 kW">5 kW</option>
              <option value="10 kW">10 kW</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Sales Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="New Lead">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Quotation Sent">Quotation Sent</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </label>

          <div className="customer-form-actions">
            <button type="submit">
              {editingId !== null ? "Update Customer" : "Save Customer"}
            </button>

            <button
              type="button"
              className="customer-cancel-button"
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

      <div className="customers-list-card">
        <div className="customers-list-heading">
          <div>
            <h2>All Customers</h2>
            <p>View and manage your customer pipeline.</p>
          </div>

          <span>{filteredCustomers.length} records</span>
        </div>

        <div className="customer-search">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, phone, email, location or status..."
            aria-label="Search customers"
          />
        </div>

        <div className="customers-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Location</th>
                <th>System Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <p className="customer-email">
                      {customer.email || "No email provided"}
                    </p>
                  </td>

                  <td>{customer.phone || "—"}</td>
                  <td>{customer.location || "—"}</td>
                  <td>{customer.systemSize || "Not specified"}</td>

                  <td>
                    <span
                      className={`customer-status status-${statusClass(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    <div className="customer-action-buttons">
                      <button
                        type="button"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="customer-delete-button"
                        onClick={() =>
                          handleDelete(customer.id, customer.name)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className="customer-empty">
                    No customers found. Try another search or add a customer.
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

export default Customers;
