import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, SquarePen } from "lucide-react";
import { supabase } from "../supabase";
import RecipeCard from "../components/RecipeCard";
import CuisineCard from "../components/CuisineCard";
import Navbar from "../components/NavBar";
import "./Profile.css";

export default function Profile() {
  const [favorites, setFavorites] = useState([]);
  const [activeCuisines, setActiveCuisines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let userId = localStorage.getItem("pendingUserId");

        if (!userId) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          userId = user?.id;
        }

        if (!userId) {
          console.error("No User ID found. Please sign in.");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("favorite_cuisines, favorite_recipes")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        if (userData?.favorite_recipes?.length > 0) {
          const { data: favRecipes, error: favError } = await supabase
            .from("recipes")
            .select("id, title_en, recipe_img")
            .in("id", userData.favorite_recipes)
            .limit(4);

          if (favError) throw favError;
          setFavorites(favRecipes || []);
        } else {
          setFavorites([]);
        }

        if (userData?.favorite_cuisines?.length > 0) {
          const { data: cuisineDetails, error: cError } = await supabase
            .from("cuisines")
            .select("id, country_en, flag_url")
            .in("id", userData.favorite_cuisines);

          if (cError) throw cError;
          setActiveCuisines(cuisineDetails || []);
        } else {
          setActiveCuisines([]);
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="profile-page loading-state">
        <div className="loader"></div>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/profile-edit" className="edit-profile-link">
          <SquarePen size={24} color="#f0660c" />
          <p>Edit Profile</p>
        </Link>
      </header>

      <main className="profile-content">
        <section className="profile-section">
          <div className="section-title-row">
            <h2 className="section-title">Active Cuisines</h2>
            <Link to="/cuisines-edit" className="edit-cuisines-btn">
              <SquarePen size={20} color="#f0660c" />
            </Link>
          </div>

          <div
            className="cuisines-horizontal-list"
            style={{ display: "flex", gap: "10px", overflowX: "auto" }}
          >
            {activeCuisines.length > 0 ? (
              activeCuisines.map((item) => (
                <CuisineCard
                  key={item.id}
                  flagUrl={item.flag_url}
                  isSelected={true}
                  onClick={() => {}}
                />
              ))
            ) : (
              <p className="empty-text">No cuisines selected.</p>
            )}
          </div>
        </section>

        <section className="profile-section">
          <div className="section-title-row">
            <h2 className="section-title">Favorites</h2>
            <Link to="/favorites-all" className="see-more-btn">
              <ChevronRight size={24} color="#f0660c" />
            </Link>
          </div>
          <div className="favorites-bento-grid">
            {favorites.length > 0 ? (
              favorites.map((recipe, index) => (
                <Link
                  to={`/recipe-details/${recipe.id}`}
                  key={recipe.id}
                  className={`bento-item item-${index}`}
                >
                  <RecipeCard
                    name={recipe.title_en}
                    imageUrl={recipe.recipe_img}
                    height="100%"
                  />
                </Link>
              ))
            ) : (
              <p className="empty-text">No favorites yet.</p>
            )}
          </div>
        </section>
      </main>
      <Navbar />
    </div>
  );
}
