import React from 'react';
import { Timer } from 'lucide-react';
import './RecipeCard.css';

export default function RecipeCard({ name, imageUrl, cookTime, height = "250px" }) {
  return (
    <div className="recipe-card" style={{ height: height }}>
      <img src={imageUrl} alt={name} className="recipe-card-image" />
      
      <div className="recipe-card-overlay">
        <div className="recipe-info-row">
          <h3 className="recipe-title">{name}</h3>
          <div className="recipe-time-tag">
            <Timer size={14} color="#fff" />
            <span>{cookTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}