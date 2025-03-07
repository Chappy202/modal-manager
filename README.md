# Modal State Manager

A flexible, state management library for multi-step dialogs and modals in React applications. Works with any UI library including ShadCN, Material UI, or your custom modal components.

## Features

- 📚 **Multi-step flows** - Navigate forward, backward, or to any specific step
- 🔄 **State persistence** - Maintain data between steps and collect it at the end
- 🧱 **UI-agnostic** - Works with any modal or dialog component
- 🔀 **Conditional flows** - Create dynamic paths based on user choices
- 📦 **Stack-based modals** - Support for nested/stacked modals
- 🔍 **Developer tools** - Built-in Redux DevTools support for debugging

## Installation

```bash
npm install modal-state-manager
# or
yarn add modal-state-manager
```

## Basic Usage

Here's a simple example using ShadCN UI components:

```tsx
import { useModal, ModalStep, ModalFlow } from 'modal-state-manager';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function MyMultiStepModal() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <ModalFlow 
          id="my-flow" 
          open={open} 
          onOpenChange={setOpen}
          options={{ 
            onComplete: (data) => console.log('Completed with data:', data),
            initialData: { defaultValue: 'example' }
          }}
        >
          <DialogContent>
            {/* Step 1 */}
            <ModalStep modalId="my-flow" stepId="step-1">
              <StepOneContent />
            </ModalStep>
            
            {/* Step 2 */}
            <ModalStep modalId="my-flow" stepId="step-2">
              <StepTwoContent />
            </ModalStep>
            
            {/* Step 3 */}
            <ModalStep modalId="my-flow" stepId="step-3">
              <StepThreeContent />
            </ModalStep>
          </DialogContent>
        </ModalFlow>
      </Dialog>
    </>
  );
}
```

## Advanced Usage: Conditional Flows

Create flows that branch based on user input:

```tsx
// AdvancedModalExample.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useModal, ModalStep, ModalFlow } from './modal-library';

export function OrderProcessFlow() {
  const [open, setOpen] = React.useState(false);
  
  const handleComplete = (data: any) => {
    console.log('Order completed with data:', data);
    // Process the order with the collected data
  };
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Place Order</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <ModalFlow 
          id="order-flow" 
          open={open} 
          onOpenChange={setOpen}
          options={{ 
            onComplete: handleComplete,
            initialData: { 
              items: [{ id: 1, name: "Product A", price: 29.99 }],
              total: 29.99
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <OrderSteps />
          </DialogContent>
        </ModalFlow>
      </Dialog>
    </>
  );
}

function OrderSteps() {
  const modal = useModal('order-flow');
  
  // Helper function to determine next step based on payment method
  const handlePaymentSelection = (method: string) => {
    modal.updateStepData('payment-method', { paymentMethod: method });
    
    // Navigate to different next steps based on payment method
    if (method === 'credit-card') {
      modal.goToStep('credit-card-details');
    } else if (method === 'paypal') {
      modal.goToStep('paypal-details');
    } else {
      modal.goToStep('confirmation');
    }
  };
  
  // Get all data to track the user's progress
  const allData = modal.getAllData();
  
  return (
    <>
      {/* Order Review Step */}
      <ModalStep modalId="order-flow" stepId="review">
        {(data) => (
          <>
            <DialogHeader>
              <DialogTitle>Review Your Order</DialogTitle>
              <DialogDescription>
                Please review the items in your order.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="border rounded p-4 mb-4">
                {data.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>${data.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => modal.close()}>Cancel</Button>
              <Button onClick={() => modal.nextStep()}>Proceed to Payment</Button>
            </DialogFooter>
          </>
        )}
      </ModalStep>
      
      {/* Payment Method Selection Step */}
      <ModalStep modalId="order-flow" stepId="payment-method">
        {(data) => (
          <>
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
              <DialogDescription>
                Choose how you would like to pay.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <RadioGroup
                defaultValue={data?.paymentMethod}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="credit-card" 
                    value="credit-card" 
                    onClick={() => modal.updateStepData('payment-method', { paymentMethod: 'credit-card' })}
                  />
                  <Label htmlFor="credit-card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="paypal" 
                    value="paypal" 
                    onClick={() => modal.updateStepData('payment-method', { paymentMethod: 'paypal' })}
                  />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="bank-transfer" 
                    value="bank-transfer" 
                    onClick={() => modal.updateStepData('payment-method', { paymentMethod: 'bank-transfer' })}
                  />
                  <Label htmlFor="bank-transfer">Bank Transfer</Label>
                </div>
              </RadioGroup>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => modal.prevStep()}>Back</Button>
              <Button onClick={() => {
                // Navigate based on selected payment method
                const method = data?.paymentMethod || 'credit-card';
                handlePaymentSelection(method);
              }}>Next</Button>
            </DialogFooter>
          </>
        )}
      </ModalStep>
      
      {/* Credit Card Details Step (Conditional) */}
      <ModalStep modalId="order-flow" stepId="credit-card-details">
        {(data) => (
          <>
            <DialogHeader>
              <DialogTitle>Enter Credit Card Details</DialogTitle>
              <DialogDescription>
                Please enter your credit card information.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {/* Credit card form fields */}
              {/* This would be your credit card form components */}
              <p>Credit card form fields would go here</p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => modal.goToStep('payment-method')}>Back</Button>
              <Button onClick={() => modal.goToStep('confirmation')}>Submit Payment</Button>
            </DialogFooter>
          </>
        )}
      </ModalStep>
      
      {/* PayPal Details Step (Conditional) */}
      <ModalStep modalId="order-flow" stepId="paypal-details">
        {(data) => (
          <>
            <DialogHeader>
              <DialogTitle>Connect to PayPal</DialogTitle>
              <DialogDescription>
                You'll be redirected to PayPal to complete your payment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {/* PayPal specific content */}
              <p>PayPal connection interface would go here</p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => modal.goToStep('payment-method')}>Back</Button>
              <Button onClick={() => modal.goToStep('confirmation')}>Connect to PayPal</Button>
            </DialogFooter>
          </>
        )}
      </ModalStep>
      
      {/* Order Confirmation Step */}
      <ModalStep modalId="order-flow" stepId="confirmation">
        {(data) => (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Your Order</DialogTitle>
              <DialogDescription>
                Please review your order and payment details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="border rounded p-4 mb-4">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                {allData.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between mb-1">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>${allData.total.toFixed(2)}</span>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <p>{allData.paymentMethod === 'credit-card' ? 'Credit Card' : 
                      allData.paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                // Go back to appropriate payment details screen
                if (allData.paymentMethod === 'credit-card') {
                  modal.goToStep('credit-card-details');
                } else if (allData.paymentMethod === 'paypal') {
                  modal.goToStep('paypal-details');
                } else {
                  modal.goToStep('payment-method');
                }
              }}>Back</Button>
              <Button onClick={() => modal.complete()}>Place Order</Button>
            </DialogFooter>
          </>
        )}
      </ModalStep>
    </>
  );
}
```

## Accessing and Managing State

Use the `useModal` hook to access and manage the modal state:

```tsx
function StepOneContent() {
  const modal = useModal('my-flow');
  
  return (
    <>
      <h2>Step 1</h2>
      <input 
        type="text"
        onChange={(e) => modal.updateStepData('step-1', { value: e.target.value })}
      />
      <button onClick={() => modal.nextStep()}>Next</button>
    </>
  );
}
```

## API Reference

### useModalStore

The core Zustand store with all modal state functionality:

- `registerModal(modalId, initialData?)` - Create or focus a modal
- `closeModal(modalId?)` - Close a specific modal or the top modal
- `closeAllModals()` - Close all open modals
- `addStep(modalId, stepId, stepData?)` - Register a step for a modal
- `goToStep(modalId, stepId, stepData?)` - Navigate to a specific step
- `nextStep(modalId, stepData?)` - Navigate to the next step
- `prevStep(modalId)` - Navigate to the previous step
- `updateStepData(modalId, stepId, data)` - Update data for a specific step
- `getStepData(modalId, stepId)` - Get data for a specific step
- `getAllData(modalId)` - Get combined data from all steps

### useModal(modalId, options?)

A React hook that provides an easy interface to the modal store:

- `isOpen` - Whether the modal is open
- `currentStep` - The current step object
- `currentStepIndex` - The index of the current step
- `totalSteps` - The total number of steps
- `isFirstStep` - Whether the current step is the first
- `isLastStep` - Whether the current step is the last
- `addStep(stepId, data?)` - Register a step
- `goToStep(stepId, data?)` - Navigate to a step
- `nextStep(data?)` - Navigate to the next step
- `prevStep()` - Navigate to the previous step
- `close()` - Close the modal
- `complete()` - Complete the modal flow

### Components

- `<ModalFlow>` - Connects your UI dialog/modal to the state manager
- `<ModalStep>` - Renders the content for a specific step

## Best Practices

1. **Step Organization**:
   - Keep step components focused on rendering UI
   - Move logic into custom hooks when possible

2. **Data Management**:
   - Store form data in step data via `updateStepData`
   - Validate data before moving to the next step
   - Use `getAllData()` to combine all step data when completing

3. **Navigation**:
   - Create helper functions for complex navigation logic
   - Use `goToStep` for non-linear navigation
   - Handle edge cases like skipping steps based on conditions

4. **Error Handling**:
   - Add validation before navigation
   - Store error states in step data
   - Reset errors when steps are revisited

## License

MIT