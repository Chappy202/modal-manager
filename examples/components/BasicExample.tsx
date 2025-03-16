import React, { useState } from 'react';
import { useModal, ModalContent, Step, StepRenderer } from '../../src';
import { Modal } from './Modal';

export function BasicExample() {
  const { isOpen, open, close, currentStep, next, prev, isFirst, isLast } = useModal({
    id: 'basic-example',
    steps: [
      { id: 'step1' },
      { id: 'step2' },
      { id: 'step3' },
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
        <h2>Basic Example</h2>
      </div>
      <div className="example-card-body">
        <p>A simple multi-step modal with three steps.</p>
      </div>
      <div className="example-card-footer">
        <button className="button" onClick={handleOpen}>Open Modal</button>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title="Basic Example">
        <div className="step-indicator">
          {[1, 2, 3].map((step, index) => (
            <div
              key={index}
              className={`step ${index === 0 && currentStep === 'step1' ? 'active' : ''} ${index === 1 && currentStep === 'step2' ? 'active' : ''} ${index === 2 && currentStep === 'step3' ? 'active' : ''} ${(index === 0 && currentStep !== 'step1') || (index === 1 && currentStep === 'step3') ? 'completed' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>

        <StepRenderer currentStep={currentStep}>
          <Step id="step1">
            <h3>Step 1: Introduction</h3>
            <p>This is the first step of the modal. Click Next to continue.</p>
          </Step>

          <Step id="step2">
            <h3>Step 2: Details</h3>
            <p>This is the second step of the modal. You can go back or continue.</p>
          </Step>

          <Step id="step3">
            <h3>Step 3: Confirmation</h3>
            <p>This is the final step of the modal. Click Finish to close the modal.</p>
          </Step>
        </StepRenderer>

        <div className="button-group">
          {!isFirst && <button className="button secondary" onClick={() => prev()}>Back</button>}
          {!isLast ? (
            <button className="button" onClick={() => next()}>Next</button>
          ) : (
            <button className="button" onClick={handleClose}>Finish</button>
          )}
        </div>
      </Modal>
    </div>
  );
}
