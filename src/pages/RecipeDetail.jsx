import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Timer } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import Preloader from '../components/PreLoader';
import './RecipeDetail.css';

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
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
          .eq('cuisines_id', mainRecipe.cuisines_id)
          .neq('id', recipeId)
          .limit(4);
        setSimilarRecipes(similarData || []);

        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('recipe_id', recipeId)
          .single();
        if (favData) setIsFavorited(true);

      } catch (err) {
        console.error(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchRecipeData();
  }, [recipeId]);

  const toggleFavorite = async () => {
    const previousState = isFavorited;
    setIsFavorited(!previousState);

    if (!previousState) {
      await supabase.from('favorites').insert([{ recipe_id: recipeId }]);
    } else {
      await supabase.from('favorites').delete().eq('recipe_id', recipeId);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="recipe-detail-page">
      <div className="recipe-hero">
        <img src={recipe.recipe_img} alt={recipe.title_en} className="hero-img" />
        
        <div className="detail-header-actions">
          <BackButton to="/feed" />
          <button 
            className={`detail-fav-btn ${isFavorited ? 'active' : ''}`} 
            onClick={toggleFavorite}
          >
            <Heart 
              size={26} 
              color={isFavorited ? '#f0660c' : '#fff'} 
              fill={isFavorited ? '#f0660c' : 'none'} 
              strokeWidth={2.5}
            />
          </button>
        </div>

        <div className="hero-title-overlay">
          <h1 className="hero-title">{recipe.title_en}</h1>
        </div>
      </div>

      <div className="recipe-content-body">
        <section className="detail-section">
          <h2 className="section-header">Ingredients</h2>
          <div className="ingred-list">
            {ingredients.map((item, i) => (
              <div key={i} className="ingred-row">
                <span className="ingred-name">{item.item_name_en}</span>
                <span className="ingred-amount">
                  {item.quantity} <span className="unit-text">{item.unit}</span>
                </span>
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
    </div>
  );
}