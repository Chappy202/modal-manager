import React, { useState, useEffect } from 'react';
import { useModal, ModalContent, Step, StepRenderer } from '../../src';
import { Modal } from './Modal';

export function PaymentExample() {
  const { isOpen, open, close, goTo, setData, data, addStep } = useModal({
    id: 'payment-example',
    steps: [
      { id: 'method' },
      { id: 'card-details' },
      { id: 'bank-details' },
      { id: 'confirm' },
    ]
  });

  // Set up the step navigation relationships
  useEffect(() => {
    // Define the previous step for each conditional step
    addStep('payment-example', 'card-details', {}, 'method');
    addStep('payment-example', 'bank-details', {}, 'method');
    addStep('payment-example', 'confirm', {}, data.paymentMethod === 'card' ? 'card-details' : 'bank-details');
  }, [addStep, data.paymentMethod]);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodSelect = (method: string) => {
    setData({ paymentMethod: method });

    // Go to the appropriate step based on payment method
    if (method === 'card') {
      goTo('card-details');
    } else if (method === 'bank') {
      goTo('bank-details');
    }
  };

  const handleSubmitCardDetails = () => {
    setData({
      cardDetails: {
        number: formData.cardNumber,
        name: formData.cardName,
        expiry: formData.cardExpiry,
        cvv: formData.cardCvv,
      }
    });
    goTo('confirm');
  };

  const handleSubmitBankDetails = () => {
    setData({
      bankDetails: {
        name: formData.bankName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
      }
    });
    goTo('confirm');
  };

  const handleOpen = () => {
    console.log('Opening payment example modal');
    open();
  };

  const handleClose = () => {
    close();
  };

  return (
    <div className="example-card">
      <div className="example-card-header">
        <h2>Payment Flow Example</h2>
      </div>
      <div className="example-card-body">
        <p>A payment flow with conditional steps based on payment method.</p>
        <p className="debug-info">Modal state: {isOpen ? 'Open' : 'Closed'}</p>
      </div>
      <div className="example-card-footer">
        <button className="button" onClick={handleOpen}>Make Payment</button>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title="Payment Flow">
        <ModalContent id="payment-example">
          {({ currentStep, prev, close }) => (
            <>
              <StepRenderer currentStep={currentStep}>
                <Step id="method">
                  <h3>Select Payment Method</h3>
                  <p>Choose how you would like to pay:</p>
                  <div className="button-group">
                    <button
                      className="button"
                      onClick={() => handlePaymentMethodSelect('card')}
                    >
                      Credit Card
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => handlePaymentMethodSelect('bank')}
                    >
                      Bank Transfer
                    </button>
                  </div>
                </Step>

                <Step id="card-details">
                  <h3>Enter Card Details</h3>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name on Card</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="123"
                    />
                  </div>
                  <div className="button-group">
                    <button className="button secondary" onClick={() => prev()}>Back</button>
                    <button className="button" onClick={handleSubmitCardDetails}>Continue</button>
                  </div>
                </Step>

                <Step id="bank-details">
                  <h3>Enter Bank Details</h3>
                  <div className="form-group">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Bank of America"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Routing Number</label>
                    <input
                      type="text"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="987654321"
                    />
                  </div>
                  <div className="button-group">
                    <button className="button secondary" onClick={() => prev()}>Back</button>
                    <button className="button" onClick={handleSubmitBankDetails}>Continue</button>
                  </div>
                </Step>

                <Step id="confirm">
                  <h3>Confirm Payment</h3>
                  <p>Please review your payment details:</p>

                  <div className="card">
                    <p><strong>Payment Method:</strong> {data.paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}</p>

                    {data.paymentMethod === 'card' && 'cardDetails' in data && (
                      <>
                        <p><strong>Card Number:</strong> **** **** **** {formData.cardNumber.slice(-4)}</p>
                        <p><strong>Name on Card:</strong> {formData.cardName}</p>
                      </>
                    )}

                    {data.paymentMethod === 'bank' && 'bankDetails' in data && (
                      <>
                        <p><strong>Bank:</strong> {formData.bankName}</p>
                        <p><strong>Account:</strong> *****{formData.accountNumber.slice(-4)}</p>
                      </>
                    )}
                  </div>

                  <div className="button-group">
                    <button className="button secondary" onClick={() => prev()}>Back</button>
                    <button className="button" onClick={handleClose}>Confirm Payment</button>
                  </div>
                </Step>
              </StepRenderer>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
