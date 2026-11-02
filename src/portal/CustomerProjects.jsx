
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function CustomerProjects({ profile }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchMyProjects() {
      if (!profile?.id) {
        setProjects([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          project_name,
          location,
          capacity_kw,
          budget,
          status,
          start_date,
          completion_date,
          description
        `)
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Customer projects error:", error);
        setError("Unable to load your projects. Please try again.");
        setProjects([]);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    }

    fetchMyProjects();

    return () => {
      active = false;
    };
  }, [profile?.id]);

  return (
    <div className="dashboard-page customer-projects-page">

      {/* PAGE HEADER */}
      <header className="dashboard-welcome">

        <div className="dashboard-heading-copy">

          <p className="dashboard-eyebrow">
            POWERTEK ENGINEERING ENTERPRISE
          </p>

          <h1>My Solar Projects</h1>

          <p className="dashboard-subtitle">
            Welcome, {profile?.full_name || "Customer"}.
            Track your solar installations.
          </p>

        </div>

        <div className="dashboard-date">

          <span className="dashboard-solar-icon">
            ☀
          </span>

          <div>
            <strong>Solar Operations</strong>
            <small>Customer Portal</small>
          </div>

        </div>

      </header>

      {/* PROJECT SECTION */}
      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <h2>Your Projects</h2>
            <p>
              Solar installations registered to your account.
            </p>
          </div>

          {!loading && !error && (
            <span className="customer-project-count">
              {projects.length}{" "}
              {projects.length === 1 ? "Project" : "Projects"}
            </span>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="operation-card">
            <p>Loading your solar projects...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="operation-card">
            <h3>Unable to Load Projects</h3>
            <p>{error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && projects.length === 0 && (
          <div className="operation-card">
            <span className="operation-icon">☀️</span>

            <h3>No Projects Yet</h3>

            <p>
              Your solar project information will appear here
              once registered by Powertek.
            </p>
          </div>
        )}

        {/* PROJECT CARDS */}
        {!loading && !error && projects.length > 0 && (
          <div className="operations-grid">

            {projects.map((project) => (
              <article
                className="operation-card customer-project-card"
                key={project.id}
              >

                <div className="customer-project-card-header">
                  <span className="operation-icon">
                    ☀️
                  </span>

                  <span className="customer-project-status">
                    {project.status || "Pending"}
                  </span>
                </div>

                <h3>{project.project_name}</h3>

                <div className="customer-project-details">

                  <p>
                    <strong>Location</strong>
                    <span>
                      {project.location || "Not specified"}
                    </span>
                  </p>

                  <p>
                    <strong>System Capacity</strong>
                    <span>
                      {project.capacity_kw ?? "N/A"} kW
                    </span>
                  </p>

                  <p>
                    <strong>Start Date</strong>
                    <span>
                      {project.start_date || "Not scheduled"}
                    </span>
                  </p>

                  <p>
                    <strong>Completion Date</strong>
                    <span>
                      {project.completion_date || "Not scheduled"}
                    </span>
                  </p>

                  {project.budget != null && (
                    <p>
                      <strong>Project Budget</strong>
                      <span>
                        ₹{Number(project.budget).toLocaleString("en-IN")}
                      </span>
                    </p>
                  )}

                </div>

                {project.description && (
                  <div className="customer-project-description">
                    <strong>Project Description</strong>
                    <p>{project.description}</p>
                  </div>
                )}

              </article>
            ))}

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <span>POWERTEK ENGINEERING ENTERPRISE</span>
        <span>Customer Portal</span>
      </footer>

    </div>
  );
}

export default CustomerProjects;
