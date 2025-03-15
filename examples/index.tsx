import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { App } from './App';

// Render the app
const container = document.getElementById('root') || document.createElement('div');
if (!container.id) {
  container.id = 'root';
  document.body.appendChild(container);
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
