import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const Contact = () => {
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setStatus("Message sent successfully!");
          formRef.current.reset();
        },
        () => {
          setLoading(false);
          setStatus("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <section className="contact-section">

      <div className="contact-container">

        {/* ================= HEADER ================= */}

        <div className="contact-header">

          <div className="contact-label">
            <span></span>
            GET IN TOUCH
          </div>

          <h2>
            Let's build
            <br />
            <span>something better.</span>
          </h2>

          <p>
            Have a project, requirement, or business enquiry?
            Get in touch with Powertek Engineering Enterprise.
          </p>

        </div>

        {/* ================= MAIN CONTACT ================= */}

        <div className="contact-main">

          {/* ================= COMPANY INFO ================= */}

          <div className="contact-info">

            <div className="info-heading">
              <span>01</span>
              <h3>Company Information</h3>
            </div>

            <p className="info-description">
              Reliable engineering, electrical and renewable energy
              solutions backed by practical experience and quality
              service.
            </p>

            {/* Compliance */}

            <div className="contact-block">

              <h4>Compliance & Registration</h4>

              <div className="compliance-list">

                <div className="compliance-item">
                  <span>GSTIN</span>
                  <strong>19CLGPA7430R1ZM</strong>
                </div>

                <div className="compliance-item">
                  <span>Udyam Registration</span>
                  <strong>WB-13-0000353</strong>
                </div>

                <div className="compliance-item">
                  <span>PAN</span>
                  <strong>CLGPA7430R</strong>
                </div>

                <div className="compliance-item">
                  <span>Digital Signature</span>
                  <strong>Valid</strong>
                </div>

                <div className="compliance-item">
                  <span>SAC Codes</span>
                  <strong>995461, 998717</strong>
                </div>

              </div>

            </div>

            {/* Contact details */}

            <div className="contact-block">

              <h4>Contact Details</h4>

              <div className="detail-list">

                <div className="detail-item">
                  <div className="detail-icon">P</div>

                  <div>
                    <span>Proprietor</span>
                    <strong>Sairul Ali</strong>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon orange">☎</div>

                  <div>
                    <span>Phone</span>
                    <a href="tel:8101721075">
                      8101721075
                    </a>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">✉</div>

                  <div>
                    <span>Email</span>
                    <a href="mailto:powertekee@gmail.com">
                      powertekee@gmail.com
                    </a>
                  </div>
                </div>

              </div>

            </div>

            {/* Location */}

            <div className="location-card">

              <div className="location-icon">
                ↗
              </div>

              <div>
                <span>BASE LOCATION</span>

                <strong>
                  Farakka, Murshidabad,
                  <br />
                  West Bengal
                </strong>

                <small>
                  Operational Reach: Pan-India
                </small>
              </div>

            </div>

          </div>

          {/* ================= FORM ================= */}

          <div className="contact-form-wrapper">

            <div className="form-top">
              <div className="info-heading">
                <span>02</span>
                <h3>Send us a message</h3>
              </div>

              <div className="online-status">
                <span></span>
                Available for enquiries
              </div>
            </div>

            <p className="form-description">
              Tell us a little about your requirement and our team
              will get back to you.
            </p>

            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="contact-form"
            >

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="name">
                    YOUR NAME
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="from_name"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="from_email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

              </div>

              <div className="form-group">

                <label htmlFor="message">
                  YOUR MESSAGE
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project or requirement..."
                  rows="7"
                  required
                />

              </div>

              <button
                type="submit"
                className="send-button"
                disabled={loading}
              >
                <span>
                  {loading ? "Sending..." : "Send Message"}
                </span>

                {!loading && (
                  <span className="send-arrow">
                    ↗
                  </span>
                )}
              </button>

              {status && (
                <p
                  className={`status ${
                    status.includes("successfully")
                      ? "success"
                      : "error"
                  }`}
                >
                  {status}
                </p>
              )}

            </form>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Contact;