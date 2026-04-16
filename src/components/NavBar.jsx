import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, ShoppingCart, Search } from 'lucide-react';
import './Navbar.css';

const navItems = [
  { path: '/home', icon: Home, index: 0 },
  { path: '/profile', icon: User, index: 1 },
  { path: '/cart', icon: ShoppingCart, index: 2 },
  { path: '/search', icon: Search, index: 3 }
];

export default function Navbar() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(() => {
    const current = navItems.find(item => location.pathname.includes(item.path));
    return current ? current.index : 0;
  });

  const handleTabClick = (index) => {
    setActiveIndex(index);
    document.documentElement.style.setProperty('--active-index', index);
  };

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
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                <div className="icon-wrapper">
                  <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="nav-indicator">
          <div className="orange-bubble"></div>
        </div>
      </div>
    </div>
  );
}