import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Heart } from "lucide-react";
import BackButton from "../components/BackButton";
import RecipeCard from "../components/RecipeCard";
import Preloader from "../components/PreLoader";
import "./FavoritesAll.css";

const FavoritesAll = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteRecipes();
  }, []);

  const fetchFavoriteRecipes = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("pendingUserId");

      if (!userId) {
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("favorite_cuisines, favorite_recipes")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const favoriteIds = userData?.favorite_recipes || [];

      if (Array.isArray(favoriteIds) && favoriteIds.length > 0) {
        const { data: recipeData, error: recipeError } = await supabase
          .from("recipes")
          .select("*")
          .in("id", favoriteIds);

        if (recipeError) throw recipeError;
        setRecipes(recipeData || []);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="fav-bento-container">
      <header className="fav-bento-header">
        <BackButton to="/profile" />
        <h1>My Favorites</h1>
        <div style={{ width: 40 }}></div>
      </header>

      <div className="fav-bento-content">
        {recipes.length > 0 ? (
          <div className="fav-bento-grid">
            {recipes.map((recipe, index) => (
              <Link
                to={`/recipe-details/${recipe.id}`}
                key={recipe.id}
                className={`fav-bento-card item-${index % 4}`}
              >
                <RecipeCard
                  name={recipe.title_en}
                  imageUrl={recipe.recipe_img}
                  height="100%"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="fav-bento-empty">
            <Heart size={64} color="#333" />
            <p>You haven't saved any recipes yet.</p>
            <Link to="/feed" className="fav-bento-explore-btn">
              Explore Recipes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesAll;
