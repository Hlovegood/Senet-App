import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Settings, Search } from "lucide-react";
import "./NavBar.css";

const navItems = [
  { path: "/feed", icon: Home, index: 0 },
  { path: "/profile", icon: User, index: 1 },
  { path: "/settings", icon: Settings, index: 2 },
  { path: "/search", icon: Search, index: 3 },
];

export default function Navbar() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const current = navItems.find((item) =>
      location.pathname.includes(item.path),
    );
    const index = current ? current.index : 0;
    setActiveIndex(index);
    document.documentElement.style.setProperty("--active-index", index);
  }, [location]);

  const ActiveIcon = navItems[activeIndex].icon;

  return (
    <div className="nav-container">
      <div className="nav-bar-wrapper">
        <div className="nav-icons-row">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;

            return (
              <Link
                key={index}
                to={item.path}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <div className="icon-wrapper">
                  <Icon size={24} strokeWidth={2} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="nav-indicator">
          <div className="orange-bubble">
            <ActiveIcon size={24} color="#fff" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
