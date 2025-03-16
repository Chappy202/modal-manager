import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalDebugger, useModal } from '../src';
import useModalStore from '../src/core/store';
import { Modal } from './components/Modal';
import { BasicExample } from './components/BasicExample';
import { CustomUIExample } from './components/CustomUIExample';
import { PaymentExample } from './components/PaymentExample';

// Simple React modal without using our library
function SimpleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find or create modal root element
    let element = document.getElementById('simple-modal-root');
    if (!element) {
      element = document.createElement('div');
      element.id = 'simple-modal-root';
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

  if (!isOpen || !modalRoot) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Simple React Modal</h2>
        <p>This is a simple modal using React's useState.</p>
        <button
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            marginTop: '20px',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
}

export function App() {
  const [showDebugger, setShowDebugger] = useState(true);
  const modals = useModalStore(state => state.modals);

  // Simple test modal using our library
  const { isOpen: isLibraryModalOpen, open: openLibraryModal, close: closeLibraryModal } = useModal({
    id: 'test-modal',
    steps: [{ id: 'test-step' }]
  });

  // Simple test modal using React's useState
  const [isReactModalOpen, setIsReactModalOpen] = useState(false);

  // Force re-render when modal state changes
  const [, forceUpdate] = useState({});

  // Listen for changes in the modal store
  useEffect(() => {
    // Subscribe to changes in the modal store
    const unsubscribe = useModalStore.subscribe((state) => {
      // Check if our modal exists and force update if it does
      if (state.modals['test-modal']) {
        forceUpdate({});
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Modal Testing</h1>
        <p>Testing different modal implementations</p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button
            className="button"
            onClick={() => setShowDebugger(!showDebugger)}
          >
            {showDebugger ? 'Hide' : 'Show'} Debugger
          </button>

          <button
            className="button"
            onClick={() => {
              openLibraryModal();
              // Force immediate update
              forceUpdate({});
            }}
          >
            Library Modal
          </button>

          <button
            className="button"
            onClick={() => setIsReactModalOpen(true)}
          >
            React Modal
          </button>
        </div>

        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <p>Library Modal State: {isLibraryModalOpen ? 'Open' : 'Closed'}</p>
          <p>React Modal State: {isReactModalOpen ? 'Open' : 'Closed'}</p>
          <p>Store Modal Count: {Object.keys(modals).length}</p>
        </div>
      </header>

      {/* Library Modal */}
      <Modal isOpen={isLibraryModalOpen} onClose={() => closeLibraryModal()} title="Library Modal">
        <div>
          <p>This is a modal using our library.</p>
          <div className="button-group">
            <button className="button" onClick={() => closeLibraryModal()}>Close</button>
          </div>
        </div>
      </Modal>

      {/* React Modal */}
      <SimpleModal isOpen={isReactModalOpen} onClose={() => setIsReactModalOpen(false)} />

      {/* Example Components */}
      <div className="examples-container">
        <h2 className="examples-title">Example Components</h2>
        <div className="examples-grid">
          <BasicExample />
          <CustomUIExample />
          <PaymentExample />
        </div>
      </div>

      {/* Add the debugger */}
      {showDebugger && <ModalDebugger position="bottom-right" initiallyOpen={true} />}
    </div>
  );
}
