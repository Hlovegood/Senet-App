import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import RecipeCard from '../components/RecipeCard';
import Navbar from '../components/NavBar';
import './Home.css';

export default function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('id, title_en');

        const { data: imageData, error: imageError } = await supabase
          .from('Recipes_images')
          .select('id, image_url');

        if (recipeError) throw recipeError;

        const combined = recipeData.map((recipe, index) => {
          const imgObj = imageData ? imageData[index] : null;
          const heights = ['240px', '320px', '280px'];
          const randomHeight = heights[index % heights.length];
          
          return {
            ...recipe,
            image_url: imgObj ? imgObj.image_url : 'https://via.placeholder.com/300x400',
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
  }, []);

  return (
    <div className="feed-page">
      <div className="feed-scroll-area">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="bento-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                name={recipe.title_en}
                imageUrl={recipe.image_url}
                cookTime={recipe.cookTime}
                height={recipe.displayHeight}
              />
            ))}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}