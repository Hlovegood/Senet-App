import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './AgeSelect.css';

import senetIcon from '../assets/icons/Senet icon.png';

const ageOptions = [
  { id: '14-21', label: '14-21', icons: ['👦🏾', '👧🏾'] },
  { id: '22-30', label: '22-30', icons: ['👨🏾'] },
  { id: '31-40', label: '31-40', icons: ['👨🏾‍𝦑', '👩🏾‍𝦑'] },
  { id: '40+', label: '40+', icons: ['👨🏼‍🦳'] },
  { id: 'prefer-not-say', label: 'Prefer Not Say', icons: [] }
];

export default function AgeSelection() {
  const [selectedAge, setSelectedAge] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedAge) {
      navigate('/cuisineselect');
    }
  };

  return (
    <div className="flow-wrapper">
      <div className="flow-screen age-selection-screen">
        <div className="flow-header age-header">
          <Link to="/signupflow" className="back-button">
            <ChevronLeft size={28} color="#fff" />
          </Link>
          <div className="header-brand-center">
            <img src={senetIcon} alt="Senet" className="brand-logo-small" />
            <span className="brand-text-small">Senet</span>
          </div>
          <Link to="/cuisineselect" className="skip-btn-text">
            Skip
          </Link>
        </div>

        <h1 className="age-prompt-title">How old are you?</h1>

        <div className="age-options-list">
          {ageOptions.map((option) => (
            <button 
              key={option.id}
              className={`age-option-item ${selectedAge === option.id ? 'active' : ''}`}
              onClick={() => setSelectedAge(option.id)}
            >
              <span className="age-radio-circle"></span>
              <div className="age-label-group">
                <span className="age-label-text">{option.label}</span>
                <span className="age-label-emojis">{option.icons.join(' ')}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flow-action-footer">
          <button 
            type="submit" 
            className="age-submit-btn" 
            disabled={!selectedAge}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}