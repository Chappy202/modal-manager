import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useModal, ModalContent, Step, StepRenderer } from '../../src';

// Custom styled modal components
const CustomModal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find or create modal root element
    let element = document.getElementById('custom-modal-root');
    if (!element) {
      element = document.createElement('div');
      element.id = 'custom-modal-root';
      document.body.appendChild(element);
    }
    setModalRoot(element);

    return () => {
      // Clean up only if we created the element
      if (element && element.parentNode && element.childNodes.length === 0) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  // Ensure the modal root is created immediately when isOpen changes
  useEffect(() => {
    if (isOpen && !modalRoot) {
      const element = document.getElementById('custom-modal-root') || document.createElement('div');
      element.id = 'custom-modal-root';
      document.body.appendChild(element);
      setModalRoot(element);
    }
  }, [isOpen, modalRoot]);

  if (!isOpen || !modalRoot) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1e1e2e',
          color: '#cdd6f4',
          borderRadius: '12px',
          padding: '0',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // We've already checked that modalRoot is not null above
  return createPortal(modalContent, modalRoot as Element);
};

const CustomHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div
    style={{
      padding: '16px 20px',
      borderBottom: '1px solid #313244',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#181825',
    }}
  >
    <h2 style={{ margin: 0, color: '#cba6f7', fontSize: '1.2rem' }}>{title}</h2>
    <button
      style={{
        background: 'none',
        border: 'none',
        color: '#6c7086',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0 5px',
      }}
      onClick={onClose}
    >
      ×
    </button>
  </div>
);

const CustomBody = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '20px' }}>
    {children}
  </div>
);

const CustomButton = ({
  onClick,
  children,
  variant = 'primary'
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary'
}) => (
  <button
    style={{
      backgroundColor: variant === 'primary' ? '#cba6f7' : 'transparent',
      color: variant === 'primary' ? '#1e1e2e' : '#cba6f7',
      border: variant === 'primary' ? 'none' : '1px solid #cba6f7',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    {children}
  </button>
);

export function CustomUIExample() {
  const { isOpen, open, close, currentStep, next, prev, isFirst, isLast } = useModal({
    id: 'custom-ui-example',
    steps: [
      { id: 'welcome' },
      { id: 'features' },
      { id: 'conclusion' },
    ]
  });

  const handleOpen = () => {
    open();
  };

  const handleClose = () => {
    close();
  };

  return (
    <div className="example-card">
      <div className="example-card-header">
        <h2>Custom UI Example</h2>
      </div>
      <div className="example-card-body">
        <p>Using the library with a completely custom UI.</p>
      </div>
      <div className="example-card-footer">
        <button className="button" onClick={handleOpen}>Open Custom Modal</button>
      </div>

      <CustomModal isOpen={isOpen} onClose={handleClose}>
        <CustomHeader
          title={
            currentStep === 'welcome' ? 'Welcome' :
            currentStep === 'features' ? 'Key Features' :
            'Get Started'
          }
          onClose={handleClose}
        />

        <CustomBody>
          <StepRenderer currentStep={currentStep}>
            <Step id="welcome">
              <h3 style={{ color: '#f5c2e7', marginBottom: '15px' }}>Welcome to Stepped Modal</h3>
              <p style={{ marginBottom: '20px' }}>
                This example demonstrates how you can use the Stepped Modal library with your own custom UI components.
              </p>
              <p style={{ marginBottom: '20px' }}>
                The library is UI-agnostic, meaning you can use it with any component library or custom components.
              </p>
            </Step>

            <Step id="features">
              <h3 style={{ color: '#f5c2e7', marginBottom: '15px' }}>Key Features</h3>
              <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Multi-step flows in a single modal</li>
                <li style={{ marginBottom: '8px' }}>Conditional navigation between steps</li>
                <li style={{ marginBottom: '8px' }}>Data persistence across steps</li>
                <li style={{ marginBottom: '8px' }}>Framework-agnostic design</li>
                <li style={{ marginBottom: '8px' }}>TypeScript support</li>
              </ul>
            </Step>

            <Step id="conclusion">
              <h3 style={{ color: '#f5c2e7', marginBottom: '15px' }}>Get Started</h3>
              <p style={{ marginBottom: '20px' }}>
                You're now ready to use Stepped Modal in your own projects!
              </p>
              <p style={{ marginBottom: '20px' }}>
                Check out the documentation for more examples and API details.
              </p>
            </Step>
          </StepRenderer>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            {!isFirst && (
              <CustomButton variant="secondary" onClick={() => prev()}>
                Back
              </CustomButton>
            )}

            {!isLast ? (
              <CustomButton onClick={() => next()}>
                Next
              </CustomButton>
            ) : (
              <CustomButton onClick={handleClose}>
                Finish
              </CustomButton>
            )}
          </div>
        </CustomBody>
      </CustomModal>
    </div>
  );
}
