
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import powertekLogo from "../assets/logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

      if (
        profileError ||
        !profile ||
        !["admin", "employee", "customer"].includes(profile.role)
      ) {
        await supabase.auth.signOut();

        throw new Error(
          "Your account is not configured for the portal. Please contact your administrator."
        );
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-login">
      <div className="pt-login-glow pt-login-glow-one" />
      <div className="pt-login-glow pt-login-glow-two" />

      {/* Header */}
      <header className="pt-login-header">
        <a
          className="pt-brand"
          href="/"
          aria-label="Powertek home"
        >
          <img
            src={powertekLogo}
            alt="Powertek Engineering Enterprise"
            className="pt-brand-logo"
          />
        </a>

        <span className="pt-secure-label">
          <span className="pt-status-dot" />
          SECURE EMPLOYEE ACCESS
        </span>
      </header>

      {/* Login card */}
      <section className="pt-login-shell">
        {/* Left welcome panel */}
        <div className="pt-welcome-panel">
          <div className="pt-panel-topline">
            <span className="pt-mini-icon">✳</span>
            <span>YOUR WORKSPACE, CONNECTED</span>
          </div>

          <div className="pt-welcome-copy">
            <span className="pt-eyebrow">
              POWERING PROGRESS
            </span>

            <h1>
              Great work
              <br />
              starts <span>together.</span>
            </h1>

            <p>
              One secure workspace for your team, projects,
              attendance and everyday progress.
            </p>
          </div>

          <div className="pt-feature-list">
            <div className="pt-feature">
              <span className="pt-feature-icon">↗</span>

              <div>
                <strong>Work smarter</strong>
                <small>
                  Keep your daily tasks organized.
                </small>
              </div>
            </div>

            <div className="pt-feature">
              <span className="pt-feature-icon">◷</span>

              <div>
                <strong>Stay in sync</strong>
                <small>
                  Keep track of work and attendance.
                </small>
              </div>
            </div>
          </div>

          <div className="pt-panel-footer">
            <span>POWERING YOUR EVERYDAY WORK</span>
            <span>01 / WORKSPACE</span>
          </div>
        </div>

        {/* Right login panel */}
        <div className="pt-form-panel">
          <div className="pt-form-heading">
            <span className="pt-form-kicker">
              WELCOME BACK
            </span>

            <h2>Sign in to your portal</h2>

            <p>
              Enter your company account details to continue.
            </p>
          </div>

          <form
            className="pt-login-form"
            onSubmit={handleLogin}
          >
            {/* Email */}
            <div className="pt-field">
              <label htmlFor="portal-email">
                Work email
              </label>

              <div className="pt-input-wrap">
                <span
                  className="pt-input-icon"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="3"
                    />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>

                <input
                  id="portal-email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="pt-field">
              <div className="pt-label-row">
                <label htmlFor="portal-password">
                  Password
                </label>

                <span>Keep it private</span>
              </div>

              <div className="pt-input-wrap">
                <span
                  className="pt-input-icon"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="3"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="M12 14v3" />
                  </svg>
                </span>

                <input
                  id="portal-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="pt-password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Login error */}
            {error && (
              <div
                className="pt-login-error"
                role="alert"
              >
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="pt-submit-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Signing you in..."
                  : "Sign in to workspace"}
              </span>

              {!loading && (
                <span aria-hidden="true">→</span>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="pt-login-security">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>

            <span>
              Your account is protected by secure authentication.
            </span>
          </div>

          <p className="pt-login-help">
            Need access?{" "}
            <span>Contact your administrator.</span>
          </p>

          {/* Footer */}
          <div className="pt-form-bottom">
            <span>
              © {new Date().getFullYear()} Powertek Engineering
            </span>

            <span>EMPLOYEE PORTAL</span>
          </div>
        </div>
      </section>
    </main>
  );
}
