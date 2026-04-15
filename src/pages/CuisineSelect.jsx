import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Link } from "react-router-dom";
import CuisineCard from "../components/CuisineCard";
import "./CuisineSelect.css";

const cuisines = [
  { id: "italy", code: "it" },
  { id: "greece", code: "gr" },
  { id: "spain", code: "es" },
  { id: "portugal", code: "pt" },
  { id: "japan", code: "jp" },
  { id: "turkey", code: "tr" },
  { id: "china", code: "cn" },
  { id: "indonesia", code: "id" },
  { id: "india", code: "in" },
  { id: "usa", code: "us" },
  { id: "vietnam", code: "vn" },
  { id: "brazil", code: "br" },
  { id: "croatia", code: "hr" },
  { id: "poland", code: "pl" },
  { id: "lebanon", code: "lb" },
  { id: "korea", code: "kr" },
  { id: "colombia", code: "co" },
  { id: "palestine", code: "ps" },
  { id: "egypt", code: "eg" },
  { id: "germany", code: "de" },
  { id: "russia", code: "ru" },
  { id: "morocco", code: "ma" },
  { id: "france", code: "fr" },
  { id: "mexico", code: "mx" },
];

export default function CuisineSelection() {
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const navigate = useNavigate();

  const toggleCuisine = (id) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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
          {cuisines.map((cuisine) => (
            <CuisineCard
              key={cuisine.id}
              flagUrl={`https://flagcdn.com/w160/${cuisine.code}.png`}
              isSelected={selectedCuisines.includes(cuisine.id)}
              onClick={() => toggleCuisine(cuisine.id)}
            />
          ))}
        </div>

        <div className="cuisine-footer">
          <Link to="/allergy">
            <button
              className="set-allergy-btn"
              disabled={selectedCuisines.length < 5}
            >
              Set Allergy Filters
            </button>
          </Link>

          <Link to="/">
            <button className="no-restrictions-btn">
              No restrictions, skip
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
