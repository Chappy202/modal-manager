# Modal Manager

A flexible, state management library for multi-step dialogs and modals in React applications. Works with any UI library including ShadCN, Material UI, or your custom modal components.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Using with UI Libraries](#using-with-ui-libraries)
  - [ShadCN UI](#shadcn-ui)
  - [Mantine](#mantine)
- [Managing Modal State](#managing-modal-state)
- [API Reference](#api-reference)
  - [useModal Hook](#usemodal-hook)
  - [Components](#components)
- [Advanced Usage: Conditional Flows](#advanced-usage-conditional-flows)
- [Debugging Your Modals](#debugging-your-modals)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)
- [Development Setup](#development-setup)

## Features

- 📚 **Multi-step flows** - Navigate forward, backward, or to any specific step
- 🔄 **State persistence** - Maintain data between steps and collect it at the end
- 🧱 **UI-agnostic** - Works with any UI library including ShadCN, Material UI, Mantine, and more
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

## Quick Start

Here's a simple example of a multi-step form:

```tsx
import { useState } from 'react';
import { useModal, ModalStep, ModalFlow } from 'modal-manager';

function SimpleForm() {
  const [open, setOpen] = useState(false);
  
  // Initialize modal with callbacks
  const modal = useModal('simple-form', {
    onComplete: (data) => {
      console.log('Form submitted:', data);
      setOpen(false);
    },
    onCancel: () => setOpen(false)
  });

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Form</button>
      
      {open && (
        <ModalFlow id="simple-form" open={open} onOpenChange={setOpen}>
          <div className="modal-content">
            {/* Step 1: Name */}
            <ModalStep modalId="simple-form" stepId="name">
              <NameStep />
            </ModalStep>
            
            {/* Step 2: Email */}
            <ModalStep modalId="simple-form" stepId="email">
              <EmailStep />
            </ModalStep>
            
            {/* Step 3: Confirmation */}
            <ModalStep modalId="simple-form" stepId="confirm">
              <ConfirmStep />
            </ModalStep>
          </div>
        </ModalFlow>
      )}
    </>
  );
}

// Step components
function NameStep() {
  const modal = useModal('simple-form');
  const [name, setName] = useState(modal.data.name || '');
  
  return (
    <div>
      <h2>Enter Your Name</h2>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <button onClick={modal.cancel}>Cancel</button>
        <button 
          onClick={() => {
            modal.updateData({ name });
            modal.nextStep();
          }}
          disabled={!name}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Other step components follow the same pattern
```

This example demonstrates:
- Setting up a modal with the `useModal` hook
- Creating a multi-step flow with `ModalFlow` and `ModalStep`
- Managing state between steps
- Handling form completion and cancellation

## Using with UI Libraries

The modal manager is UI-agnostic and works with any UI library. Here are examples with popular UI frameworks:

### ShadCN UI

```tsx
import { useState } from 'react';
import { useModal, ModalStep, ModalFlow } from 'modal-manager';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

function ShadcnModalExample() {
  const [open, setOpen] = useState(false);
  
  const modal = useModal('shadcn-form', {
    onComplete: (data) => {
      console.log('Form submitted:', data);
      setOpen(false);
    },
    onCancel: () => setOpen(false)
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open ShadCN Modal</Button>
      
      <ModalFlow id="shadcn-form" open={open} onOpenChange={setOpen}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {modal.currentStepIndex === 0 ? "Personal Information" : 
                 modal.currentStepIndex === 1 ? "Contact Details" : 
                 "Confirmation"}
              </DialogTitle>
            </DialogHeader>
            
            <ModalStep modalId="shadcn-form" stepId="personal">
              <PersonalInfoStep />
            </ModalStep>
            
            <ModalStep modalId="shadcn-form" stepId="contact">
              <ContactDetailsStep />
            </ModalStep>
            
            <ModalStep modalId="shadcn-form" stepId="confirm">
              <ConfirmationStep />
            </ModalStep>
          </DialogContent>
        </Dialog>
      </ModalFlow>
    </>
  );
}

// Example step component
function PersonalInfoStep() {
  const modal = useModal('shadcn-form');
  const [name, setName] = useState(modal.data.name || '');
  
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          className="w-full p-2 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={modal.cancel}>
          Cancel
        </Button>
        <Button 
          onClick={() => {
            modal.updateData({ name });
            modal.nextStep();
          }}
          disabled={!name}
        >
          Continue
        </Button>
      </DialogFooter>
    </div>
  );
}
```

### Mantine

```tsx
import { useState } from 'react';
import { useModal, ModalStep, ModalFlow } from 'modal-manager';
import { Modal, Button, TextInput, Group, Stack } from '@mantine/core';

function MantineModalExample() {
  const [open, setOpen] = useState(false);
  
  const modal = useModal('mantine-form', {
    onComplete: (data) => {
      console.log('Form submitted:', data);
      setOpen(false);
    },
    onCancel: () => setOpen(false)
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Mantine Modal</Button>
      
      <ModalFlow id="mantine-form" open={open} onOpenChange={setOpen}>
        <Modal 
          opened={open} 
          onClose={() => setOpen(false)}
          title={modal.currentStepIndex === 0 ? "Step 1: Basic Info" : "Step 2: Review"}
        >
          <ModalStep modalId="mantine-form" stepId="info">
            <MantineInfoStep />
          </ModalStep>
          
          <ModalStep modalId="mantine-form" stepId="review">
            <MantineReviewStep />
          </ModalStep>
        </Modal>
      </ModalFlow>
    </>
  );
}
```

## Managing Modal State

Each step can access and update the modal's shared state:

```tsx
function EmailStep() {
  const modal = useModal('simple-form');
  const [email, setEmail] = useState(modal.data.email || '');
  
  const handleNext = () => {
    // Update the modal's data store
    modal.updateData({ email });
    modal.nextStep();
  };
  
  return (
    <div>
      <h2>Enter Your Email</h2>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <button onClick={modal.prevStep}>Back</button>
        <button 
          onClick={handleNext}
          disabled={!email || !email.includes('@')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

**Key Points:**
- Each step can read from `modal.data`
- Use `updateData()` to merge new data with existing data
- Data persists between steps
- All data is passed to `onComplete` when the flow finishes

## API Reference

### useModal Hook

```tsx
const modal = useModal(modalId, options);
```

**Parameters:**
- `modalId`: Unique identifier for the modal
- `options`: Configuration object
  - `onComplete`: Callback when modal completes
  - `onCancel`: Callback when modal is cancelled
  - `initialData`: Initial data for the modal

**Returns:**
- `data`: Current modal data
- `updateData(newData)`: Merge new data with existing data
- `nextStep()`: Move to the next step
- `prevStep()`: Move to the previous step
- `goToStep(stepId)`: Navigate to a specific step
- `complete()`: Complete the modal flow
- `cancel()`: Cancel the modal flow
- `currentStepId`: ID of the current step
- `isFirstStep`: Whether current step is first
- `isLastStep`: Whether current step is last

### Components

#### ModalFlow

```tsx
<ModalFlow id="modal-id" open={open} onOpenChange={setOpen}>
  {/* Modal content and steps */}
</ModalFlow>
```

#### ModalStep

```tsx
<ModalStep modalId="modal-id" stepId="step-id">
  <StepContent />
</ModalStep>
```

#### ConditionalStep

```tsx
<ConditionalStep 
  modalId="modal-id" 
  stepId="step-id"
  condition={(data) => data.someValue === true}
>
  <StepContent />
</ConditionalStep>
```

#### ModalDebugger

```tsx
<ModalDebugger position="bottom-right" initiallyOpen={false} />
```

## Advanced Usage: Conditional Flows

Use the `ConditionalStep` component to create dynamic flows based on user choices:

```tsx
import { useModal, ModalStep, ConditionalStep, ModalFlow } from 'modal-manager';

function SignupWizard() {
  const [open, setOpen] = useState(false);
  const modal = useModal('signup', {
    onComplete: (data) => {
      console.log('Signup completed:', data);
      setOpen(false);
    },
    onCancel: () => setOpen(false)
  });

  return (
    <>
      <button onClick={() => setOpen(true)}>Sign Up</button>
      
      {open && (
        <ModalFlow id="signup" open={open} onOpenChange={setOpen}>
          <div className="modal-content">
            {/* Basic information step */}
            <ModalStep modalId="signup" stepId="basic-info">
              <BasicInfoStep />
            </ModalStep>
            
            {/* Account type selection */}
            <ModalStep modalId="signup" stepId="account-type">
              <AccountTypeStep />
            </ModalStep>
            
            {/* Business details (only shown for business accounts) */}
            <ConditionalStep 
              modalId="signup" 
              stepId="business-details"
              condition={(data) => data.accountType === 'business'}
            >
              <BusinessDetailsStep />
            </ConditionalStep>
            
            {/* Confirmation step */}
            <ModalStep modalId="signup" stepId="confirmation">
              <ConfirmationStep />
            </ModalStep>
          </div>
        </ModalFlow>
      )}
    </>
  );
}
```

This example demonstrates:
- Using `ConditionalStep` to show steps only when certain conditions are met
- Creating a dynamic flow based on user choices
- Maintaining a clean, declarative structure

## Debugging Your Modals

The library includes a `ModalDebugger` component to help you troubleshoot your modal flows:

```tsx
import { ModalDebugger } from 'modal-manager';

function App() {
  return (
    <>
      {/* Your application components */}
      
      {/* Add this in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <ModalDebugger />
      )}
    </>
  );
}
```

The debugger provides:
- Current state of all modals
- Step navigation history
- Data stored in each modal
- Active step information

This tool is automatically hidden in production builds.

## Best Practices

### 1. Modal Organization

Keep your modal components organized:
- Create separate files for each modal step
- Group related steps in a folder
- Use descriptive IDs for modals and steps

### 2. Data Management

Be intentional with modal data:
- Only store what you need in the modal state
- Use `updateData` to merge changes (not replace all data)
- Consider using TypeScript for type safety

### 3. Conditional Steps

Use `ConditionalStep` for dynamic flows:
```tsx
<ConditionalStep condition={(data) => data.accountType === 'business'}>
  <BusinessDetailsStep />
</ConditionalStep>
```

### 4. Error Handling

Implement proper error handling:
- Validate data before proceeding to next steps
- Provide clear error messages to users
- Use try/catch blocks for async operations

### 5. Performance

For large forms:
- Split complex steps into smaller ones
- Avoid storing large objects in modal state
- Consider lazy-loading step components

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
