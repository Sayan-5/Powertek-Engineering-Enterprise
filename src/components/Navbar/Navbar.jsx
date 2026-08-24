import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import "./Navbar.css";

import logo from "../../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">

        {/* Logo */}
        <NavLink to="/" className="logo-link" onClick={closeMenu}>
          <img src={logo} alt="Powertek Engineering Enterprise" className="logo" />
        </NavLink>

        {/* Desktop Navigation */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>

          <li>
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
          </li>

          {isHome && (
            <>
              <li>
                <Link
                  to="services"
                  smooth={true}
                  duration={700}
                  offset={-90}
                  onClick={closeMenu}
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="clients"
                  smooth={true}
                  duration={700}
                  offset={-90}
                  onClick={closeMenu}
                >
                  Clients
                </Link>
              </li>

              <li>
                <Link
                  to="projects"
                  smooth={true}
                  duration={700}
                  offset={-90}
                  onClick={closeMenu}
                >
                  Projects
                </Link>
              </li>

              <li>
                <Link
                  to="contact"
                  smooth={true}
                  duration={700}
                  offset={-90}
                  className="contact-btn"
                  onClick={closeMenu}
                >
                  Contact Us
                  <span>↗</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <NavLink
              to="/solar-power"
              className="solar-link"
              onClick={closeMenu}
            >
              Solar Power
              <span className="solar-dot"></span>
            </NavLink>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className={`menu-icon ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;