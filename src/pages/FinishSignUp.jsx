import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import './FinishSignUp.css';

import senetLogoLarge from '../assets/icons/Senet icon.png';

export default function FinishSignup() {
  return (
    <div className="finish-wrapper">
      <div className="finish-screen">
        <div className="finish-header">
          <BackButton to="/allergy" />
        </div>

        <div className="finish-content">
          <div className="success-logo-container">
            <img src={senetLogoLarge} alt="Senet Success" className="success-logo" />
          </div>
          <h2 className="finish-title">You’re all set</h2>
        </div>

        <div className="finish-footer">
          <Link to="/feed" className="get-started-link">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}