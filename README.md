# Modal Manager

A flexible, state management library for multi-step dialogs and modals in React applications. Works with any UI library including ShadCN, Material UI, or your custom modal components.

## Features

- 📚 **Multi-step flows** - Navigate forward, backward, or to any specific step
- 🔄 **State persistence** - Maintain data between steps and collect it at the end
- 🧱 **UI-agnostic** - Works with any modal or dialog component
- 🔀 **Conditional flows** - Create dynamic paths based on user choices
- 📦 **Stack-based modals** - Support for nested/stacked modals
- 🔍 **Developer tools** - Built-in debugger for development

## Installation

```bash
# npm
npm install modal-manager

# yarn
yarn add modal-manager

# pnpm
pnpm add modal-manager
```

## Basic Usage

Here's a simple example using ShadCN UI components:

```tsx
import { useModal, ModalStep, ModalFlow } from 'modal-manager';
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
            onComplete: data => console.log('Completed with data:', data),
            initialData: { defaultValue: 'example' },
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
        onChange={e => modal.updateStepData('step-1', { value: e.target.value })}
      />
      <div>
        <button onClick={() => modal.close()}>Cancel</button>
        <button onClick={() => modal.nextStep()}>Next</button>
      </div>
    </>
  );
}
```

## API Reference

### useModal(modalId, options?)

A React hook that provides an easy interface to the modal state:

```tsx
const modal = useModal('my-modal', {
  onComplete: data => console.log('All data:', data),
  onCancel: () => console.log('Modal cancelled'),
  initialData: { foo: 'bar' },
});
```

#### State Properties

- `isOpen` - Whether the modal is open
- `currentStep` - The current step object
- `currentStepIndex` - The index of the current step
- `totalSteps` - The total number of steps
- `isFirstStep` - Whether the current step is the first
- `isLastStep` - Whether the current step is the last

#### Actions

- `addStep(stepId, data?)` - Register a step
- `goToStep(stepId, data?)` - Navigate to a step
- `nextStep(data?)` - Navigate to the next step
- `prevStep()` - Navigate to the previous step
- `close()` - Close the modal (triggers onCancel)
- `complete()` - Complete the modal flow (triggers onComplete)

#### Data Management

- `updateStepData(stepId, data)` - Update data for a step
- `getStepData(stepId)` - Get data for a step
- `getAllData()` - Get combined data from all steps

### Components

#### ModalFlow

Connects your UI dialog/modal to the state manager:

```tsx
<ModalFlow
  id="my-flow"
  open={open}
  onOpenChange={setOpen}
  options={{
    onComplete: data => console.log('Completed with data:', data),
    onCancel: () => console.log('Modal cancelled'),
    initialData: { defaultValue: 'example' },
  }}
>
  {/* Your modal content */}
</ModalFlow>
```

#### ModalStep

Renders the content for a specific step:

```tsx
<ModalStep modalId="my-flow" stepId="step-1">
  <h2>Step 1 Content</h2>
</ModalStep>
```

You can also use a render function to access step data:

```tsx
<ModalStep modalId="my-flow" stepId="step-1">
  {data => (
    <div>
      <h2>Step 1 Content</h2>
      <p>Current value: {data.value}</p>
    </div>
  )}
</ModalStep>
```

#### ModalDebugger

A debugging component that displays the current state of modals:

```tsx
// Add this in your development environment
<ModalDebugger position="bottom-right" initiallyOpen={false} />
```

## Advanced Usage: Conditional Flows

Create flows that branch based on user input:

```tsx
function PaymentStep() {
  const modal = useModal('checkout-flow');

  const handlePaymentSelection = method => {
    modal.updateStepData('payment-method', { method });

    // Navigate to different next steps based on payment method
    if (method === 'credit-card') {
      modal.goToStep('credit-card-details');
    } else if (method === 'paypal') {
      modal.goToStep('paypal-details');
    } else {
      modal.goToStep('confirmation');
    }
  };

  return (
    <div>
      <h2>Select Payment Method</h2>
      <div>
        <button onClick={() => handlePaymentSelection('credit-card')}>Credit Card</button>
        <button onClick={() => handlePaymentSelection('paypal')}>PayPal</button>
        <button onClick={() => handlePaymentSelection('bank-transfer')}>Bank Transfer</button>
      </div>
    </div>
  );
}
```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Development Setup

### VSCode Configuration

This project includes VSCode settings that enable automatic linting and formatting. To take advantage of these features:

1. Install the recommended extensions when prompted by VSCode, or manually install:

   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)
   - EditorConfig (`editorconfig.editorconfig`)
   - TypeScript Next (`ms-vscode.vscode-typescript-next`)

2. The project is configured to:
   - Format code with Prettier on save
   - Fix ESLint issues on save
   - Use consistent formatting rules across the project

### Linting and Formatting

The project uses:

- ESLint for code quality and best practices
- Prettier for code formatting
- EditorConfig for basic editor settings

To manually run linting and formatting:

```bash
# Run ESLint
pnpm run lint

# Format code with Prettier
pnpm run format
```
