import React, { useState, useEffect } from 'react';
import { useModal, ModalStep, ModalFlow } from '../hooks/useModal';

// Styles for the SimpleModal
const styles = {
  button: {
    primary: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    secondary: {
      backgroundColor: 'white',
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
    },
    disabled: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'not-allowed',
    },
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#1f2937',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1.5rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    backdropFilter: 'blur(4px)',
  } as React.CSSProperties,
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '28rem',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    animation: 'modalFadeIn 0.3s ease-out',
  } as React.CSSProperties,
  modalHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  modalTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1f2937',
  } as React.CSSProperties,
  modalBody: {
    padding: '1.5rem',
  } as React.CSSProperties,
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  stepDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    margin: '0 4px',
  } as React.CSSProperties,
  stepDotActive: {
    backgroundColor: '#4f46e5',
  } as React.CSSProperties,
  stepTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1f2937',
  } as React.CSSProperties,
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  infoRow: {
    display: 'flex',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  infoLabel: {
    fontWeight: 500,
    width: '100px',
    flexShrink: 0,
  } as React.CSSProperties,
  infoValue: {
    color: '#6b7280',
  } as React.CSSProperties,
};

// Modal dialog component
interface SimpleModalDialogProps {
  title: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

const SimpleModalDialog = ({ title, children, currentStep, totalSteps }: SimpleModalDialogProps) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.stepIndicator}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.stepDot,
                  ...(index === currentStep ? styles.stepDotActive : {}),
                }}
              />
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Step 1: Name input
const StepOne = () => {
  const modal = useModal('simple-modal');
  const [name, setName] = useState('');

  // Initialize with existing data if available
  useEffect(() => {
    if (modal.data.name) {
      setName(modal.data.name);
    }
  }, [modal.data]);

  const handleNext = () => {
    if (name.trim()) {
      modal.updateData({ name });
      modal.nextStep();
    }
  };

  return (
    <div>
      <h4 style={styles.stepTitle}>Personal Information</h4>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          placeholder="Enter your full name"
        />
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={modal.close}
          style={styles.button.secondary}
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          disabled={!name.trim()}
          style={name.trim() ? styles.button.primary : styles.button.disabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Step 2: Email input
const StepTwo = () => {
  const modal = useModal('simple-modal');
  const [email, setEmail] = useState('');

  // Initialize with existing data if available
  useEffect(() => {
    if (modal.data.email) {
      setEmail(modal.data.email);
    }
  }, [modal.data]);

  // Simplified email validation
  const isValidEmail = email.trim() && email.includes('@');

  const handleNext = () => {
    if (isValidEmail) {
      modal.updateData({ email });
      modal.nextStep();
    }
  };

  return (
    <div>
      <h4 style={styles.stepTitle}>Contact Information</h4>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Enter your email address"
        />
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={modal.prevStep}
          style={styles.button.secondary}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isValidEmail}
          style={isValidEmail ? styles.button.primary : styles.button.disabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Step 3: Confirmation
const StepThree = () => {
  const modal = useModal('simple-modal');
  const data = modal.data;

  return (
    <div>
      <h4 style={styles.stepTitle}>Confirm Your Information</h4>

      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <div style={styles.infoLabel}>Name:</div>
          <div style={styles.infoValue}>{data.name || ''}</div>
        </div>
        <div style={styles.infoRow}>
          <div style={styles.infoLabel}>Email:</div>
          <div style={styles.infoValue}>{data.email || ''}</div>
        </div>
      </div>

      <p>Please review your information above before submitting.</p>

      <div style={styles.buttonGroup}>
        <button
          onClick={modal.prevStep}
          style={styles.button.secondary}
        >
          Back
        </button>
        <button
          onClick={modal.complete}
          style={styles.button.primary}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// Main component
export const SimpleMultiStepModal = () => {
  const [open, setOpen] = useState(false);

  const handleComplete = (data: Record<string, any>) => {
    console.log('Form submitted with data:', data);
    alert(`Form submitted successfully!\n\nName: ${data.name}\nEmail: ${data.email}`);
    setOpen(false);
  };

  const handleCancel = () => {
    console.log('Modal cancelled');
    setOpen(false);
  };

  const modal = useModal('simple-modal', {
    onComplete: handleComplete,
    onCancel: handleCancel
  });

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{
          ...styles.button.primary,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Open Multi-Step Form
      </button>

      {open && (
        <ModalFlow
          id="simple-modal"
          open={open}
          onOpenChange={setOpen}
          options={{
            onComplete: handleComplete,
            onCancel: handleCancel,
          }}
        >
          <SimpleModalDialog
            title="User Registration"
            currentStep={modal.currentStepIndex}
            totalSteps={3}
          >
            <ModalStep modalId="simple-modal" stepId="step-1">
              <StepOne />
            </ModalStep>

            <ModalStep modalId="simple-modal" stepId="step-2">
              <StepTwo />
            </ModalStep>

            <ModalStep modalId="simple-modal" stepId="step-3">
              <StepThree />
            </ModalStep>
          </SimpleModalDialog>
        </ModalFlow>
      )}
    </div>
  );
};
