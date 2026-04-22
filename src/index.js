import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routing from './Routing';

const startApp = () => {
  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <Routing />
    </React.StrictMode>
  );
};

if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}