/**
 * Core types for the modal manager library
 */

import React from 'react';

/**
 * Represents a single step in a modal flow
 */
export interface ModalStep {
  /** Unique identifier for the step */
  id: string;
  /** Data associated with this step */
  data?: Record<string, any>;
}

/**
 * Represents a modal in the modal stack
 */
export interface ModalState {
  /** Array of steps in this modal */
  steps: ModalStep[];
  /** Index of the current active step */
  currentStepIndex: number;
  /** Initial data provided when the modal was registered */
  initialData?: Record<string, any>;
}

/**
 * Options for modal initialization
 */
export interface ModalOptions {
  /** Callback fired when the modal flow is completed */
  onComplete?: (data: Record<string, any>) => void;
  /** Callback fired when the modal is cancelled */
  onCancel?: () => void;
  /** Initial data to populate the modal with */
  initialData?: Record<string, any>;
}

/**
 * Props for the ModalFlow component
 */
export interface ModalFlowProps {
  /** Unique identifier for the modal */
  id: string;
  /** Whether the modal is currently open */
  open: boolean;
  /** Callback to change the open state */
  onOpenChange: (open: boolean) => void;
  /** Modal content */
  children: React.ReactNode;
  /** Modal options */
  options?: ModalOptions;
}

/**
 * Props for the ModalStep component
 */
export interface ModalStepProps {
  /** ID of the parent modal */
  modalId: string;
  /** Unique identifier for this step */
  stepId: string;
  /** Step content */
  children: React.ReactNode;
}

/**
 * Props for the ModalDebugger component
 */
export interface ModalDebuggerProps {
  /** Position of the debugger on the screen */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Whether the debugger is initially open */
  initiallyOpen?: boolean;
}
