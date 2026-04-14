import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Signin.css';

import img2 from '../assets/Imgs/Carousel-img (2).png';
import img3 from '../assets/Imgs/Carousel-img (3).png';
import img4 from '../assets/Imgs/Carousel-img (4).png';
import img6 from '../assets/Imgs/Carousel-img (6).png';
import img10 from '../assets/Imgs/Carousel-img (10).png';
import img12 from '../assets/Imgs/Carousel-img (12).png';
import img13 from '../assets/Imgs/Carousel-img (13).png';


import senetIcon from '../assets/icons/Senet icon.png';
import googleIcon from '../assets/icons/Google Icon.png';
import appleIcon from '../assets/icons/Apple Icon.png';
import facebookIcon from '../assets/icons/Facebook Icon.png';

const carouselImages = [
  { id: 1, src: img2 },
  { id: 2, src: img3 },
  { id: 3, src: img4 },
  { id: 4, src: img6 },
  { id: 5, src: img10 },
  { id: 6, src: img12 },
  { id: 7, src: img13 },


];

export default function SignUp() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    const carouselTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => {
      clearTimeout(splashTimer);
      clearInterval(carouselTimer);
    };
  }, []);

  return (
    <div className="signin-wrapper">
      {showSplash && (
        <div className="full-screen-splash">
          <div className="splash-bundle">
            <img src={senetIcon} alt="Logo" className="splash-logo-animated" />
            <h1 className="splash-text-animated">Senet</h1>
          </div>
        </div>
      )}

      <div className="signin-screen">
        <div className={`signin-content ${!showSplash ? 'content-visible' : 'content-hidden'}`}>
          <div className="signin-carousel">
            {carouselImages.map((img, index) => (
              <div
                key={img.id}
                className={`signin-slide ${index === currentSlide ? 'active' : ''}`}
              >
                {index === currentSlide && (
                  <img src={img.src} alt="Food" className="signin-food-img" />
                )}
              </div>
            ))}
          </div>

          <div className="signin-text-group">
            <h1 className="signin-title">
              Welcome To <span className="text-orange">Senet</span>
            </h1>
            <p className="signin-subtitle">Be your own personal chef</p>
          </div>

          <div className="signin-actions">
            <Link to="/signupflow" className="signin-btn-main">
              Sign Up
            </Link>

            <div className="signin-divider">
              <span className="signin-line"></span>
              <span className="signin-or">Or</span>
              <span className="signin-line"></span>
            </div>

            <div className="signin-socials">
              <button className="signin-social-btn"><img src={googleIcon} alt="G" /></button>
              <button className="signin-social-btn"><img src={appleIcon} alt="A" /></button>
              <button className="signin-social-btn"><img src={facebookIcon} alt="F" /></button>
            </div>

            <p className="signin-footer-text">
              Already have an account?  <Link to="/" className="signin-signup-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}