import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./TargetSelect.css";

import senetIcon from "../assets/icons/Senet icon.png";

const targetOptions = [
  { id: "save-money", label: "Save money", icon: "💵" },
  { id: "eat-healthier", label: "Eat Healthier", icon: "💪" },
  { id: "develop-skills", label: "Develop cooking skills", icon: "🧑‍🍳" },
  { id: "other", label: "Other", icon: "" },
];

export default function TargetSelection() {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/cuisines");
  };

  return (
    <div className="target-wrapper">
      <div className="target-screen">
        <div className="target-header">
          <BackButton to="/ageselect" />
          <div className="target-brand">
            <img src={senetIcon} alt="Senet" className="target-logo" />
            <span className="target-brand-name">Senet</span>
          </div>
          <button className="skip-link-btn" onClick={handleNavigation}>
            Skip
          </button>
        </div>

        <h2 className="target-title">
          What do you want <br /> to achieve with <br /> Senet
        </h2>

        <div className="target-list">
          {targetOptions.map((option) => (
            <div
              key={option.id}
              className={`target-item ${selectedTarget === option.id ? "active" : ""}`}
              onClick={() => setSelectedTarget(option.id)}
            >
              <div className="radio-outer">
                {selectedTarget === option.id && (
                  <div className="radio-inner" />
                )}
              </div>
              <span className="target-text">
                {option.label} {option.icon}
              </span>
            </div>
          ))}
        </div>

        <div className="target-footer">
          <button
            type="button"
            className="continue-redirect-btn"
            disabled={!selectedTarget}
            onClick={handleNavigation}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
