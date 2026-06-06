import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import Preloader from '../components/PreLoader';
import ARButton from '../components/ARButton';
import './RecipeDetail.css';

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const userId = localStorage.getItem("pendingUserId");

  const getEmoji = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('salmon')) return '🐟';
    if (lowerName.includes('spinach')) return '🌿';
    if (lowerName.includes('oil')) return '💧';
    if (lowerName.includes('salt')) return '🧂';
    if (lowerName.includes('pepper')) return '🌶️';
    if (lowerName.includes('lemon')) return '🍋';
    if (lowerName.includes('garlic')) return '🧄';
    if (lowerName.includes('onion')) return '🧅';
    if (lowerName.includes('butter')) return '🧈';
    if (lowerName.includes('egg')) return '🥚';
    if (lowerName.includes('milk')) return '🥛';
    if (lowerName.includes('flour')) return '🌾';
    if (lowerName.includes('sugar')) return '🍬';
    if (lowerName.includes('water')) return '🚰';
    if (lowerName.includes('cream')) return '🍦';
    if (lowerName.includes('cheese')) return '🧀';
    if (lowerName.includes('chicken')) return '🍗';
    if (lowerName.includes('beef')) return '🥩';
    if (lowerName.includes('tomato')) return '🍅';
    return '🥗'; 
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      if (window.scrollY > 240) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const fetchRecipeData = async () => {
      setLoading(true);
      try {
        const { data: mainRecipe, error: recipeError } = await supabase
          .from('recipes')
          .select('id, title_en, recipe_img, cuisine_id')
          .eq('id', recipeId)
          .single();

        if (recipeError) throw recipeError;
        setRecipe(mainRecipe);

        const { data: ingredientsData } = await supabase
          .from('ingredients')
          .select('item_name_en, quantity, unit_en')
          .eq('recipe_id', recipeId);
        setIngredients(ingredientsData || []);

        const { data: stepsData } = await supabase
          .from('recipe_steps')
          .select('step_number, instruction_en')
          .eq('recipe_id', recipeId)
          .order('step_number', { ascending: true });
        setSteps(stepsData || []);

        const { data: similarData } = await supabase
          .from('recipes')
          .select('id, title_en, recipe_img')
          .eq('cuisine_id', mainRecipe.cuisine_id)
          .neq('id', recipeId)
          .limit(4);
        setSimilarRecipes(similarData || []);

        if (userId) {
          const { data: userData } = await supabase
            .from('users')
            .select('favorite_recipes')
            .eq('id', userId)
            .single();
          
          if (userData?.favorite_recipes?.includes(recipeId)) {
            setIsFavorited(true);
          }
        }

      } catch (err) {
        console.error(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchRecipeData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [recipeId, userId]);

  const toggleFavorite = async () => {
    if (!userId) return;
    const previousState = isFavorited;
    setIsFavorited(!previousState);
    try {
      const { data: userData } = await supabase.from('users').select('favorite_recipes').eq('id', userId).single();
      let currentFavorites = userData?.favorite_recipes || [];
      let updatedFavorites;
      if (!previousState) {
        updatedFavorites = !currentFavorites.includes(recipeId) ? [...currentFavorites, recipeId] : currentFavorites;
      } else {
        updatedFavorites = currentFavorites.filter(id => id !== recipeId);
      }
      const { error } = await supabase.from('users').update({ favorite_recipes: updatedFavorites }).eq('id', userId);
      if (error) throw error;
    } catch (err) {
      console.error(err.message);
      setIsFavorited(previousState);
    }
  };

  if (loading) return <Preloader />;
  if (!recipe) return <div className="error-text">Recipe not found.</div>;

  return (
    <div className="recipe-detail-page">
      <div className="recipe-hero">
        <img src={recipe.recipe_img} alt={recipe.title_en} className="hero-img" />
        <div className="detail-header-actions">
          <BackButton to="/feed" />
        </div>
      </div>

      <div className="recipe-content-body">
        <header className={`recipe-main-header sticky-header-container ${scrolled ? 'scrolled' : ''}`}>
          <div className="title-row">
            {scrolled && (
              <div className="sticky-back-wrapper-active">
                <BackButton to="/feed" />
              </div>
            )}
            <h1 className="hero-title">{recipe.title_en}</h1>
            <button 
              className={`main-fav-btn ${isFavorited ? 'active' : ''}`} 
              onClick={toggleFavorite}
            >
              <Heart 
                size={28} 
                color={isFavorited ? '#f0660c' : '#fff'} 
                fill={isFavorited ? '#f0660c' : 'none'} 
                strokeWidth={2.5}
              />
            </button>
          </div>
        </header>

        <section className="detail-section">
          <h2 className="section-header">Ingredients</h2>
          <div className="ingredients-wrap-container">
            {ingredients.map((item, i) => (
              <div key={i} className="ingredient-pill">
                <span className="ingred-emoji">{getEmoji(item.item_name_en)}</span>
                <div className="ingred-info">
                  <span className="ingred-name-modern">{item.item_name_en}</span>
                  <span className="ingred-amount-modern">
                    {item.quantity} {item.unit_en}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h2 className="section-header">Instructions</h2>
          <div className="steps-container">
            {steps.map((step) => (
              <div key={step.step_number} className="step-card">
                <div className="step-num">{step.step_number}</div>
                <div className="step-content">
                  <p className="step-desc">{step.instruction_en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h2 className="section-header">Similar Recipes</h2>
          <div className="similar-scroll">
            {similarRecipes.map((s) => (
              <Link to={`/recipe-details/${s.id}`} key={s.id} className="sim-card">
                <img src={s.recipe_img} alt={s.title_en} />
                <div className="sim-overlay">
                  <span className="sim-name">{s.title_en}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ARButton arUrl={"https://mywebar.com/p/Project_0_4j7iv4gfmm"} />
    </div>
  );
}