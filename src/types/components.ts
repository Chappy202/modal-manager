import React from 'react';
import type { UseModalReturn } from './hooks';

/**
 * Props for the ModalContent component
 */
export type ModalContentProps = {
  /**
   * Unique identifier for the modal
   */
  id: string;

  /**
   * Children can be either React nodes or a render function
   */
  children:
    | React.ReactNode
    | ((props: Omit<UseModalReturn, 'open' | 'addStep'>) => React.ReactNode);
};

/**
 * Props for the Step component
 */
export type StepProps = {
  /**
   * Unique identifier for the step
   */
  id: string;

  /**
   * Content of the step
   */
  children: React.ReactNode;
};

/**
 * Props for the StepRenderer component
 */
export type StepRendererProps = {
  /**
   * ID of the current step
   */
  currentStep: string | null;

  /**
   * Step components to render
   */
  children: React.ReactElement<StepProps> | React.ReactElement<StepProps>[];
};

/**
 * Props for the ModalDebugger component
 */
export type ModalDebuggerProps = {
  /**
   * Position of the debugger on the screen
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * Whether the debugger is initially open
   */
  initiallyOpen?: boolean;
};
