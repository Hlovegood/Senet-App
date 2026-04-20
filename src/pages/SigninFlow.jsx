import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabase";
import BackButton from "../components/BackButton";
import "./SigninFlow.css";

import senetIcon from "../assets/icons/Senet icon.png";
import googleIcon from "../assets/icons/Google Icon.png";
import appleIcon from "../assets/icons/Apple Icon.png";
import facebookIcon from "../assets/icons/Facebook Icon.png";

export default function SigninFlow() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !data) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        localStorage.setItem("pendingUserId", data.id);
        localStorage.setItem("userId", data.id);

        navigate("/feed");
      }
    } catch (err) {
      setErrorMessage("Connection error. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flow-wrapper">
      <div className="flow-screen">
        <div className="flow-header">
          <BackButton to="/" />
          <div className="header-brand">
            <img src={senetIcon} alt="Senet" className="brand-logo-small" />
            <h1 className="brand-title">Sign In</h1>
          </div>
        </div>

        <form className="flow-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-field">
              <User size={20} className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-field">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </button>
            </div>
            {errorMessage && (
              <p className="error-text-inline">{errorMessage}</p>
            )}
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Checking..." : "Log In"}
          </button>
        </form>

        <div className="flow-footer">
          <p className="terms-text">
            By continuing, you agree to the <br />
            <strong>Terms of Services & Privacy Policy</strong>
          </p>

          <div className="flow-divider">
            <span className="flow-line"></span>
            <span className="flow-or">Or</span>
            <span className="flow-line"></span>
          </div>

          <div className="flow-socials">
            <button className="social-btn">
              <img src={googleIcon} alt="G" />
            </button>
            <button className="social-btn">
              <img src={appleIcon} alt="A" />
            </button>
            <button className="social-btn">
              <img src={facebookIcon} alt="F" />
            </button>
          </div>

          <p className="signup-redirect">
            Don't have an account? <Link to="/signup">Sign-up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
