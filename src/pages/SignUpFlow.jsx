import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { supabase } from '../supabase';
import './Signupflow.css';

import googleIcon from '../assets/icons/Google Icon.png';
import appleIcon from '../assets/icons/Apple Icon.png';
import facebookIcon from '../assets/icons/Facebook Icon.png';

export default function SignupFlow() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase
        .from('users')
        .insert([
          {
            username: formData.username,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            password: formData.password
          }
        ]);

      if (supabaseError) throw supabaseError;

      alert('Account created successfully!');
      navigate('/signin');
    } catch (err) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-flow-wrapper">
      <div className="signup-flow-screen">
        <div className="signup-flow-header">
          <Link to="/" className="back-button">
            <ChevronLeft size={28} color="#fff" />
          </Link>
          <h1 className="signup-flow-title">Create Account</h1>
        </div>

        <form className="signup-flow-form" onSubmit={handleSignup}>
          <div className="signup-input-group">
            <label>Username</label>
            <div className="signup-input-field">
              <User size={20} className="signup-icon" />
              <input name="username" placeholder="Username" onChange={handleChange} required />
            </div>
          </div>

          <div className="name-row">
            <div className="signup-input-group">
              <label>First Name</label>
              <div className="signup-input-field">
                <input name="firstName" placeholder="First Name" onChange={handleChange} required />
              </div>
            </div>
            <div className="signup-input-group">
              <label>Last Name</label>
              <div className="signup-input-field">
                <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="signup-input-group">
            <label>Email Address</label>
            <div className="signup-input-field">
              <Mail size={20} className="signup-icon" />
              <input type="email" name="email" placeholder="Enter Email Address" onChange={handleChange} required />
            </div>
          </div>

          <div className="signup-input-group">
            <label>Password</label>
            <div className="signup-input-field">
              <Lock size={20} className="signup-icon" />
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Password" 
                onChange={handleChange}
                required 
              />
              <button type="button" className="signup-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="signup-input-group">
            <label>Repeat Password</label>
            <div className="signup-input-field">
              <Lock size={20} className="signup-icon" />
              <input 
                name="confirmPassword"
                type={showPassword ? "text" : "password"} 
                placeholder="Repeat Password" 
                onChange={handleChange}
                required 
              />
            </div>
            {error && <p className="signup-error-msg">{error}</p>}
          </div>

          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Continue"}
          </button>
        </form>

        <div className="signup-flow-footer">
          <p className="signup-terms">
            By continuing, you agree to the <br />
            <strong>Terms of Services & Privacy Policy</strong>
          </p>

          <div className="signup-divider">
            <span className="signup-line"></span>
            <span className="signup-or">Or</span>
            <span className="signup-line"></span>
          </div>

          <div className="signup-socials">
            <button className="signup-social-btn"><img src={googleIcon} alt="G" /></button>
            <button className="signup-social-btn"><img src={appleIcon} alt="A" /></button>
            <button className="signup-social-btn"><img src={facebookIcon} alt="F" /></button>
          </div>

          <p className="login-redirect">
            Already have an account? <Link to="/signin">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}