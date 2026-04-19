import React, { useState } from "react";
import {
  ChevronRight,
  Camera,
  Bell,
  Cpu,
  ShieldCheck,
  Info,
  Globe,
  X,
} from "lucide-react";
import Navbar from "../components/NavBar";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(null);

  const settingsOptions = [
    { id: "ar", label: "AR & Camera Settings", icon: <Camera size={22} /> },
    {
      id: "notifs",
      label: "Notifications Preferences",
      icon: <Bell size={22} />,
    },
    {
      id: "kitchen",
      label: "Kitchen & Devices Integration",
      icon: <Cpu size={22} />,
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: <ShieldCheck size={22} />,
    },
    { id: "support", label: "Support & About", icon: <Info size={22} /> },
    { id: "lang", label: "Language Settings", icon: <Globe size={22} /> },
  ];

  const renderSheetContent = () => {
    if (activeTab === "lang") {
      return (
        <div className="language-selector">
          <div className="lang-option selected">English (Default)</div>
          <div className="lang-option">Arabic (العربية)</div>
        </div>
      );
    }
    return (
      <div className="placeholder-options">
        <div className="option-item">Configure {activeTab} option 1</div>
        <div className="option-item">Configure {activeTab} option 2</div>
        <div className="option-item">Reset to default</div>
      </div>
    );
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <div style={{ width: 40 }}></div>
      </header>

      <div className="settings-list">
        {settingsOptions.map((item) => (
          <div
            key={item.id}
            className="settings-row"
            onClick={() => setActiveTab(item.id)}
          >
            <div className="settings-row-left">
              <span className="settings-icon">{item.icon}</span>
              <span className="settings-label">{item.label}</span>
            </div>
            <ChevronRight size={20} color="#f0660c" />
          </div>
        ))}
      </div>

      {activeTab && (
        <div
          className="bottom-sheet-overlay"
          onClick={() => setActiveTab(null)}
        >
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="sheet-handle"></div>
              <button
                className="close-sheet"
                onClick={() => setActiveTab(null)}
              >
                <X size={20} color="white" />
              </button>
            </div>
            <div className="sheet-body">
              <h2>{settingsOptions.find((o) => o.id === activeTab)?.label}</h2>
              {renderSheetContent()}
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Settings;
