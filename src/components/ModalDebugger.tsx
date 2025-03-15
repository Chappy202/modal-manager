import React, { useState } from 'react';
import useModalStore from '../core/store';

export type ModalDebuggerProps = {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  initiallyOpen?: boolean;
};

/**
 * Styles for the debugger component
 */
const styles = {
  button: {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
  } as React.CSSProperties,

  debugger: {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  } as React.CSSProperties,

  content: {
    padding: '1rem',
    maxHeight: '300px',
    overflowY: 'auto',
    width: '300px',
  } as React.CSSProperties,

  header: {
    borderBottom: '1px solid #555',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,

  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,

  modalItem: {
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
  } as React.CSSProperties,

  stepItem: {
    marginLeft: '1rem',
    padding: '0.25rem',
    borderLeft: '2px solid #555',
  } as React.CSSProperties,

  currentStep: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  } as React.CSSProperties,

  badge: {
    color: '#8f8',
    marginLeft: '0.5rem',
    fontSize: '10px',
  } as React.CSSProperties,

  dataDisplay: {
    fontSize: '10px',
    marginTop: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '4px',
    borderRadius: '2px',
    overflow: 'auto',
    maxHeight: '100px',
  } as React.CSSProperties,
};

/**
 * Helper to stringify data
 */
const stringify = (data: Record<string, unknown>): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return '[Error: Unable to stringify]';
  }
};

/**
 * Renders a single step in the debugger
 */
const StepItem = ({
  step,
  isCurrentStep
}: {
  step: { id: string, data?: Record<string, unknown> },
  isCurrentStep: boolean
}) => (
  <div
    style={{
      ...styles.stepItem,
      ...(isCurrentStep ? styles.currentStep : {}),
    }}
  >
    <div>
      <strong>{step.id}</strong>
      {isCurrentStep && <span style={styles.badge}>(Current)</span>}
    </div>

    {step.data && Object.keys(step.data).length > 0 && (
      <pre style={styles.dataDisplay}>{stringify(step.data)}</pre>
    )}
  </div>
);

/**
 * Renders a single modal in the debugger
 */
const ModalItem = ({
  modalId,
  modal
}: {
  modalId: string;
  modal: {
    steps: Array<{ id: string, data?: Record<string, unknown> }>,
    currentStepIndex: number,
    data: Record<string, unknown>
  };
}) => {
  return (
    <div style={styles.modalItem}>
      <div>
        <strong>Modal:</strong> {modalId}
      </div>

      <div>
        <strong>Steps:</strong> {modal.steps.length}
      </div>

      <div>
        <strong>Current Step:</strong> {modal.currentStepIndex + 1}
      </div>

      {modal.data && Object.keys(modal.data).length > 0 && (
        <div>
          <strong>Data:</strong>
          <pre style={styles.dataDisplay}>{stringify(modal.data)}</pre>
        </div>
      )}

      <div>
        <strong>Steps:</strong>
        {modal.steps.length === 0 ? (
          <div style={{ marginLeft: '1rem', fontStyle: 'italic' }}>No steps registered</div>
        ) : (
          modal.steps.map((step, stepIndex) => (
            <StepItem
              key={step.id}
              step={step}
              isCurrentStep={stepIndex === modal.currentStepIndex}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * A debugging component that displays the current state of modals
 * Only intended for development use
 */
export function ModalDebugger({
  position = 'bottom-right',
  initiallyOpen = false,
}: ModalDebuggerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const modals = useModalStore(state => state.modals);

  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '1rem', right: '1rem' },
    'top-left': { top: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
  };

  // Toggle debugger visibility
  const toggleDebugger = () => setIsOpen(!isOpen);

  if (!isOpen) {
    return (
      <button
        style={{ ...styles.button, ...positionStyles[position] }}
        onClick={toggleDebugger}
        aria-label="Open Modal Debugger"
      >
        🔍 Modal Debug
      </button>
    );
  }

  const modalEntries = Object.entries(modals);

  return (
    <div style={{ ...styles.debugger, ...positionStyles[position] }}>
      <div style={styles.content}>
        <div style={styles.header}>
          <span>Modal Debugger</span>
          <button
            onClick={toggleDebugger}
            style={styles.closeButton}
            aria-label="Close Modal Debugger"
          >
            ✕
          </button>
        </div>

        {modalEntries.length === 0 ? (
          <div>No active modals</div>
        ) : (
          <div>
            {modalEntries.map(([modalId, modal]) => (
              <ModalItem
                key={modalId}
                modalId={modalId}
                modal={modal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
