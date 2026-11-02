
import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

import PortalLayout from "./PortalLayout";
import Dashboard from "./Dashboard";
import Employees from "./Employees";
import Tasks from "./Tasks";
import Customers from "./Customers";
import Projects from "./Projects";
import CustomerProjects from "./CustomerProjects";
import Attendance from "./Attendance";
import SiteVisits from "./SiteVisits";
import Documents from "./Documents";
import Login from "./Login";

const VALID_ROLES = ["admin", "employee", "customer"];

// PROTECTED ROUTE
function ProtectedRoute({
  session,
  profile,
  allowedRoles,
  children,
}) {
  const location = useLocation();

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(profile.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// MAIN PORTAL ROUTES
function PortalRoutes() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  // AUTHENTICATION LISTENER
  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (active) {
          setSession(newSession);
          setAuthLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      setSession(error ? null : data.session);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // LOAD USER PROFILE
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!session?.user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfile(null);
      setProfileLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, full_name, employee_code, department, role, status"
        )
        .eq("id", session.user.id)
        .single();

      if (!active) return;

      if (
        error ||
        !data ||
        !VALID_ROLES.includes(data.role) ||
        data.status !== "active"
      ) {
        setProfile(null);
        setProfileLoading(false);

        await supabase.auth.signOut();
        return;
      }

      setProfile(data);
      setProfileLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  // LOADING SCREEN
  if (authLoading || profileLoading) {
    return (
      <div style={{ padding: 30 }}>
        Loading Powertek Portal...
      </div>
    );
  }

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          session && profile ? (
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* MAIN PORTAL */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            session={session}
            profile={profile}
          >
            <PortalLayout profile={profile} />
          </ProtectedRoute>
        }
      >

        {/* DASHBOARD */}
        <Route
          index
          element={<Dashboard profile={profile} />}
        />

        {/* TASKS */}
        <Route
          path="tasks"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              allowedRoles={["admin", "employee"]}
            >
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* ATTENDANCE */}
        <Route
          path="attendance"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              allowedRoles={["admin", "employee"]}
            >
              <Attendance />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="employees"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              allowedRoles={["admin"]}
            >
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMERS */}
        <Route
          path="customers"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              allowedRoles={["admin"]}
            >
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* SOLAR PROJECTS */}
        <Route
          path="projects"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              allowedRoles={["admin", "customer"]}
            >
              {profile?.role === "admin" ? (
                <Projects />
              ) : (
                <CustomerProjects profile={profile} />
              )}
            </ProtectedRoute>
          }
        />

        {/* SITE VISITS */}
        <Route
          path="site-visits"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              allowedRoles={["admin", "employee"]}
            >
              <SiteVisits />
            </ProtectedRoute>
          }
        />

        {/* DOCUMENTS */}
        <Route
          path="documents"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              allowedRoles={["admin"]}
            >
              <Documents />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN PAGE */}
        <Route
          path="*"
          element={<h1>Page not found</h1>}
        />

      </Route>

      {/* UNKNOWN ROUTES */}
      <Route
        path="*"
        element={
          <Navigate
            to={session ? "/" : "/login"}
            replace
          />
        }
      />

    </Routes>
  );
}

// APPLICATION ENTRY
export default function App() {
  return (
    <HashRouter>
      <PortalRoutes />
    </HashRouter>
  );
}
