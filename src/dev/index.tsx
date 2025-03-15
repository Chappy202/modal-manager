import React from 'react';
import { createRoot } from 'react-dom/client';
import { SimpleMultiStepModal } from '../examples/SimpleModal';
import { AdvancedModal } from '../examples/AdvancedModal';
import { ModalDebugger } from '../components/ModalDebugger';

// Import Tailwind CSS (only for development)
import '../styles/global.css';

// Example card component
interface ExampleCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ExampleCard = ({ title, description, children }: ExampleCardProps) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
};

/**
 * Development application for testing the modal manager
 */
const App = () => {
  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Modal Manager Examples</h1>
        <p className="text-gray-500">
          A collection of examples demonstrating the capabilities of the modal manager library.
          Each example showcases different features and use cases.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExampleCard
          title="Simple Multi-Step Modal"
          description="A basic multi-step form with navigation between steps and data collection."
        >
          <SimpleMultiStepModal />
        </ExampleCard>

        <ExampleCard
          title="Advanced Modal"
          description="A more complex example with dynamic content, conditional steps, and custom animations."
        >
          <AdvancedModal />
        </ExampleCard>
      </div>

      {/* Add the debugger */}
      <ModalDebugger position="bottom-right" initiallyOpen={false} />
    </div>
  );
};

// Render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
