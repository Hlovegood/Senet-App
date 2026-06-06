import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import RecipeCard from '../components/RecipeCard';
import Navbar from '../components/NavBar';
import './Home.css';

export default function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("pendingUserId")?.trim();

  useEffect(() => {
    if (!userId) {
      navigate("/Signin");
      return;
    }

    const fetchFeedData = async () => {
      try {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('favorite_cuisines')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        
        let preferredCuisineIds = [];
        if (userProfile?.favorite_cuisines) {
          if (Array.isArray(userProfile.favorite_cuisines)) {
            preferredCuisineIds = userProfile.favorite_cuisines;
          } else {
            try {
              preferredCuisineIds = JSON.parse(userProfile.favorite_cuisines);
            } catch (e) {
              preferredCuisineIds = [];
            }
          }
        }

        let query = supabase.from('recipes').select('id, title_en, recipe_img, cuisine_id');
        
        if (preferredCuisineIds.length > 0) {
          query = query.in('cuisine_id', preferredCuisineIds);
        }

        const { data: recipeData, error: recipeError } = await query;

        if (recipeError) throw recipeError;

        let filteredRecipes = recipeData || [];

        const { data: allergyRows } = await supabase
          .from('user_allergies')
          .select('*')
          .eq('user_id', userId);

        const activeAllergyIds = allergyRows?.map(row => {
          const idStr = row.allergy_id || row.id || '';
          return idStr.toString().trim();
        }) || [];

        if (activeAllergyIds.length > 0 && filteredRecipes.length > 0) {
          const recipeIds = filteredRecipes.map(r => r.id);
          const { data: ingredientsData } = await supabase
            .from('ingredients')
            .select('recipe_id, allergy_triggers')
            .in('recipe_id', recipeIds);

          const dangerousRecipeIds = new Set();
          ingredientsData?.forEach(ing => {
            if (ing.allergy_triggers) {
              const triggerId = ing.allergy_triggers.toString().trim();
              if (activeAllergyIds.includes(triggerId)) {
                dangerousRecipeIds.add(ing.recipe_id);
              }
            }
          });

          filteredRecipes = filteredRecipes.filter(recipe => !dangerousRecipeIds.has(recipe.id));
        }

        const combined = filteredRecipes.map((recipe, index) => {
          const heights = ['240px', '320px', '280px'];
          const randomHeight = heights[index % heights.length];
          
          return {
            ...recipe,
            cookTime: `${15 + (index * 5 % 30)} min`,
            displayHeight: randomHeight
          };
        });

        setRecipes(combined);
      } catch (err) {
        console.error('Error loading feed:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [userId, navigate]);

  return (
    <div className="feed-page">
      <div className="feed-scroll-area">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="bento-grid">
            {recipes.length === 0 ? (
              <div className="empty-text">No recipes match your preferences.</div>
            ) : (
              recipes.map((recipe) => (
                <Link 
                  to={`/recipe-details/${recipe.id}`} 
                  key={recipe.id} 
                  className="recipe-card-wrapper"
                >
                  <RecipeCard
                    name={recipe.title_en}
                    imageUrl={recipe.recipe_img}
                    cookTime={recipe.cookTime}
                    height={recipe.displayHeight}
                  />
                </Link>
              ))
            )}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}