# Stepped Modal

A lightweight, framework-agnostic library for managing stepped modals in React applications.

## Features

- 🔄 Multi-step flows within a single modal
- 🔀 Conditional steps based on user input
- 🚪 Easy navigation between steps
- 🎯 Jump to specific steps
- 🧩 Framework-agnostic (works with any UI library)
- 🔍 Built-in debugger for development
- 📦 Small bundle size
- 📝 TypeScript support

## Installation

```bash
npm install modal-manager
# or
yarn add modal-manager
# or
pnpm add modal-manager
```

## Basic Usage

```tsx
import { useModal, ModalContent, Step, StepRenderer } from 'modal-manager';
import { Dialog } from 'your-ui-library';

function MyModal() {
  const { isOpen, open, close } = useModal({
    id: 'my-modal',
    steps: [
      { id: 'step1' },
      { id: 'step2' },
      { id: 'step3' },
    ]
  });

  return (
    <>
      <button onClick={open}>Open Modal</button>
      
      <Dialog open={isOpen} onClose={close}>
        <ModalContent id="my-modal">
          {({ currentStep, next, prev, isFirst, isLast }) => (
            <>
              <StepRenderer currentStep={currentStep}>
                <Step id="step1">
                  <h2>Step 1</h2>
                  <p>This is the first step</p>
                </Step>
                
                <Step id="step2">
                  <h2>Step 2</h2>
                  <p>This is the second step</p>
                </Step>
                
                <Step id="step3">
                  <h2>Step 3</h2>
                  <p>This is the final step</p>
                </Step>
              </StepRenderer>
              
              <div className="buttons">
                {!isFirst && <button onClick={prev}>Back</button>}
                {!isLast ? (
                  <button onClick={next}>Next</button>
                ) : (
                  <button onClick={close}>Finish</button>
                )}
              </div>
            </>
          )}
        </ModalContent>
      </Dialog>
    </>
  );
}
```

## Advanced Usage

### Conditional Steps

```tsx
import { useModal, ModalContent, Step, StepRenderer } from 'modal-manager';
import { Dialog } from 'your-ui-library';

function PaymentModal() {
  const { isOpen, open, close, goTo, setData, data } = useModal({
    id: 'payment-modal',
    steps: [
      { id: 'method' },
      { id: 'card-details' },
      { id: 'bank-details' },
      { id: 'confirm' },
    ]
  });

  const handlePaymentMethodSelect = (method) => {
    setData({ paymentMethod: method });
    
    // Go to the appropriate step based on payment method
    if (method === 'card') {
      goTo('card-details');
    } else if (method === 'bank') {
      goTo('bank-details');
    }
  };

  return (
    <>
      <button onClick={open}>Make Payment</button>
      
      <Dialog open={isOpen} onClose={close}>
        <ModalContent id="payment-modal">
          {({ currentStep, next, prev, close }) => (
            <>
              <StepRenderer currentStep={currentStep}>
                <Step id="method">
                  <h2>Select Payment Method</h2>
                  <button onClick={() => handlePaymentMethodSelect('card')}>Credit Card</button>
                  <button onClick={() => handlePaymentMethodSelect('bank')}>Bank Transfer</button>
                </Step>
                
                <Step id="card-details">
                  <h2>Enter Card Details</h2>
                  {/* Card form */}
                  <button onClick={() => next()}>Continue</button>
                </Step>
                
                <Step id="bank-details">
                  <h2>Enter Bank Details</h2>
                  {/* Bank form */}
                  <button onClick={() => next()}>Continue</button>
                </Step>
                
                <Step id="confirm">
                  <h2>Confirm Payment</h2>
                  <p>Payment Method: {data.paymentMethod}</p>
                  <button onClick={prev}>Back</button>
                  <button onClick={close}>Confirm</button>
                </Step>
              </StepRenderer>
            </>
          )}
        </ModalContent>
      </Dialog>
    </>
  );
}
```

### Using with Different UI Libraries

#### Material UI

```tsx
import { useModal, ModalContent } from 'modal-manager';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function MaterialUIModal() {
  const { isOpen, open, close } = useModal({
    id: 'mui-modal',
    steps: [{ id: 'step1' }, { id: 'step2' }]
  });

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      
      <Dialog open={isOpen} onClose={close}>
        <ModalContent id="mui-modal">
          {({ currentStep, next, prev, isFirst, isLast }) => (
            <>
              <DialogTitle>
                {currentStep === 'step1' ? 'Step 1' : 'Step 2'}
              </DialogTitle>
              
              <DialogContent>
                {currentStep === 'step1' ? (
                  <p>Content for step 1</p>
                ) : (
                  <p>Content for step 2</p>
                )}
              </DialogContent>
              
              <DialogActions>
                {!isFirst && <Button onClick={prev}>Back</Button>}
                {!isLast ? (
                  <Button onClick={next}>Next</Button>
                ) : (
                  <Button onClick={close}>Finish</Button>
                )}
              </DialogActions>
            </>
          )}
        </ModalContent>
      </Dialog>
    </>
  );
}
```

#### Shadcn/UI

```tsx
import { useModal, ModalContent } from 'modal-manager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button
} from '@/components/ui';

function ShadcnModal() {
  const { isOpen, open, close } = useModal({
    id: 'shadcn-modal',
    steps: [{ id: 'step1' }, { id: 'step2' }]
  });

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      
      <Dialog open={isOpen} onOpenChange={open => !open && close()}>
        <DialogContent>
          <ModalContent id="shadcn-modal">
            {({ currentStep, next, prev, isFirst, isLast }) => (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {currentStep === 'step1' ? 'Step 1' : 'Step 2'}
                  </DialogTitle>
                </DialogHeader>
                
                {currentStep === 'step1' ? (
                  <p>Content for step 1</p>
                ) : (
                  <p>Content for step 2</p>
                )}
                
                <DialogFooter>
                  {!isFirst && <Button variant="outline" onClick={prev}>Back</Button>}
                  {!isLast ? (
                    <Button onClick={next}>Next</Button>
                  ) : (
                    <Button onClick={close}>Finish</Button>
                  )}
                </DialogFooter>
              </>
            )}
          </ModalContent>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Debugging

The library includes a built-in debugger component that helps visualize the state of your modals during development:

```tsx
import { ModalDebugger } from 'modal-manager';

function App() {
  return (
    <>
      {/* Your app components */}
      
      {process.env.NODE_ENV === 'development' && (
        <ModalDebugger position="bottom-right" />
      )}
    </>
  );
}
```

## Development

To run the examples locally:

```bash
# Clone the repository
git clone https://github.com/Chappy202/modal-manager.git
cd modal-manager

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## API Reference

### useModal

```tsx
const {
  // Actions
  open,        // (data?) => void - Opens the modal with optional initial data
  close,       // () => void - Closes the modal
  next,        // (data?) => void - Goes to the next step with optional data
  prev,        // () => void - Goes to the previous step
  goTo,        // (stepId, data?) => void - Goes to a specific step with optional data
  setData,     // (data) => void - Updates the modal data
  
  // State
  isOpen,      // boolean - Whether the modal is open
  currentStep, // string | null - ID of the current step
  data,        // Record<string, unknown> - Current modal data
  isFirst,     // boolean - Whether the current step is the first step
  isLast,      // boolean - Whether the current step is the last step
} = useModal({
  id,           // string - Unique identifier for the modal
  initialData,  // object - Initial data for the modal (optional)
  steps,        // array - Array of step objects (optional)
});
```

### ModalContent

```tsx
<ModalContent id="modal-id">
  {({
    currentStep,  // string | null - ID of the current step
    data,         // Record<string, unknown> - Current modal data
    next,         // (data?) => void - Goes to the next step with optional data
    prev,         // () => void - Goes to the previous step
    close,        // () => void - Closes the modal
    goTo,         // (stepId, data?) => void - Goes to a specific step with optional data
    setData,      // (data) => void - Updates the modal data
    isFirst,      // boolean - Whether the current step is the first step
    isLast,       // boolean - Whether the current step is the last step
  }) => (
    // Your modal content
  )}
</ModalContent>
```

### StepRenderer and Step

```tsx
<StepRenderer currentStep={currentStep}>
  <Step id="step1">
    {/* Content for step 1 */}
  </Step>
  <Step id="step2">
    {/* Content for step 2 */}
  </Step>
</StepRenderer>
```

### ModalDebugger

```tsx
<ModalDebugger 
  position="bottom-right" // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  initiallyOpen={false}   // Whether the debugger is initially open
/>
```

## License

MIT
