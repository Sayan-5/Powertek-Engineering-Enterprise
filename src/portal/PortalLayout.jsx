
import React from "react";
import { NavLink } from "react-router-dom";
import "./portal.css";

const PortalLayout = ({ children }) => {
  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <h2>Powertek</h2>
        <p>Business Portal</p>

        <nav className="portal-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/employees">Employees</NavLink>
          <NavLink to="/attendance">Attendance & Leave</NavLink>
          <NavLink to="/site-visits">Site Visit Reports</NavLink>
          <NavLink to="/documents">Document Management</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/customers">Customers</NavLink>
          <NavLink to="/projects">Solar Projects</NavLink>
        </nav>
      </aside>

      <main className="portal-main">
        {children}
      </main>
    </div>
  );
};

export default PortalLayout;
