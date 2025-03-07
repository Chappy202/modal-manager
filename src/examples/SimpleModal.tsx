import React, { useState } from 'react';
import { useModal, ModalStep, ModalFlow } from '../useModal';

// This is a simple example of how to use the modal manager
// In a real application, you would use your own UI components
// This example uses basic HTML elements for simplicity

interface SimpleDialogProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// A simple dialog component
const SimpleDialog: React.FC<SimpleDialogProps> = ({ title, children, footer }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        width: '500px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <div style={{ 
          padding: '16px 24px',
          borderBottom: '1px solid #eee',
          fontWeight: 'bold',
          fontSize: '18px',
        }}>
          {title}
        </div>
        
        <div style={{ padding: '24px' }}>
          {children}
        </div>
        
        {footer && (
          <div style={{ 
            padding: '16px 24px',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// A simple button component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: props.color === 'primary' ? '#1677ff' : '#f0f0f0',
        color: props.color === 'primary' ? 'white' : 'black',
        cursor: 'pointer',
        ...props.style,
      }}
    />
  );
};

// Example multi-step modal
export const SimpleMultiStepModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  const handleComplete = (data: Record<string, any>) => {
    console.log('Form completed with data:', data);
    alert(`Form completed! Check console for data.`);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Modal Manager Example</h1>
      <p>This is a simple example of a multi-step modal using the modal manager.</p>
      
      <Button color="primary" onClick={() => setOpen(true)}>
        Open Multi-Step Form
      </Button>
      
      {open && (
        <ModalFlow
          id="simple-form"
          open={open}
          onOpenChange={setOpen}
          options={{
            onComplete: handleComplete,
            initialData: { defaultValue: 'This is a default value' }
          }}
        >
          <SimpleDialog 
            title="Multi-Step Form"
            footer={<StepButtons modalId="simple-form" />}
          >
            {/* Step 1 */}
            <ModalStep modalId="simple-form" stepId="personal-info">
              {(data) => (
                <PersonalInfoStep data={data} />
              )}
            </ModalStep>
            
            {/* Step 2 */}
            <ModalStep modalId="simple-form" stepId="contact-info">
              {(data) => (
                <ContactInfoStep data={data} />
              )}
            </ModalStep>
            
            {/* Step 3 */}
            <ModalStep modalId="simple-form" stepId="confirmation">
              {(data) => (
                <ConfirmationStep data={data} />
              )}
            </ModalStep>
          </SimpleDialog>
        </ModalFlow>
      )}
    </div>
  );
};

// Navigation buttons for the steps
const StepButtons: React.FC<{ modalId: string }> = ({ modalId }) => {
  const modal = useModal(modalId);
  
  return (
    <>
      {!modal.isFirstStep && (
        <Button onClick={() => modal.prevStep()}>
          Previous
        </Button>
      )}
      
      {!modal.isLastStep ? (
        <Button color="primary" onClick={() => modal.nextStep()}>
          Next
        </Button>
      ) : (
        <Button color="primary" onClick={() => modal.complete()}>
          Submit
        </Button>
      )}
    </>
  );
};

// Step 1: Personal Information
const PersonalInfoStep: React.FC<{ data: any }> = ({ data }) => {
  const modal = useModal('simple-form');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    modal.updateStepData('personal-info', {
      ...data,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div>
      <h2>Personal Information</h2>
      <p>Please enter your personal details.</p>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={data?.firstName || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={data?.lastName || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
        />
      </div>
    </div>
  );
};

// Step 2: Contact Information
const ContactInfoStep: React.FC<{ data: any }> = ({ data }) => {
  const modal = useModal('simple-form');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    modal.updateStepData('contact-info', {
      ...data,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div>
      <h2>Contact Information</h2>
      <p>How can we reach you?</p>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          value={data?.email || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={data?.phone || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
        />
      </div>
    </div>
  );
};

// Step 3: Confirmation
const ConfirmationStep: React.FC<{ data: any }> = ({ data }) => {
  const modal = useModal('simple-form');
  const allData = modal.getAllData();
  
  return (
    <div>
      <h2>Confirm Your Information</h2>
      <p>Please review your information before submitting.</p>
      
      <div style={{ 
        backgroundColor: '#f5f5f5',
        padding: '16px',
        borderRadius: '4px',
        marginTop: '16px'
      }}>
        <h3>Personal Information</h3>
        <p><strong>First Name:</strong> {allData.firstName || 'Not provided'}</p>
        <p><strong>Last Name:</strong> {allData.lastName || 'Not provided'}</p>
        
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> {allData.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> {allData.phone || 'Not provided'}</p>
      </div>
    </div>
  );
}; 