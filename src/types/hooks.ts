import type { ModalStep } from './store';

/**
 * Options for the useModal hook
 */
export type UseModalOptions = {
  /**
   * Unique identifier for the modal
   */
  id: string;

  /**
   * Initial data for the modal
   */
  initialData?: Record<string, unknown>;

  /**
   * Initial steps for the modal
   */
  steps?: ModalStep[];
};

/**
 * Return type for the useModal hook
 */
export type UseModalReturn = {
  // Actions
  /**
   * Opens the modal with optional initial data
   */
  open: (data?: Record<string, unknown>) => void;

  /**
   * Closes the modal
   */
  close: () => void;

  /**
   * Navigates to the next step with optional data
   */
  next: (data?: Record<string, unknown>) => void;

  /**
   * Navigates to the previous step
   */
  prev: () => void;

  /**
   * Navigates to a specific step with optional data
   */
  goTo: (stepId: string, data?: Record<string, unknown>) => void;

  /**
   * Updates the modal data
   */
  setData: (data: Record<string, unknown>) => void;

  /**
   * Adds or updates a step in the modal
   */
  addStep: (
    modalId: string,
    stepId: string,
    data?: Record<string, unknown>,
    previousStep?: string,
  ) => void;

  // State
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * ID of the current step
   */
  currentStep: string | null;

  /**
   * Index of the current step
   */
  currentStepIndex: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Whether the current step is the first step
   */
  isFirst: boolean;

  /**
   * Whether the current step is the last step
   */
  isLast: boolean;

  /**
   * Current modal data
   */
  data: Record<string, unknown>;
};
