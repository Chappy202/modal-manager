/**
 * Represents a single step in a modal flow
 */
export type ModalStep = {
  /**
   * Unique identifier for the step
   */
  id: string;

  /**
   * Optional data associated with this step
   */
  data?: Record<string, unknown>;

  /**
   * Optional field to specify which step to go back to
   */
  previousStep?: string;
};

/**
 * Represents the state of a single modal
 */
export type ModalState = {
  /**
   * Array of steps in this modal
   */
  steps: ModalStep[];

  /**
   * Index of the current step
   */
  currentStepIndex: number;

  /**
   * Data shared across all steps in this modal
   */
  data: Record<string, unknown>;

  /**
   * History of navigation between steps
   */
  navigationHistory: string[];
};

/**
 * Store interface for modal management
 */
export interface ModalStore {
  // State
  /**
   * Record of all active modals
   */
  modals: Record<string, ModalState>;

  // Actions
  /**
   * Opens a modal with the given ID and optional initial data
   */
  openModal: (id: string, initialData?: Record<string, unknown>) => void;

  /**
   * Closes the modal with the given ID
   */
  closeModal: (id: string) => void;

  /**
   * Adds or updates a step in the specified modal
   */
  addStep: (
    modalId: string,
    stepId: string,
    data?: Record<string, unknown>,
    previousStep?: string,
  ) => void;

  /**
   * Navigates to the next step in the specified modal
   */
  nextStep: (modalId: string, data?: Record<string, unknown>) => void;

  /**
   * Navigates to the previous step in the specified modal
   */
  prevStep: (modalId: string) => void;

  /**
   * Navigates to a specific step in the specified modal
   */
  goToStep: (
    modalId: string,
    stepId: string,
    data?: Record<string, unknown>,
    addToHistory?: boolean,
  ) => void;

  /**
   * Updates the data for the specified modal
   */
  updateData: (modalId: string, data: Record<string, unknown>) => void;

  // Getters
  /**
   * Gets the data for the specified modal
   */
  getModalData: (modalId: string) => Record<string, unknown>;

  /**
   * Gets the ID of the current step for the specified modal
   */
  getCurrentStep: (modalId: string) => string | null;

  /**
   * Gets the index of the current step for the specified modal
   */
  getCurrentStepIndex: (modalId: string) => number;

  /**
   * Gets the total number of steps for the specified modal
   */
  getTotalSteps: (modalId: string) => number;

  /**
   * Checks if the current step is the first step for the specified modal
   */
  isFirstStep: (modalId: string) => boolean;

  /**
   * Checks if the current step is the last step for the specified modal
   */
  isLastStep: (modalId: string) => boolean;

  /**
   * Checks if the specified modal is open
   */
  isModalOpen: (modalId: string) => boolean;
}
