import React from "react";
import "./Hero.css";

import { Link } from "react-scroll";

import dark_arrow from "../../assets/dark_arrow.png";

const Hero = () => {
  return (
    <section className="hero">

      {/* Background Effects */}
      <div className="hero-overlay"></div>

      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      {/* Decorative Grid */}
      <div className="hero-grid"></div>

      {/* Hero Content */}
      <div className="hero-content">

        <div className="hero-badge">
          <span></span>
          ENGINEERING • ENERGY • INNOVATION
        </div>

        <p className="hero-company">
          M/S POWERTEK ENGINEERING ENTERPRISE
        </p>

        <h1>
          Engineering
          <br />
          <span>the Future.</span>
        </h1>

        <p className="hero-description">
          Innovative engineering solutions designed to power
          industries, businesses, and a better tomorrow.
        </p>

        <div className="hero-actions">

          <Link
            to="about"
            smooth={true}
            offset={-80}
            duration={800}
            className="hero-btn"
          >
            Explore Our Work

            <span className="arrow-circle">
              <img src={dark_arrow} alt="Arrow" />
            </span>
          </Link>

          <Link
            to="contact"
            smooth={true}
            offset={-80}
            duration={800}
            className="hero-secondary-btn"
          >
            Let's Talk
          </Link>

        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span></span>
        <p>SCROLL TO EXPLORE</p>
      </div>

      {/* Bottom Gradient */}
      <div className="hero-bottom-gradient"></div>

    </section>
  );
};

export default Hero;