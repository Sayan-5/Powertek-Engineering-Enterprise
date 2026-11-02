
import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  title: "",
  description: "",
  assignedTo: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

const statuses = ["Pending", "In Progress", "Completed"];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const isAdmin = profile?.role === "admin";

  // Load user, profile, tasks and employees
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!currentUser) {
        throw new Error("Please sign in again.");
      }

      setUser(currentUser);

      const { data: currentProfile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, full_name, role, employee_code")
          .eq("id", currentUser.id)
          .single();

      if (profileError) throw profileError;

      setProfile(currentProfile);

      if (!["admin", "employee"].includes(currentProfile.role)) {
        throw new Error("You do not have permission to access tasks.");
      }

      // RLS automatically limits employee results
      const { data: taskData, error: taskError } =
        await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

      if (taskError) throw taskError;

      setTasks(taskData || []);

      // Only administrators need the employee list
      if (currentProfile.role === "admin") {
        const { data: employeeData, error: employeeError } =
          await supabase
            .from("profiles")
            .select("id, full_name, employee_code, department")
            .eq("role", "employee")
            .eq("status", "active")
            .order("full_name");

        if (employeeError) throw employeeError;

        setEmployees(employeeData || []);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      setError(err.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Form handling
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
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assigned_to || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.due_date || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // Create or update task
 
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!isAdmin || !user) return;
  


const { data: adminCheck, error: adminCheckError } =
  await supabase.rpc("is_admin");




  setSaving(true);
  setError("");

  let notificationWarning = "";

  try {
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      assigned_to: formData.assignedTo || null,
      priority: formData.priority,
      status: formData.status,
      due_date: formData.dueDate || null,
    };

    // Find existing task when editing
    const existingTask = editingId
      ? tasks.find((task) => task.id === editingId)
      : null;

    const previousAssignedTo =
      existingTask?.assigned_to || null;

    // Save task
    if (editingId) {
      const { error: updateError } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", editingId);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("tasks")
        .insert({
          ...payload,
          created_by: user.id,
        });

      if (insertError) throw insertError;
    }

    // Send notification for a new employee assignment
    const newlyAssigned =
      Boolean(payload.assigned_to) &&
      (
        !editingId ||
        payload.assigned_to !== previousAssignedTo
      );

    if (newlyAssigned) {
      console.log("Sending task notification...");

      const { data: notificationData, error: notificationError } =
        await supabase
          .from("notifications")
          .insert({
            recipient_id: payload.assigned_to,
            title: "New Task Assigned!",
            message: `You have been assigned a new task: ${payload.title}`,
            type: "task",
            link: "/tasks",
            created_by: user.id,
          })
          .select("id")
          .single();

      if (notificationError) {
        console.error(
          "Task notification failed:",
          notificationError
        );

        notificationWarning =
          "Task saved, but notification failed: " +
          notificationError.message;
      } else {
        console.log(
          "Task notification created successfully:",
          notificationData
        );
      }
    }

    closeForm();
    await loadData();

    // Show any notification error after refreshing tasks
    if (notificationWarning) {
      setError(notificationWarning);
    }

  } catch (err) {
    console.error("Task save failed:", err);
    setError(err.message || "Unable to save task.");
  } finally {
    setSaving(false);
  }
};

// Employee or admin status update
const handleStatusChange = async (taskId, newStatus) => {
  setError("");

  try {
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (updateError) throw updateError;

    await loadData();
  } catch (err) {
    setError(err.message || "Unable to update task status.");
  }
};

  // Delete task (administrator only)
  const handleDelete = async (task) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (deleteError) throw deleteError;

      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    }
  };

  const getCount = (status) =>
    tasks.filter((task) => task.status === status).length;

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (item) => item.id === employeeId
    );

    return employee
      ? `${employee.full_name} (${employee.employee_code})`
      : "Unassigned";
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <h2>Loading tasks...</h2>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <div>
          <h1>{isAdmin ? "Task Management" : "My Tasks"}</h1>
          <p>
            {isAdmin
              ? "Create, assign and track your team's work."
              : "View your assigned work and update task progress."}
          </p>
        </div>

        {isAdmin && (
          <button type="button" onClick={openAddForm}>
            + Create Task
          </button>
        )}
      </div>

      {error && (
        <div className="tasks-error" role="alert">
          {error}
        </div>
      )}

      <div className="tasks-summary">
        <div className="task-summary-card">
          <span>{isAdmin ? "Total Tasks" : "My Tasks"}</span>
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

      {/* Administrator task form */}
      {showForm && isAdmin && (
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Task" : "Create New Task"}</h2>

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
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name} ({employee.employee_code})
                </option>
              ))}
            </select>
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
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
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
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Task"
                  : "Save Task"}
            </button>

            <button
              type="button"
              className="task-cancel-button"
              onClick={closeForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Task list */}
      <div className="tasks-list-card">
        <div className="tasks-list-heading">
          <h2>{isAdmin ? "All Tasks" : "Assigned Tasks"}</h2>
          <span>{tasks.length} tasks</span>
        </div>

        {tasks.length === 0 ? (
          <div className="tasks-empty">
            <span>📋</span>
            <h3>No tasks yet</h3>
            <p>
              {isAdmin
                ? "Create a task and assign it to an employee."
                : "You currently have no assigned tasks."}
            </p>
          </div>
        ) : (
          <div className="tasks-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Task</th>

                  {isAdmin && <th>Assigned To</th>}

                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>

                  {isAdmin && <th>Actions</th>}
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

                    {isAdmin && (
                      <td>
                        {getEmployeeName(task.assigned_to)}
                      </td>
                    )}

                    <td>
                      <span
                        className={`task-priority priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td>{task.due_date || "Not set"}</td>

                    <td>
                      <span
                        className={`task-status status-${task.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>

                      <select
                        aria-label={`Update status for ${task.title}`}
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(
                            task.id,
                            event.target.value
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    {isAdmin && (
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
                            onClick={() => handleDelete(task)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
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
