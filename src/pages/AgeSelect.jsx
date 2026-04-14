import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './AgeSelect.css';

import senetIcon from '../assets/icons/Senet icon.png';

const ageOptions = [
  { id: '14-21', label: '14-21', icons: ['👦🏾', '👧🏾'] },
  { id: '22-30', label: '22-30', icons: ['👨🏾'] },
  { id: '31-40', label: '31-40', icons: ['👨🏾‍', '👩🏾‍'] },
  { id: '40+', label: '40+', icons: ['👨🏼‍🦳'] },
  { id: 'prefer-not-say', label: 'Prefer Not Say', icons: [] }
];

export default function AgeSelection() {
  const [selectedAge, setSelectedAge] = useState(null);
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (selectedAge) {
      navigate('/target');
    }
  };

  return (
    <div className="age-wrapper">
      <div className="age-screen">
        <div className="age-header">
          <Link to="/signup" className="back-circle">
            <ChevronLeft size={24} color="#fff" />
          </Link>
          <div className="age-brand">
            <img src={senetIcon} alt="Senet" className="age-logo" />
            <span className="age-brand-name">Senet</span>
          </div>
          <Link to="/cuisineselect" className="skip-link-btn">
            Skip
          </Link>
        </div>

        <h2 className="age-title">How old are you?</h2>

        <div className="age-list">
          {ageOptions.map((option) => (
            <div 
              key={option.id}
              className={`age-item ${selectedAge === option.id ? 'active' : ''}`}
              onClick={() => setSelectedAge(option.id)}
            >
              <div className="radio-outer">
                {selectedAge === option.id && <div className="radio-inner" />}
              </div>
              <span className="age-text">
                {option.label} {option.icons.join(' ')}
              </span>
            </div>
          ))}
        </div>

        <div className="age-footer">
          <button 
            type="button" 
            className="continue-redirect-btn" 
            disabled={!selectedAge}
            onClick={handleRedirect}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}