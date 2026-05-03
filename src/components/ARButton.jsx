import React from 'react';
import { Browser } from '@capacitor/browser';
import { View } from 'lucide-react';
import './ARButton.css';

const ARButton = ({ arUrl }) => {
  const handleARClick = async () => {
    if (!arUrl) {
      console.warn("ARButton: No URL provided");
      return;
    }

    try {
      await Browser.open({ url: arUrl });
    } catch (error) {
      console.error("Could not open AR link:", error);
    }
  };

  return (
    <div className="ar-fab-container">
      <button className="ar-fab-button" onClick={handleARClick}>
        <View className="ar-lucide-icon" size={28} strokeWidth={2} />
      </button>
    </div>
  );
};

export default ARButton;