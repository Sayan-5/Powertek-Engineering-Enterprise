
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import PortalLayout from "./PortalLayout";
import Dashboard from "./Dashboard";
import Employees from "./Employees";
import Tasks from "./Tasks";
import Customers from "./Customers";
import Projects from "./Projects";
import Attendance from "./Attendance";
import SiteVisits from "./SiteVisits";
import Documents from "./Documents";

const App = () => {
  return (
    <HashRouter>
      <PortalLayout>
        <Routes>
            
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/site-visits" element={<SiteVisits />} />
          <Route path="/documents" element={<Documents />} />

          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </PortalLayout>
    </HashRouter>
  );
};

export default App;
