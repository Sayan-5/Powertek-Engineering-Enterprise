import React from "react";
import "./About.css";

import aboutImg from "../../assets/about.png";

const About = () => {
  return (
    <section className="about" id="about">

      {/* Background decoration */}
      <div className="about-glow"></div>

      <div className="about-container">

        {/* ================= IMAGE ================= */}
        <div className="about-visual">

          <div className="about-image-wrapper">
            <img
              src={aboutImg}
              alt="Powertek Engineering"
              className="about-image"
            />

            <div className="image-overlay"></div>
          </div>

          {/* Floating Experience Card */}
          <div className="experience-card">
            <span className="experience-number">EPC</span>
            <span className="experience-text">
              Solar Engineering
              <br />
              & Installation
            </span>
          </div>

          {/* Decorative line */}
          <div className="about-decoration"></div>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="about-content">

          <div className="section-label">
            <span></span>
            ABOUT POWERTEK
          </div>

          <h2>
            Building a
            <br />
            <span>Brighter Future.</span>
          </h2>

          <p className="about-intro">
            M/S Powertek Engineering Enterprise is a proprietorship
            firm specializing in solar EPC solutions. We deliver
            reliable and efficient renewable energy systems for
            residential and commercial applications.
          </p>

          {/* ================= INFO CARDS ================= */}

          <div className="about-info">

            <div className="info-item">
              <div className="info-icon">01</div>

              <div>
                <h3>Our Expertise</h3>

                <p>
                  With experience in the electrical sector, we have
                  expanded our expertise across residential and
                  commercial solar projects.
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon orange">02</div>

              <div>
                <h3>Our Partnership</h3>

                <p>
                  We are an authorized Distributor Partner of
                  MFins Solar Pvt. Ltd., delivering quality solar
                  solutions across Tripura and Northeast India.
                </p>
              </div>
            </div>

          </div>

          {/* ================= EXPERIENCE ================= */}

          <div className="work-experience">

            <div className="experience-heading">
              <span></span>
              <h3>Our Work Experience</h3>
            </div>

            <div className="experience-grid">

              <div className="work-card">
                <strong>3 kW</strong>

                <span>
                  Solar Systems
                  <br />
                  5 Households
                </span>
              </div>

              <div className="work-card orange-card">
                <strong>4 kW</strong>

                <span>
                  Solar Systems
                  <br />
                  3 Households
                </span>
              </div>

            </div>

          </div>

          {/* ================= GOAL ================= */}

          <div className="goal-box">

            <div className="goal-icon">
              ↗
            </div>

            <div>
              <h3>Our Goal</h3>

              <p>
                To promote renewable energy in Northeast India
                through quality installations and reliable service.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default About;