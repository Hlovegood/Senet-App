import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import './AllergySelect.css';

export default function AllergyEdit() {
  const [allergies, setAllergies] = useState([]);
  const [hasNoAllergies, setHasNoAllergies] = useState(false);
  const [selectedAllergyIds, setSelectedAllergyIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("pendingUserId")?.trim();

  useEffect(() => {
    if (!userId) {
      navigate("/Signin");
      return;
    }

    const fetchAllergyData = async () => {
      try {
        const { data: globalAllergies } = await supabase
          .from('allergies')
          .select('id, name_en');
        
        if (globalAllergies) setAllergies(globalAllergies);

        const { data: userSavedAllergies } = await supabase
          .from('user_allergies')
          .select('allergy_id')
          .eq('user_id', userId);

        if (userSavedAllergies && userSavedAllergies.length > 0) {
          const savedIds = userSavedAllergies.map(item => item.allergy_id);
          setSelectedAllergyIds(savedIds);
          setHasNoAllergies(false);
        } else {
          setHasNoAllergies(true);
        }
      } catch (err) {
        console.error("Error loading profile allergy datasets:", err.message);
      }
    };

    fetchAllergyData();
  }, [userId, navigate]);

  const handleAllergyToggle = (id) => {
    setHasNoAllergies(false);
    if (selectedAllergyIds.includes(id)) {
      setSelectedAllergyIds(selectedAllergyIds.filter(item => item !== id));
    } else {
      setSelectedAllergyIds([...selectedAllergyIds, id]);
    }
  };

  const handleNoneToggle = () => {
    setHasNoAllergies(!hasNoAllergies);
    setSelectedAllergyIds([]);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await supabase
        .from('user_allergies')
        .delete()
        .eq('user_id', userId);

      if (selectedAllergyIds.length > 0) {
        const rowsToInsert = selectedAllergyIds.map(id => ({
          user_id: userId,
          allergy_id: id
        }));

        const { error } = await supabase
          .from('user_allergies')
          .insert(rowsToInsert);

        if (error) throw error;
      }

      navigate("/profile-edit");
    } catch (err) {
      console.error("Failed to commit profile updates:", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="allergy-wrapper">
      <div className="allergy-screen">
        <div className="allergy-header">
          <BackButton to="/profile-edit" />
        </div>

        <div className="allergy-title-section">
          <h2 className="allergy-main-title">Edit Allergies</h2>
          <p className="allergy-subtitle">Modify your current dietary safety limitations</p>
        </div>

        <div className="allergy-options-container">
          <div 
            className={`none-option-card ${hasNoAllergies ? 'active' : ''}`}
            onClick={handleNoneToggle}
          >
            <div className="radio-outer">
              {hasNoAllergies && <div className="radio-inner" />}
            </div>
            <span className="option-text">None / No Allergies</span>
          </div>

          <div className="allergies-multi-grid">
            {allergies.map((allergy) => {
              const isSelected = selectedAllergyIds.includes(allergy.id);
              return (
                <button
                  key={allergy.id}
                  type="button"
                  className={`allergy-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAllergyToggle(allergy.id)}
                >
                  {allergy.name_en}
                </button>
              );
            })}
          </div>
        </div>

        <div className="allergy-footer">
          <button 
            type="button"
            onClick={handleSaveChanges}
            className={`continue-submit-link ${saving ? 'disabled' : ''}`}
            disabled={saving}
          >
            {saving ? "Saving changes..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}