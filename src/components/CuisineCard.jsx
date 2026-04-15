import React from 'react';
import './CuisineCard.css';

export default function CuisineCard({ flagUrl, isSelected, onClick }) {
  return (
    <div 
      className={`cuisine-card-holder ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <img src={flagUrl} alt="cuisine flag" className="cuisine-flag-img" />
    </div>
  );
}