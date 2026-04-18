import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import BackButton from "../components/BackButton";
import CuisineCard from "../components/CuisineCard";
import Preloader from "../components/PreLoader";
import "./CuisineSelect.css";

export default function CuisineEdit() {
  const [dbCuisines, setDbCuisines] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("pendingUserId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const { data: allCuisines } = await supabase
          .from("cuisines")
          .select("id, country_en, flag_url");
        setDbCuisines(allCuisines || []);

        const { data: userData } = await supabase
          .from("users")
          .select("favorite_cuisines")
          .eq("id", userId)
          .single();

        if (userData?.favorite_cuisines) {
          setSelectedCuisines(userData.favorite_cuisines);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const toggleCuisine = (id) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUpdateCuisines = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ favorite_cuisines: selectedCuisines })
        .eq("id", userId);

      if (error) throw error;
      navigate("/profile");
    } catch (err) {
      console.error(err.message);
      alert("Error updating preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Preloader />;

  return (
    <div className="cuisine-wrapper">
      <div className="cuisine-screen">
        <div className="cuisine-header">
          <BackButton to="/profile" />
          <div className="cuisine-title-group">
            <h2 className="cuisine-main-title">Edit Preferences</h2>
            <p className="cuisine-subtitle">Update your favorite cuisines</p>
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
            disabled={selectedCuisines.length < 1 || isSaving}
            onClick={handleUpdateCuisines}
          >
            {isSaving ? "Saving Changes..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}