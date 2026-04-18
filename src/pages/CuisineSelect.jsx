import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import BackButton from "../components/BackButton";
import CuisineCard from "../components/CuisineCard";
import "./CuisineSelect.css";

export default function CuisineSelection() {
  const [dbCuisines, setDbCuisines] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("pendingUserId");

  useEffect(() => {
    if (!userId) {
      alert("Signup session not found. Please start from the beginning.");
      navigate("/signup");
      return;
    }

    const fetchCuisines = async () => {
      const { data, error } = await supabase
        .from("cuisines")
        .select("id, country_en, flag_url");

      if (error) {
        console.error(error.message);
      } else {
        setDbCuisines(data);
      }
    };

    fetchCuisines();
  }, [userId, navigate]);

  const toggleCuisine = (id) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveCuisines = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ favorite_cuisines: selectedCuisines })
        .eq("id", userId);

      if (error) throw error;

      alert("Cuisines confirmed!");
      navigate("/allergy");
    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="cuisine-wrapper">
      <div className="cuisine-screen">
        <div className="cuisine-header">
          <BackButton to="/target" />
          <div className="cuisine-title-group">
            <h2 className="cuisine-main-title">Cuisine Picker</h2>
            <p className="cuisine-subtitle">Choose at least 5 cuisines</p>
          </div>
          <div style={{ width: 40 }}></div>
        </div>

        <div className="cuisine-grid">
          {dbCuisines.map((cuisine) => (
            <CuisineCard
              key={cuisine.id}
              flagUrl={cuisine.flag_url}
              isSelected={selectedCuisines.includes(cuisine.id)}
              onClick={() => toggleCuisine(cuisine.id)}
            />
          ))}
        </div>

        <div className="cuisine-footer">
          <button
            className="save-cuisines-primary-btn"
            disabled={selectedCuisines.length < 5 || isSaving}
            onClick={handleSaveCuisines}
          >
            {isSaving ? "Saving..." : "Confirm Selections"}
          </button>

          <div className="cuisine-options-row">
            <button
              className="set-allergy-btn-small"
              onClick={() => navigate("/allergy")}
            >
              Set Allergies
            </button>

            <button
              className="no-restrictions-btn-small"
              onClick={() => navigate("/finish")}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}