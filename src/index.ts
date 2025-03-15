/**
 * Modal Manager
 * A flexible state management library for multi-step dialogs and modals in React applications
 */

// Core exports
export { default as useModalStore } from './core/store';

// Hook exports
export { useModal, ModalStep, ModalFlow, ConditionalStep } from './hooks/useModal';

// Component exports
export { ModalDebugger } from './components/ModalDebugger';

// Type exports
export type {
  ModalStep as ModalStepType,
  ModalState,
  ModalOptions,
  ModalFlowProps,
  ModalStepProps,
  ModalDebuggerProps,
  ConditionalStepProps,
} from './types';
