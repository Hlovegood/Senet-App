import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Signin.css';

import img1 from '../assets/Imgs/Carousel-img (1).png';
import img2 from '../assets/Imgs/Carousel-img (2).png';
import img3 from '../assets/Imgs/Carousel-img (3).png';
import img4 from '../assets/Imgs/Carousel-img (4).png';
import img5 from '../assets/Imgs/Carousel-img (5).png';
import img6 from '../assets/Imgs/Carousel-img (6).png';
import img7 from '../assets/Imgs/Carousel-img (7).png';
import img8 from '../assets/Imgs/Carousel-img (8).png';
import img9 from '../assets/Imgs/Carousel-img (9).png';

import googleIcon from '../assets/icons/Google Icon.png';
import appleIcon from '../assets/icons/Apple Icon.png';
import facebookIcon from '../assets/icons/Facebook Icon.png';

const carouselImages = [
  { id: 1, src: img1 },
  { id: 2, src: img2 },
  { id: 3, src: img3 },
  { id: 4, src: img4 },
  { id: 5, src: img5 },
  { id: 6, src: img6 },
  { id: 7, src: img7 },
  { id: 8, src: img8 },
  { id: 9, src: img9 },
];

export default function Signin() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="signin-wrapper">
      <div className="signin-screen">
        <div className="signin-content">
          
          {/* Automatic Carousel */}
          <div className="signin-carousel">
            {carouselImages.map((img, index) => (
              <div
                key={img.id}
                className={`signin-slide ${index === currentSlide ? 'active' : ''}`}
              >
                {index === currentSlide && (
                  <img src={img.src} alt={`Food ${img.id}`} className="signin-food-img" />
                )}
              </div>
            ))}
          </div>

          {/* Welcome Text */}
          <div className="signin-text-group">
            <h1 className="signin-title">
              Welcome Back To <span className="text-orange">Senet</span>
            </h1>
            <p className="signin-subtitle">Be your own personal chef</p>
          </div>

          {/* Action Area */}
          <div className="signin-actions">
            <Link to="/SigninFlow" className="signin-btn-main">
              Login
            </Link>

            <div className="signin-divider">
              <span className="signin-line"></span>
              <span className="signin-or">Or</span>
              <span className="signin-line"></span>
            </div>

            <div className="signin-socials">
              <button className="signin-social-btn"><img src={googleIcon} alt="Google" /></button>
              <button className="signin-social-btn"><img src={appleIcon} alt="Apple" /></button>
              <button className="signin-social-btn"><img src={facebookIcon} alt="Facebook" /></button>
            </div>

            <p className="signin-footer-text">
              New User? <Link to="/signup" className="signin-signup-link">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}