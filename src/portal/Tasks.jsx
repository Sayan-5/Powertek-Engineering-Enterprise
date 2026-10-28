
import React, { useState } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Solar Panel Site Inspection",
      description: "Inspect the installation site and check roof conditions.",
      assignedTo: "Example Employee",
      priority: "High",
      status: "Pending",
      dueDate: "",
    },
    {
      id: 2,
      title: "Prepare Installation Report",
      description: "Prepare the report for the completed site visit.",
      assignedTo: "Unassigned",
      priority: "Medium",
      status: "In Progress",
      dueDate: "",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
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

  const handleEdit = (task) => {
    setEditingId(task.id);

    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    });

    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId ? { ...task, ...formData } : task
        )
      );
    } else {
      setTasks((previous) => [
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

  const handleDelete = (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (confirmed) {
      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );
    }
  };

  const getCount = (status) =>
    tasks.filter((task) => task.status === status).length;

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <div>
          <h1>Task Management</h1>
          <p>Create, assign, and track your team's work.</p>
        </div>

        <button type="button" onClick={openAddForm}>
          + Create Task
        </button>
      </div>

      <div className="tasks-summary">
        <div className="task-summary-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="task-summary-card">
          <span>Pending</span>
          <strong>{getCount("Pending")}</strong>
        </div>

        <div className="task-summary-card">
          <span>In Progress</span>
          <strong>{getCount("In Progress")}</strong>
        </div>

        <div className="task-summary-card">
          <span>Completed</span>
          <strong>{getCount("Completed")}</strong>
        </div>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>
            {editingId !== null ? "Edit Task" : "Create New Task"}
          </h2>

          <label>
            Task Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Solar panel installation"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows="3"
            />
          </label>

          <label>
            Assign To
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter employee name"
            />
          </label>

          <label>
            Priority
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <label>
            Due Date
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </label>

          <div className="task-form-actions">
            <button type="submit">
              {editingId !== null ? "Update Task" : "Save Task"}
            </button>

            <button
              type="button"
              className="task-cancel-button"
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

      <div className="tasks-list-card">
        <div className="tasks-list-heading">
          <h2>All Tasks</h2>
          <span>{tasks.length} tasks</span>
        </div>

        {tasks.length === 0 ? (
          <div className="tasks-empty">
            <span>📋</span>
            <h3>No tasks yet</h3>
            <p>Create a task to start organizing your team's work.</p>
          </div>
        ) : (
          <div className="tasks-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.title}</strong>
                      <p className="task-description">
                        {task.description || "No description"}
                      </p>
                    </td>

                    <td>{task.assignedTo || "Unassigned"}</td>

                    <td>
                      <span
                        className={`task-priority priority-${task.priority
                          .toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td>{task.dueDate || "Not set"}</td>

                    <td>
                      <span
                        className={`task-status status-${task.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td>
                      <div className="task-action-buttons">
                        <button
                          type="button"
                          onClick={() => handleEdit(task)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="task-delete-button"
                          onClick={() => handleDelete(task.id, task.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
