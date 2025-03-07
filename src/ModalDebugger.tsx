import React, { useState, useEffect } from 'react';
import useModalStore from './modal-state-manager';

interface ModalDebuggerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  initiallyOpen?: boolean;
}

/**
 * A debugging component that displays the current state of modals
 * Only intended for development use
 */
export function ModalDebugger({
  position = 'bottom-right',
  initiallyOpen = false,
}: ModalDebuggerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const modalStack = useModalStore(state => state.modalStack);
  
  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '1rem', right: '1rem' },
    'top-left': { top: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
  };

  // Toggle debugger visibility
  const toggleDebugger = () => setIsOpen(!isOpen);

  // Base styles
  const debuggerStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    ...positionStyles[position],
  };

  const buttonStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    ...positionStyles[position],
  };

  const contentStyles: React.CSSProperties = {
    padding: '1rem',
    maxHeight: '300px',
    overflowY: 'auto',
    width: '300px',
  };

  const headerStyles: React.CSSProperties = {
    borderBottom: '1px solid #555',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  };

  const modalItemStyles: React.CSSProperties = {
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
  };

  const stepItemStyles: React.CSSProperties = {
    marginLeft: '1rem',
    padding: '0.25rem',
    borderLeft: '2px solid #555',
  };

  const currentStepStyles: React.CSSProperties = {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  };

  return (
    <>
      {!isOpen && (
        <button style={buttonStyles} onClick={toggleDebugger}>
          🔍 Modal Debug
        </button>
      )}

      {isOpen && (
        <div style={debuggerStyles}>
          <div style={contentStyles}>
            <div style={headerStyles}>
              <span>Modal Debugger</span>
              <button
                onClick={toggleDebugger}
                style={{
                  float: 'right',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {modalStack.length === 0 ? (
              <div>No active modals</div>
            ) : (
              <div>
                {modalStack.map((modal, index) => (
                  <div key={modal.modalId} style={modalItemStyles}>
                    <div>
                      <strong>Modal:</strong> {modal.modalId}
                      {index === modalStack.length - 1 && (
                        <span style={{ color: '#8f8', marginLeft: '0.5rem' }}>
                          (Active)
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Steps:</strong> {modal.steps.length}
                    </div>
                    <div>
                      <strong>Current Step:</strong> {modal.currentStepIndex + 1}
                    </div>
                    <div>
                      <strong>Steps:</strong>
                      {modal.steps.map((step, stepIndex) => (
                        <div
                          key={step.id}
                          style={{
                            ...stepItemStyles,
                            ...(stepIndex === modal.currentStepIndex
                              ? currentStepStyles
                              : {}),
                          }}
                        >
                          <div>
                            <strong>{step.id}</strong>
                            {stepIndex === modal.currentStepIndex && (
                              <span style={{ color: '#8f8', marginLeft: '0.5rem' }}>
                                (Current)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '10px' }}>
                            <pre>{JSON.stringify(step.data, null, 2)}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ModalDebugger;