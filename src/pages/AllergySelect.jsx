import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import './AllergySelect.css';

export default function AllergySelect() {
  const [allergies, setAllergies] = useState([]);
  const [hasNoAllergies, setHasNoAllergies] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState("");

  useEffect(() => {
    const fetchAllergies = async () => {
      const { data, error } = await supabase
        .from('allergies')
        .select('name_en');
      
      if (!error && data) {
        setAllergies(data);
      }
    };
    fetchAllergies();
  }, []);

  return (
    <div className="allergy-wrapper">
      <div className="allergy-screen">
        <div className="allergy-header">
          <BackButton to="/cuisines" />
          <Link to="/finish" className="skip-link-btn">
            Skip
          </Link>
        </div>

        <div className="allergy-title-section">
          <h2 className="allergy-main-title">Allergies</h2>
          <p className="allergy-subtitle">Choose food allergies you have</p>
        </div>

        <div className="allergy-options-container">
          <div 
            className={`none-option-card ${hasNoAllergies ? 'active' : ''}`}
            onClick={() => {
              setHasNoAllergies(!hasNoAllergies);
              setSelectedAllergy("");
            }}
          >
            <div className="radio-outer">
              {hasNoAllergies && <div className="radio-inner" />}
            </div>
            <span className="option-text">None / No Allergies</span>
          </div>

          <div className={`dropdown-wrapper ${hasNoAllergies ? 'hidden' : 'visible'}`}>
            <div className="select-container">
              <select 
                value={selectedAllergy}
                onChange={(e) => setSelectedAllergy(e.target.value)}
                className="allergy-dropdown"
              >
                <option value="" disabled>Select Main Category</option>
                {allergies.map((allergy, index) => (
                  <option key={index} value={allergy.name_en}>
                    {allergy.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="allergy-footer">
          <Link 
            to="/finish" 
            className={`continue-submit-link ${(hasNoAllergies || selectedAllergy) ? '' : 'disabled'}`}
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}