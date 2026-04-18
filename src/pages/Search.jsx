import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, History } from "lucide-react";
import { supabase } from "../supabase";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/NavBar";
import Preloader from "../components/PreLoader";
import "./Search.css";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [discoveryRecipes, setDiscoveryRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscoveryData();
  }, []);

  const fetchDiscoveryData = async () => {
    try {
      const userId = localStorage.getItem("pendingUserId");

      const { data: userData } = await supabase
        .from("users")
        .select("favorite_cuisines")
        .eq("id", userId)
        .single();

      if (userData?.favorite_cuisines?.length > 0) {
        const { data: recipes } = await supabase
          .from("recipes")
          .select("*")
          .in("cuisine_id", userData.favorite_cuisines)
          .limit(6);
        setDiscoveryRecipes(recipes || []);
      } else {
        const { data: generalRecipes } = await supabase
          .from("recipes")
          .select("*")
          .limit(6);
        setDiscoveryRecipes(generalRecipes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .ilike("title_en", `%${query}%`);

      if (!error) setSearchResults(data);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <b key={i} className="highlight-text">
              {part}
            </b>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  if (loading) return <Preloader />;

  return (
    <div className="search-page-container">
      <div className="search-bar-wrapper">
        <div className="search-input-container">
          <SearchIcon className="search-icon-inner" size={20} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus={isSearching}
          />
          {searchQuery && (
            <X
              className="clear-icon"
              size={20}
              onClick={() => handleSearch("")}
            />
          )}
        </div>
      </div>

      <main className="search-content">
        {!isSearching ? (
          <div className="discovery-view animate-fade-in">
            <div className="discovery-grid">
              {discoveryRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="discovery-item"
                  onClick={() => navigate(`/recipe-details/${recipe.id}`)}
                >
                  <RecipeCard
                    name={recipe.title_en}
                    imageUrl={recipe.recipe_img}
                    height="200px"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="results-view animate-fade-in">
            <div className="search-history-suggestions">
              {searchResults.slice(0, 3).map((result) => (
                <div key={result.id} className="history-item">
                  <History size={18} color="rgba(255,255,255,0.4)" />
                  <span
                    onClick={() => navigate(`/recipe-details/${result.id}`)}
                  >
                    {getHighlightedText(result.title_en, searchQuery)}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="section-label">Results for you</h3>
            <div className="results-bento-grid">
              {searchResults.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`bento-item item-${index % 5}`}
                  onClick={() => navigate(`/recipe-details/${recipe.id}`)}
                >
                  <RecipeCard
                    name={recipe.title_en}
                    imageUrl={recipe.recipe_img}
                    height="100%"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
}
