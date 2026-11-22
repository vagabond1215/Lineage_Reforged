import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CleanEpochAccountStore } from './game-shell/cleanEpochAccountStore.js';
import './index.css';
import './styles/main-menu-refinement.css';

if (import.meta.env.PROD && import.meta.env.MODE === 'world-source-review' &&
    (location.hostname === '127.0.0.1' || location.hostname === 'localhost')) {
  Object.defineProperty(window, 'prepareChronicleWorldSourceForReview', {
    value: CleanEpochAccountStore.prepareChronicleWorldSource,
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
