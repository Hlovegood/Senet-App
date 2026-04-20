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
  Check,
} from "lucide-react";
import Navbar from "../components/NavBar";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [language, setLanguage] = useState("en");

  const [toggles, setToggles] = useState({
    arOverlay: true,
    objectDetection: true,
    pushNotifs: true,
    emailUpdates: false,
    smartFridge: false,
    twoFactor: true,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsOptions = [
    { id: "ar", label: "AR & Camera Settings", icon: <Camera size={22} /> },
    { id: "notifs", label: "Notifications", icon: <Bell size={22} /> },
    { id: "kitchen", label: "Kitchen Integration", icon: <Cpu size={22} /> },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: <ShieldCheck size={22} />,
    },
    { id: "lang", label: "Language Settings", icon: <Globe size={22} /> },
    { id: "support", label: "Support & About", icon: <Info size={22} /> },
  ];

  const Switch = ({ isOn, handleToggle, id }) => (
    <div
      className={`switch-container ${isOn ? "on" : "off"}`}
      onClick={() => handleToggle(id)}
    >
      <div className="switch-handle" />
    </div>
  );

  const renderSheetContent = () => {
    switch (activeTab) {
      case "ar":
        return (
          <div className="options-container">
            <div className="option-row">
              <div className="option-info">
                <h3>AR Step Overlay</h3>
                <p>Show instructions on top of ingredients</p>
              </div>
              <Switch
                id="arOverlay"
                isOn={toggles.arOverlay}
                handleToggle={handleToggle}
              />
            </div>
            <div className="option-row">
              <div className="option-info">
                <h3>Object Detection</h3>
                <p>Auto-recognize vegetables and tools</p>
              </div>
              <Switch
                id="objectDetection"
                isOn={toggles.objectDetection}
                handleToggle={handleToggle}
              />
            </div>
          </div>
        );
      case "notifs":
        return (
          <div className="options-container">
            <div className="option-row">
              <div className="option-info">
                <h3>Push Notifications</h3>
                <p>Recipe alerts and cooking timers</p>
              </div>
              <Switch
                id="pushNotifs"
                isOn={toggles.pushNotifs}
                handleToggle={handleToggle}
              />
            </div>
            <div className="option-row">
              <div className="option-info">
                <h3>Email Updates</h3>
                <p>Weekly personalized meal plans</p>
              </div>
              <Switch
                id="emailUpdates"
                isOn={toggles.emailUpdates}
                handleToggle={handleToggle}
              />
            </div>
          </div>
        );
      case "lang":
        return (
          <div className="language-selector">
            <div
              className={`lang-option ${language === "en" ? "selected" : ""}`}
              onClick={() => {
                setLanguage("en");
                document.body.dir = "ltr";
              }}
            >
              <span>English</span>
              {language === "en" && <Check size={18} />}
            </div>
            <div
              className={`lang-option ${language === "ar" ? "selected" : ""}`}
              onClick={() => {
                setLanguage("ar");
                document.body.dir = "rtl";
              }}
            >
              <span>العربية (Arabic)</span>
              {language === "ar" && <Check size={18} />}
            </div>
          </div>
        );
      default:
        return <div className="placeholder">Feature coming soon...</div>;
    }
  };

  return (
    <div className={`settings-page ${language === "ar" ? "rtl" : ""}`}>
      <header className="settings-header">
        <h1>{language === "en" ? "Settings" : "الإعدادات"}</h1>
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
            <ChevronRight className="chevron" size={20} />
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
