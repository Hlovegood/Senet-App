import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, History, Clock, Flame, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';
import RecipeCard from '../components/RecipeCard';
import Navbar from '../components/NavBar';
import './Search.css';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [discoveryRecipes, setDiscoveryRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscoveryData();
  }, []);

  const fetchDiscoveryData = async () => {
    try {
      const userId = localStorage.getItem("pendingUserId");
      const { data: userData } = await supabase
        .from('users')
        .select('favorite_cuisines')
        .eq('id', userId)
        .single();

      if (userData?.favorite_cuisines?.length > 0) {
        const { data: recipes } = await supabase
          .from('recipes')
          .select('*')
          .in('cuisine_id', userData.favorite_cuisines)
          .limit(6);
        setDiscoveryRecipes(recipes || []);
      } else {
        const { data: generalRecipes } = await supabase.from('recipes').select('*').limit(6);
        setDiscoveryRecipes(generalRecipes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .ilike('title_en', `%${query}%`);
      if (!error) setSearchResults(data);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleHistoryItemClick = (recipe) => {
    setSearchResults([recipe]);
    setSearchQuery(recipe.title_en);
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
          <b key={i} className="highlight-text">{part}</b> : part
        )}
      </span>
    );
  };


  return (
    <div className={`search-page-container ${activeRecipe ? 'modal-open' : ''}`}>
      <header className="search-header">
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <SearchIcon className="search-icon-inner" size={20} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && <X className="clear-icon" size={20} onClick={() => handleSearch('')} />}
          </div>
        </div>
        <div style={{ width: 40 }}></div>
      </header>

      <main className="search-content">
        {!isSearching ? (
          <div className="discovery-view animate-fade-in">
            <div className="discovery-grid">
              {discoveryRecipes.map((recipe) => (
                <div key={recipe.id} className="discovery-item" onClick={() => setActiveRecipe(recipe)}>
                  <RecipeCard name={recipe.title_en} imageUrl={recipe.recipe_img} height="200px" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="results-view animate-fade-in">
            {searchResults.length > 1 && (
              <div className="search-history-suggestions">
                {searchResults.slice(0, 5).map(result => (
                  <div 
                    key={result.id} 
                    className="history-item" 
                    onClick={() => handleHistoryItemClick(result)}
                  >
                    <History size={18} color="rgba(255,255,255,0.4)" />
                    <span>{getHighlightedText(result.title_en, searchQuery)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={searchResults.length === 1 ? "single-result-view" : "results-bento-grid"}>
              {searchResults.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className={searchResults.length === 1 ? "focused-item" : `bento-item item-${index % 5}`} 
                  onClick={() => setActiveRecipe(recipe)}
                >
                  <RecipeCard name={recipe.title_en} imageUrl={recipe.recipe_img} height="100%" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className={`bottom-sheet-overlay ${activeRecipe ? 'visible' : ''}`} onClick={() => setActiveRecipe(null)}>
        <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="swipe-handle" onClick={() => setActiveRecipe(null)}></div>
          {activeRecipe && (
            <div className="overview-content">
              <img src={activeRecipe.recipe_img} alt={activeRecipe.title_en} className="overview-img" />
              <div className="overview-details">
                <h2 className="overview-title">{activeRecipe.title_en}</h2>
                <div className="overview-meta">
                  <div className="meta-badge"><Clock size={16} /> 25 Min</div>
                  <div className="meta-badge"><Flame size={16} /> {activeRecipe.difficulty}</div>
                </div>
                <p className="overview-description">
                  Enjoy this delicious {activeRecipe.title_en}. Perfectly prepared to meet your taste and dietary preferences.
                </p>
                <button 
                  className="view-full-recipe-btn"
                  onClick={() => navigate(`/recipe-details/${activeRecipe.id}`)}
                >
                  View Full Recipe <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
}