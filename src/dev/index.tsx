import React from 'react';
import { createRoot } from 'react-dom/client';
import { SimpleMultiStepModal } from '../examples/SimpleModal';

// Create a simple app for development testing
const App = () => {
  return (
    <div>
      <h1>Modal Manager Development</h1>
      <SimpleMultiStepModal />
    </div>
  );
};

// Render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} 