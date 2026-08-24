import React from "react";
import "./Project001.css";

import project_01 from "../../assets/project-01.png";
import project_02 from "../../assets/project-02.png";
import project_03 from "../../assets/project-03.png";
import project_04 from "../../assets/project-04.png";
import project_05 from "../../assets/project-05.png";
import project_06 from "../../assets/project-06.png";

const projects = [
  {
    number: "01",
    title: "Control Panels",
    description: "Control Panels & Wiring Accessories",
    year: "2019",
    image: project_01,
  },
  {
    number: "02",
    title: "Electrical Installation",
    description: "Electrical Installation & Supply",
    year: "2018 — 2020",
    image: project_02,
  },
  {
    number: "03",
    title: "Instrumentation",
    description: "Instrumentation & Cable Supply",
    year: "2020",
    image: project_03,
  },
  {
    number: "04",
    title: "Lighting & Switchgear",
    description: "Lighting & Switchgear Installation",
    year: "2019",
    image: project_04,
  },
  {
    number: "05",
    title: "Panel Installation",
    description: "Panel Installation & Testing",
    year: "2019",
    image: project_05,
  },
  {
    number: "06",
    title: "Electrical Supply",
    description: "Electrical Consumables Supply",
    year: "2020",
    image: project_06,
  },
];

const PastProject = () => {
  return (
    <section className="past-projects-section">

      <div className="past-projects-container">

        {/* ================= HEADER ================= */}

        <div className="past-projects-header">

          <div className="past-projects-label">
            <span></span>
            OUR EXPERIENCE
          </div>

          <div className="past-projects-heading">

            <h2>
              Past
              <br />
              <span>Projects.</span>
            </h2>

            <p>
              A selection of engineering, electrical and industrial
              work delivered through reliable solutions, technical
              expertise and quality execution.
            </p>

          </div>

        </div>

        {/* ================= PROJECT GRID ================= */}

        <div className="past-projects-grid">

          {projects.map((project, index) => (
            <article
              className={`past-project-card ${
                index === 0 ? "featured-project" : ""
              }`}
              key={project.number}
            >

              {/* Image */}
              <div className="past-project-image">

                <img
                  src={project.image}
                  alt={project.title}
                />

                <div className="past-project-overlay"></div>

                {/* Number */}
                <div className="past-project-number">
                  {project.number}
                </div>

                {/* Hover Arrow */}
                <div className="past-project-arrow">
                  ↗
                </div>

              </div>

              {/* Content */}
              <div className="past-project-content">

                <div className="past-project-meta">

                  <span>POWERTEK PROJECT</span>

                  <span>{project.year}</span>

                </div>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <div className="past-project-line"></div>

              </div>

            </article>
          ))}

        </div>

      </div>

    </section>
  );
};

export default PastProject;