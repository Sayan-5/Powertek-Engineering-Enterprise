
import React from "react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Employees",
      value: "0",
      description: "Registered team members",
      icon: "👥",
      color: "blue",
    },
    {
      title: "Customer Leads",
      value: "0",
      description: "Potential customers",
      icon: "🎯",
      color: "purple",
    },
    {
      title: "Active Projects",
      value: "0",
      description: "Ongoing solar projects",
      icon: "☀️",
      color: "orange",
    },
    {
      title: "Pending Tasks",
      value: "0",
      description: "Tasks awaiting completion",
      icon: "📋",
      color: "green",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">POWERTEK ENGINEERING ENTERPRISE</p>
          <h1>Business Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome to your workspace. Here's an overview of your business.
          </p>
        </div>

        <div className="dashboard-date">
          <span>☀️</span>
          <div>
            <strong>Solar Operations</strong>
            <small>Business overview</small>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div
            className={`stat-card stat-${stat.color}`}
            key={stat.title}
          >
            <div className="stat-card-top">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-indicator">Overview</span>
            </div>

            <h3>{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Business Operations</h2>
            <p>Your key operational areas</p>
          </div>
        </div>

        <div className="operations-grid">
          <div className="operation-card">
            <span className="operation-icon">👨‍💼</span>
            <h3>Employee Management</h3>
            <p>Manage employee details and team information.</p>
          </div>

          <div className="operation-card">
            <span className="operation-icon">📈</span>
            <h3>Lead Management</h3>
            <p>Track potential customers and sales opportunities.</p>
          </div>

          <div className="operation-card">
            <span className="operation-icon">🛠️</span>
            <h3>Project Operations</h3>
            <p>Monitor solar installation projects and progress.</p>
          </div>

          <div className="operation-card">
            <span className="operation-icon">📝</span>
            <h3>Task Management</h3>
            <p>Organize work assignments and pending activities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
