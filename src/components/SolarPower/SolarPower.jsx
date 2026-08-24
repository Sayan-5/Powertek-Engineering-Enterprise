import React from "react";
import "./SolarPower.css";

import mfinLogo from "../../assets/mfin_logo.png";
import powertekVideo from "../../assets/powertek_video.mp4";
import certificate from "../../assets/certificate.jpeg";

const SolarPower = () => {
  return (
    <main className="solar-page">

      {/* =========================================
          SOLAR HERO
      ========================================= */}

      <section className="solar-hero">

        {/* Background overlay */}
        <div className="solar-hero-overlay"></div>

        <div className="solar-hero-content">

          <div className="solar-label">
            <span></span>
            POWERTEK RENEWABLE ENERGY
          </div>

          <h1>
            Powering a
            <br />
            <span>Brighter Future.</span>
          </h1>

          <p>
            Complete solar power solutions designed to make
            clean and sustainable energy accessible for
            homes, businesses and industries.
          </p>

          <div className="solar-hero-buttons">

            <a
              href="#solar-video"
              className="solar-primary-btn"
            >
              Explore Solar
              <span>↗</span>
            </a>

            <a
              href="/#contact"
              className="solar-secondary-btn"
            >
              Talk to us
              <span>→</span>
            </a>

          </div>

        </div>

        {/* =========================================
            BOTTOM STATS
        ========================================= */}

        <div className="solar-hero-stats">

          <div className="solar-stat">

            <span className="stat-number">
              01
            </span>

            <div>
              <strong>Solar EPC</strong>
              <small>Complete solutions</small>
            </div>

          </div>

          <div className="solar-stat">

            <span className="stat-number orange">
              02
            </span>

            <div>
              <strong>Installation</strong>
              <small>Professional service</small>
            </div>

          </div>

          <div className="solar-stat">

            <span className="stat-number">
              03
            </span>

            <div>
              <strong>Distribution</strong>
              <small>Renewable products</small>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          REST OF YOUR SOLAR PAGE
      ========================================= */}

      <section className="solar-partner">

        <div className="solar-section-label">
          <span></span>
          OUR PARTNERSHIP
        </div>

        <div className="solar-partner-content">

          <div className="solar-partner-text">

            <h2>
              Authorized
              <br />
              <span>Distribution Partner.</span>
            </h2>

            <p>
              Powertek Engineering Enterprise is associated
              with MFins Solar Pvt. Ltd. to deliver reliable
              solar solutions and renewable energy products.
            </p>

          </div>

          <div className="solar-logo-card">

            <div className="partner-card-label">
              OFFICIAL PARTNER
            </div>

            <img
              src={mfinLogo}
              alt="MFins Solar"
            />

            <div className="partner-card-line"></div>

            <span>
              Solar Energy Solutions
            </span>

          </div>

        </div>

      </section>


      {/* VIDEO */}

      <section
        className="solar-video-section"
        id="solar-video"
      >

        <div className="solar-section-label">
          <span></span>
          SOLAR IN ACTION
        </div>

        <div className="solar-video-heading">

          <h2>
            See the
            <br />
            <span>difference.</span>
          </h2>

          <p>
            Discover how Powertek delivers practical,
            efficient and dependable solar energy solutions.
          </p>

        </div>

        <div className="solar-video-wrapper">

          <video
            src={powertekVideo}
            controls
            muted
            loop
            playsInline
            preload="metadata"
          />

        </div>

      </section>


      {/* SERVICES */}

      <section className="solar-services">

        <div className="solar-section-label">
          <span></span>
          WHAT WE PROVIDE
        </div>

        <div className="solar-services-grid">

          <div className="solar-service-card">
            <span>01</span>

            <div>
              <h3>Solar Installation</h3>

              <p>
                Professional solar system installation
                for residential and commercial applications.
              </p>
            </div>
          </div>

          <div className="solar-service-card">
            <span>02</span>

            <div>
              <h3>Solar EPC Solutions</h3>

              <p>
                Complete engineering, procurement and
                construction support for solar projects.
              </p>
            </div>
          </div>

          <div className="solar-service-card">
            <span>03</span>

            <div>
              <h3>Maintenance & Support</h3>

              <p>
                Reliable maintenance and service support
                for solar systems.
              </p>
            </div>
          </div>

          <div className="solar-service-card">
            <span>04</span>

            <div>
              <h3>Distribution Support</h3>

              <p>
                Renewable energy product distribution
                and franchise support across India.
              </p>
            </div>
          </div>

        </div>

      </section>


      {/* CERTIFICATE */}

      <section className="solar-certificate">

        <div className="certificate-text">

          <div className="solar-section-label">
            <span></span>
            OUR CREDENTIAL
          </div>

          <h2>
            Certified to
            <br />
            <span>deliver.</span>
          </h2>

          <p>
            Our partnership and certification reflect our
            commitment to professional standards and
            dependable renewable energy solutions.
          </p>

        </div>

        <div className="certificate-card">

          <div className="certificate-top">
            <span>POWERTEK</span>
            <span>VERIFIED</span>
          </div>

          <img
            src={certificate}
            alt="Powertek certification"
          />

          <div className="certificate-bottom">
            <span>Partnership Certificate</span>
            <span>↗</span>
          </div>

        </div>

      </section>


      {/* CTA */}

      <section
        className="solar-cta"
        id="solar-contact"
      >

        <div className="solar-cta-content">

          <div className="solar-section-label">
            <span></span>
            START YOUR SOLAR JOURNEY
          </div>

          <h2>
            Ready to switch
            <br />
            to <span>solar?</span>
          </h2>

          <p>
            Let's build a cleaner and more sustainable
            energy future together.
          </p>

          <a
            href="/#contact"
            className="solar-cta-button"
          >
            Contact Powertek
            <span>↗</span>
          </a>

        </div>

      </section>

    </main>
  );
};

export default SolarPower;