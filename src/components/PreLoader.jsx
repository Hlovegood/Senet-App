import React from 'react';
import './PreLoader.css';

export default function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="loader-content">
        <div className="spinner-ring"></div>
        <div className="loader-logo">
          <span className="logo-dot"></span>
        </div>
        <p className="loader-text">Preparing your recipe...</p>
      </div>
    </div>
  );
}