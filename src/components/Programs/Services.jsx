import React from "react";
import "./Services.css";

import program_1 from "../../assets/programs-1.png";
import program_2 from "../../assets/programs-2.png";
import program_3 from "../../assets/programs-3.png";
import program_4 from "../../assets/programs-4.png";
import program_5 from "../../assets/programs-5.png";

const programs = [
  {
    id: "01",
    image: program_1,
  },
  {
    id: "02",
    image: program_2,
  },
  {
    id: "03",
    image: program_3,
  },
  {
    id: "04",
    image: program_4,
  },
  {
    id: "05",
    image: program_5,
  },
];

const Programs = () => {
  return (
    <section className="programs-section" id="services">

      {/* Background decoration */}
      <div className="programs-glow"></div>

      <div className="programs-container">

        {/* ================= HEADER ================= */}

        <div className="programs-header">

          <div className="programs-label">
            <span></span>
            WHAT WE DO
          </div>

          <div className="programs-heading-row">

            <h2>
              Our
              <br />
              <span>Services.</span>
            </h2>

            <p>
              Reliable engineering and renewable energy solutions
              designed to meet the evolving needs of businesses
              and communities.
            </p>

          </div>

        </div>

        {/* ================= SERVICES ================= */}

        <div className="programs-grid">

          {programs.map((program, index) => (
            <div
              className={`program-card program-card-${index + 1}`}
              key={program.id}
            >

              <img
                src={program.image}
                alt={`Powertek service ${program.id}`}
              />

              <div className="program-overlay"></div>

              <div className="program-number">
                {program.id}
              </div>

              <div className="program-card-bottom">

                <div>
                  <span className="program-small-title">
                    POWERTEK
                  </span>

                  <h3>
                    Engineering
                    <br />
                    Solutions
                  </h3>
                </div>

                <div className="program-arrow">
                  ↗
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Programs;