import React from "react";
import "./Project.css";

import project_1 from "../../assets/project-1.png";
import project_2 from "../../assets/project-2.png";
import project_3 from "../../assets/project-3.png";
import project_4 from "../../assets/project-4.png";
import project_5 from "../../assets/project-5.png";
import project_6 from "../../assets/project-6.png";

const clients = [
  {
    number: "01",
    name: "NTPC",
    service: "Electrical Installation & Supply",
    year: "2018 — 2020",
    image: project_1,
  },
  {
    number: "02",
    name: "Yokogawa",
    service: "Instrumentation & Cable Supply",
    year: "2020",
    image: project_2,
  },
  {
    number: "03",
    name: "BHEL",
    service: "Control Panels & Wiring Accessories",
    year: "2019",
    image: project_3,
  },
  {
    number: "04",
    name: "TIPL",
    service: "Lighting & Switchgear Installation",
    year: "2019",
    image: project_4,
  },
  {
    number: "05",
    name: "Powertronix",
    service: "Panel Installation & Testing",
    year: "2019",
    image: project_5,
  },
  {
    number: "06",
    name: "Wizer",
    service: "Electrical Consumables Supply",
    year: "2020",
    image: project_6,
  },
];

const Project = () => {
  return (
    <section className="clients-section">

      <div className="clients-container">

        {/* ================= HEADER ================= */}

        <div className="clients-header">

          <div className="clients-label">
            <span></span>
            OUR CLIENTS
          </div>

          <div className="clients-heading-row">

            <h2>
              Trusted
              <br />
              <span>Partners.</span>
            </h2>

            <p>
              Our experience is built through trusted partnerships
              and reliable engineering solutions delivered across
              diverse industrial applications.
            </p>

          </div>

        </div>

        {/* ================= CLIENT GRID ================= */}

        <div className="clients-grid">

          {clients.map((client) => (
            <article
              className="client-card"
              key={client.number}
            >

              {/* Image */}
              <div className="client-image">

                <img
                  src={client.image}
                  alt={`${client.name} project`}
                />

                <div className="client-image-overlay"></div>

                <span className="client-number">
                  {client.number}
                </span>

              </div>

              {/* Information */}
              <div className="client-info">

                <div className="client-info-top">

                  <span className="client-category">
                    POWERTEK CLIENT
                  </span>

                  <span className="client-year">
                    {client.year}
                  </span>

                </div>

                <h3>{client.name}</h3>

                <p>{client.service}</p>

                <div className="client-accent"></div>

              </div>

            </article>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Project;