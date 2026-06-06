import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePen, X, LogOut } from "lucide-react";
import { supabase } from "../supabase";
import BackButton from "../components/BackButton";
import Preloader from "../components/PreLoader";
import "./ProfileEdit.css";

export default function ProfileEdit() {
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [useAllergyFilters, setUseAllergyFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("pendingUserId")?.trim();

  useEffect(() => {
    if (!userId) {
      navigate("/Signin");
      return;
    }

    const fetchUserData = async () => {
      try {
        const { data, error, status } = await supabase
          .from("users")
          .select("full_name, email, password")
          .eq("id", userId)
          .maybeSingle();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUserData({
            full_name: data.full_name || "",
            email: data.email || "",
            password: data.password || "",
          });
        }
        
        const localFilterState = localStorage.getItem(`useAllergyFilters_${userId}`) !== "false";
        setUseAllergyFilters(localFilterState);
      } catch (err) {
        console.error("Fetch Error:", err.message);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const openEditModal = (field, currentVal) => {
    setEditingField(field);
    setNewValue(currentVal);
    setModalOpen(true);
  };

  const handleUpdateField = async () => {
    if (!newValue) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ [editingField]: newValue })
        .eq("id", userId);

      if (error) throw error;

      setUserData((prev) => ({ ...prev, [editingField]: newValue }));
      setModalOpen(false);
    } catch (err) {
      alert("Error updating " + editingField);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAllergyFilters = () => {
    const newState = !useAllergyFilters;
    setUseAllergyFilters(newState);
    localStorage.setItem(`useAllergyFilters_${userId}`, newState ? "true" : "false");
  };

  const handleLogout = () => {
    localStorage.removeItem("pendingUserId");
    navigate("/signinflow");
  };

  if (isLoading) return <Preloader />;

  return (
    <div className="profile-edit-wrapper">
      <div className="profile-edit-screen">
        <header className="profile-edit-header">
          <BackButton to="/profile" />
          <h1 className="header-title">Settings</h1>
          <div style={{ width: 40 }}></div>
        </header>

        <section className="info-display-section">
          <div
            className="info-row clickable-row"
            onClick={() => openEditModal("full_name", userData.full_name)}
          >
            <span className="info-label">Full Name</span>
            <span className="info-value">
              {userData.full_name || "Not Set"}
            </span>
            <SquarePen className="info-icon active-icon" size={18} />
          </div>

          <div
            className="info-row clickable-row"
            onClick={() => openEditModal("email", userData.email)}
          >
            <span className="info-label">Email</span>
            <span className="info-value">{userData.email || "Not Set"}</span>
            <SquarePen className="info-icon active-icon" size={18} />
          </div>

          <div
            className="info-row clickable-row"
            onClick={() => openEditModal("password", userData.password)}
          >
            <span className="info-label">Password</span>
            <span className="info-value">**********</span>
            <SquarePen className="info-icon active-icon" size={18} />
          </div>
        </section>

        <section className="custom-edit-section">
          <h2 className="edit-subheader">Customization</h2>
          <div className="edit-row">
            <div className="edit-label-group">
              <span className="main-label">Use Allergy Filters</span>
              <p className="sub-label">Automatically exclude recipes</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={useAllergyFilters}
                onChange={toggleAllergyFilters}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div
            className="edit-row clickable"
            onClick={() => navigate("/allergy-edit")}
          >
            <div className="edit-label-group">
              <span className="main-label">Allergy Filters</span>
              <p className="sub-label">Edit your specific allergies</p>
            </div>
            <SquarePen className="edit-arrow" size={20} color="#f0660c" />
          </div>
        </section>

        <div className="danger-zone">
          <button className="logout-account-btn" onClick={handleLogout}>
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit {editingField?.replace("_", " ")}</h3>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              type={editingField === "password" ? "password" : "text"}
              className="modal-input"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              autoFocus
            />
            <button
              className="modal-save-btn"
              onClick={handleUpdateField}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}