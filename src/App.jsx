import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Services from "./components/Programs/Services";
import About from "./components/About/About";
import Project from "./components/Project0/Project";
import PastProject from "./components/PastProject/Project001";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import SolarPower from "./components/SolarPower/SolarPower";

const HomeContent = () => {
  return (
    <>
      <Hero />

      <div className="container">
        {/* ================= ABOUT ================= */}
        <section id="about">
          <About />
        </section>

        {/* ================= SERVICES ================= */}
        <section id="services">
          <Services />
        </section>

        {/* ================= CLIENTS ================= */}
        <section id="clients">
          <Project />
        </section>

        {/* ================= PROJECTS ================= */}
        <section id="projects">
          <PastProject />
        </section>

        {/* ================= CONTACT ================= */}
        <section id="contact">
          <Contact />
        </section>
      </div>
    </>
  );
};

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomeContent />} />

        {/* Solar Power page */}
        <Route path="/solar-power" element={<SolarPower />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;