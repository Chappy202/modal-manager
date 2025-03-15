import React, { useState, useEffect } from 'react';
import { useModal, ModalStep, ModalFlow } from '../hooks/useModal';

// Styles for the AdvancedModal
const styles = {
  button: {
    primary: {
      backgroundColor: '#10B981',
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
    justifyContent: 'space-between',
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
    maxWidth: '550px',
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
  progressBar: {
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    marginBottom: '1.5rem',
    overflow: 'hidden',
  } as React.CSSProperties,
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    transition: 'width 0.3s ease',
  } as React.CSSProperties,
  stepTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1f2937',
  } as React.CSSProperties,
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    padding: '1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  } as React.CSSProperties,
  cardSelected: {
    borderColor: '#10B981',
    boxShadow: '0 0 0 1px #10B981',
  } as React.CSSProperties,
  cardTitle: {
    fontWeight: 600,
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  cardDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
  } as React.CSSProperties,
  summaryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  summaryLabel: {
    fontWeight: 500,
  } as React.CSSProperties,
  summaryValue: {
    color: '#6b7280',
  } as React.CSSProperties,
  summaryTotal: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '0.5rem',
    marginTop: '0.5rem',
    fontWeight: 600,
  } as React.CSSProperties,
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 500,
    backgroundColor: '#10B981',
    color: 'white',
    marginLeft: '0.5rem',
  } as React.CSSProperties,
  successIcon: {
    width: '48px',
    height: '48px',
    margin: '0 auto 1rem',
    display: 'block',
    color: '#10B981',
  } as React.CSSProperties,
  centered: {
    textAlign: 'center',
  } as React.CSSProperties,
};

// Modal dialog component
interface AdvancedModalDialogProps {
  title: string;
  children: React.ReactNode;
  progress: number;
}

const AdvancedModalDialog = ({ title, children, progress }: AdvancedModalDialogProps) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Step 1: Product Selection
const ProductSelection = () => {
  const modal = useModal('advanced-modal');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Initialize with existing data if available
  useEffect(() => {
    if (modal.data.product) {
      setSelectedProduct(modal.data.product);
    }
  }, [modal.data]);

  const products = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Essential features for individuals and small teams',
      price: 9.99,
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      description: 'Advanced features for growing businesses',
      price: 19.99,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Complete solution for large organizations',
      price: 49.99,
    },
  ];

  const handleNext = () => {
    if (selectedProduct) {
      const product = products.find(p => p.id === selectedProduct);
      modal.updateData({
        product: selectedProduct,
        productName: product?.name,
        price: product?.price
      });
      modal.nextStep();
    }
  };

  return (
    <div>
      <h4 style={styles.stepTitle}>Choose a Plan</h4>

      <div>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              ...styles.card,
              ...(selectedProduct === product.id ? styles.cardSelected : {}),
            }}
            onClick={() => setSelectedProduct(product.id)}
          >
            <div style={styles.cardTitle}>
              {product.name}
              <span style={styles.badge}>${product.price}/mo</span>
            </div>
            <div style={styles.cardDescription}>{product.description}</div>
          </div>
        ))}
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
          disabled={!selectedProduct}
          style={selectedProduct ? styles.button.primary : styles.button.disabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Step 2: User Details
const UserDetails = () => {
  const modal = useModal('advanced-modal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });

  // Initialize with existing data if available
  useEffect(() => {
    setFormData({
      name: modal.data.name || '',
      email: modal.data.email || '',
      company: modal.data.company || '',
    });
  }, [modal.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Simplified validation
  const isValid = formData.name.trim() &&
    formData.email.trim() &&
    formData.email.includes('@');

  const handleNext = () => {
    if (isValid) {
      modal.updateData(formData);
      modal.nextStep();
    }
  };

  return (
    <div>
      <h4 style={styles.stepTitle}>Your Information</h4>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter your full name"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter your email address"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="company">
          Company (Optional)
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter your company name"
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
          disabled={!isValid}
          style={isValid ? styles.button.primary : styles.button.disabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Step 3: Payment Options
const PaymentOptions = () => {
  const modal = useModal('advanced-modal');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Initialize with existing data if available
  useEffect(() => {
    if (modal.data.paymentMethod) {
      setPaymentMethod(modal.data.paymentMethod);
    }
  }, [modal.data]);

  const handleNext = () => {
    if (paymentMethod) {
      modal.updateData({ paymentMethod });
      modal.nextStep();
    }
  };

  return (
    <div>
      <h4 style={styles.stepTitle}>Payment Method</h4>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Payment Method</label>
        <div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={paymentMethod === 'credit-card'}
                onChange={() => setPaymentMethod('credit-card')}
                style={{ marginRight: '0.5rem' }}
              />
              Credit Card
            </label>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                style={{ marginRight: '0.5rem' }}
              />
              PayPal
            </label>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="bank-transfer"
                checked={paymentMethod === 'bank-transfer'}
                onChange={() => setPaymentMethod('bank-transfer')}
                style={{ marginRight: '0.5rem' }}
              />
              Bank Transfer
            </label>
          </div>
        </div>
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
          disabled={!paymentMethod}
          style={paymentMethod ? styles.button.primary : styles.button.disabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Step 4: Summary
const Summary = () => {
  const modal = useModal('advanced-modal');
  const data = modal.data;
  const [agreed, setAgreed] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div>
      <h4 style={styles.stepTitle}>Order Summary</h4>

      <div style={styles.summaryCard}>
        <div style={styles.summaryRow}>
          <div style={styles.summaryLabel}>Plan:</div>
          <div style={styles.summaryValue}>{data.productName}</div>
        </div>
        <div style={styles.summaryRow}>
          <div style={styles.summaryLabel}>Customer:</div>
          <div style={styles.summaryValue}>{data.name}</div>
        </div>
        <div style={styles.summaryRow}>
          <div style={styles.summaryLabel}>Email:</div>
          <div style={styles.summaryValue}>{data.email}</div>
        </div>
        {data.company && (
          <div style={styles.summaryRow}>
            <div style={styles.summaryLabel}>Company:</div>
            <div style={styles.summaryValue}>{data.company}</div>
          </div>
        )}
        <div style={styles.summaryRow}>
          <div style={styles.summaryLabel}>Payment Method:</div>
          <div style={styles.summaryValue}>
            {data.paymentMethod === 'credit-card' && 'Credit Card'}
            {data.paymentMethod === 'paypal' && 'PayPal'}
            {data.paymentMethod === 'bank-transfer' && 'Bank Transfer'}
          </div>
        </div>
        <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
          <div>Total:</div>
          <div>{formatPrice(data.price as number)}/month</div>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            style={{ marginRight: '0.5rem' }}
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={modal.prevStep}
          style={styles.button.secondary}
        >
          Back
        </button>
        <button
          onClick={modal.complete}
          disabled={!agreed}
          style={agreed ? styles.button.primary : styles.button.disabled}
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

// Step 5: Success
const Success = () => {
  const modal = useModal('advanced-modal');
  const data = modal.data;

  return (
    <div style={styles.centered}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={styles.successIcon}
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>

      <h4 style={{ ...styles.stepTitle, textAlign: 'center' }}>Order Successful!</h4>

      <p>
        Thank you for your order, {data.name}. We've sent a confirmation email to {data.email}.
      </p>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          onClick={modal.close}
          style={styles.button.primary}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Main component
export const AdvancedModal = () => {
  const [open, setOpen] = useState(false);

  const handleComplete = (data: Record<string, any>) => {
    console.log('Order completed with data:', data);
    // In a real app, you would submit this data to your backend
    setOpen(false);
  };

  const handleCancel = () => {
    console.log('Advanced modal cancelled');
    setOpen(false);
  };

  // Pass callbacks directly to the hook
  const modal = useModal('advanced-modal', {
    onComplete: handleComplete,
    onCancel: handleCancel
  });

  const calculateProgress = () => {
    const currentStep = modal.currentStepIndex;
    const totalSteps = 5; // Total number of steps
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  };

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
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        Open Subscription Wizard
      </button>

      {open && (
        <ModalFlow
          id="advanced-modal"
          open={open}
          onOpenChange={setOpen}
          // No need to pass callbacks again, they're already in the hook
        >
          <AdvancedModalDialog
            title="Subscription Wizard"
            progress={calculateProgress()}
          >
            <ModalStep modalId="advanced-modal" stepId="product-selection">
              <ProductSelection />
            </ModalStep>

            <ModalStep modalId="advanced-modal" stepId="user-details">
              <UserDetails />
            </ModalStep>

            <ModalStep modalId="advanced-modal" stepId="payment-options">
              <PaymentOptions />
            </ModalStep>

            <ModalStep modalId="advanced-modal" stepId="summary">
              <Summary />
            </ModalStep>

            <ModalStep modalId="advanced-modal" stepId="success">
              <Success />
            </ModalStep>
          </AdvancedModalDialog>
        </ModalFlow>
      )}
    </div>
  );
};
