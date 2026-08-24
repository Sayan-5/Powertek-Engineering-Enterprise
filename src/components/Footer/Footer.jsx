import React from "react";
import { Link } from "react-scroll";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ================= TOP ================= */}

        <div className="footer-top">

          {/* BRAND */}
          <div className="footer-brand">

            <div className="footer-logo">
              POWERTEK
              <span>.</span>
            </div>

            <p>
              Engineering reliable electrical and renewable
              energy solutions for a better and brighter future.
            </p>

            <div className="footer-location">
              <span className="location-dot"></span>
              Farakka, Murshidabad, West Bengal
            </div>

          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">

            <h4>Quick Links</h4>

            <ul>
              <li>
                <Link to="about" smooth duration={600}>
                  About
                </Link>
              </li>

              <li>
                <Link to="services" smooth duration={600}>
                  Services
                </Link>
              </li>

              <li>
                <Link to="clients" smooth duration={600}>
                  Clients
                </Link>
              </li>

              <li>
                <Link to="projects" smooth duration={600}>
                  Projects
                </Link>
              </li>

              <li>
                <Link to="contact" smooth duration={600}>
                  Contact
                </Link>
              </li>
            </ul>

          </div>

          {/* SERVICES */}
          <div className="footer-column">

            <h4>Services</h4>

            <ul>
              <li>Electrical Installation</li>
              <li>Solar EPC Solutions</li>
              <li>Panel Installation</li>
              <li>Instrumentation</li>
              <li>Electrical Supply</li>
            </ul>

          </div>

          {/* CONTACT */}
          <div className="footer-column footer-contact">

            <h4>Get in Touch</h4>

            <a href="tel:8101721075">
              +91 81017 21075
            </a>

            <a href="mailto:powertekee@gmail.com">
              powertekee@gmail.com
            </a>

            <Link
              to="contact"
              smooth
              duration={600}
              className="footer-contact-button"
            >
              Start a conversation
              <span>↗</span>
            </Link>

          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="footer-bottom">

          <p>
            © {currentYear} M/S Powertek Engineering Enterprise.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <NavLink to="/terms">
              Terms of Service
            </NavLink>

            <NavLink to="/privacy">
              Privacy Policy
            </NavLink>

          </div>

          <div className="footer-made">
            Built with <span>♥</span> for a brighter future.
          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;