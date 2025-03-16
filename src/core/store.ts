import { create } from 'zustand';
import type { ModalStep, ModalState, ModalStore } from '../types/store';

export { type ModalStep, type ModalState } from '../types/store';

// Create the store
const useModalStore = create<ModalStore>((set, get) => ({
  // State
  modals: {},

  // Actions
  openModal: (id, initialData = {}) => {
    set(state => ({
      modals: {
        ...state.modals,
        [id]: state.modals[id] || {
          steps: [],
          currentStepIndex: 0,
          data: { ...initialData },
          navigationHistory: [],
        },
      },
    }));
  },

  closeModal: id => {
    set(state => {
      const { [id]: _, ...rest } = state.modals;
      return { modals: rest };
    });
  },

  addStep: (modalId, stepId, data = {}, previousStep) => {
    set(state => {
      const modal = state.modals[modalId];
      if (!modal) return state;

      // Check if step already exists
      const existingStepIndex = modal.steps.findIndex(s => s.id === stepId);

      if (existingStepIndex !== -1) {
        // Update existing step if previousStep is provided
        if (previousStep) {
          const updatedSteps = [...modal.steps];
          updatedSteps[existingStepIndex] = {
            ...updatedSteps[existingStepIndex],
            previousStep,
          };

          return {
            modals: {
              ...state.modals,
              [modalId]: {
                ...modal,
                steps: updatedSteps,
              },
            },
          };
        }
        return state;
      }

      // Add new step
      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            steps: [...modal.steps, { id: stepId, data, previousStep }],
          },
        },
      };
    });
  },

  nextStep: (modalId, data = {}) => {
    set(state => {
      const modal = state.modals[modalId];
      if (!modal) return state;

      const nextIndex = modal.currentStepIndex + 1;
      if (nextIndex >= modal.steps.length) return state;

      // Get current step ID for history
      const currentStepId = modal.steps[modal.currentStepIndex]?.id;
      if (!currentStepId) return state;

      // Add current step to history before moving to next
      const updatedHistory = [...modal.navigationHistory, currentStepId];

      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            currentStepIndex: nextIndex,
            data: { ...modal.data, ...data },
            navigationHistory: updatedHistory,
          },
        },
      };
    });
  },

  prevStep: modalId => {
    set(state => {
      const modal = state.modals[modalId];
      if (!modal) return state;

      // Get current step
      const currentStep = modal.steps[modal.currentStepIndex];
      if (!currentStep) return state;

      // Check if current step has a specified previous step
      if (currentStep.previousStep) {
        // Find the index of the specified previous step
        const prevStepIndex = modal.steps.findIndex(step => step.id === currentStep.previousStep);
        if (prevStepIndex !== -1) {
          // Remove the current step from history
          const updatedHistory = [...modal.navigationHistory];
          updatedHistory.pop();

          return {
            modals: {
              ...state.modals,
              [modalId]: {
                ...modal,
                currentStepIndex: prevStepIndex,
                navigationHistory: updatedHistory,
              },
            },
          };
        }
      }

      // If no specific previous step or not found, use navigation history
      if (modal.navigationHistory.length > 0) {
        // Get the last step from history
        const prevStepId = modal.navigationHistory[modal.navigationHistory.length - 1];
        const prevStepIndex = modal.steps.findIndex(step => step.id === prevStepId);

        if (prevStepIndex !== -1) {
          // Remove the last step from history
          const updatedHistory = [...modal.navigationHistory];
          updatedHistory.pop();

          return {
            modals: {
              ...state.modals,
              [modalId]: {
                ...modal,
                currentStepIndex: prevStepIndex,
                navigationHistory: updatedHistory,
              },
            },
          };
        }
      }

      // Fallback to simple decrement if no history or specific previous step
      const prevIndex = modal.currentStepIndex - 1;
      if (prevIndex < 0) return state;

      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            currentStepIndex: prevIndex,
            navigationHistory: modal.navigationHistory.slice(0, -1),
          },
        },
      };
    });
  },

  goToStep: (modalId, stepId, data = {}, addToHistory = true) => {
    set(state => {
      const modal = state.modals[modalId];
      if (!modal) return state;

      const stepIndex = modal.steps.findIndex(step => step.id === stepId);
      if (stepIndex === -1) return state;

      // Get current step ID for history
      const currentStepId = modal.steps[modal.currentStepIndex]?.id;

      // Update navigation history if needed
      let updatedHistory = [...modal.navigationHistory];
      if (addToHistory && currentStepId) {
        updatedHistory = [...updatedHistory, currentStepId];
      }

      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            currentStepIndex: stepIndex,
            data: { ...modal.data, ...data },
            navigationHistory: updatedHistory,
          },
        },
      };
    });
  },

  updateData: (modalId, data) => {
    set(state => {
      const modal = state.modals[modalId];
      if (!modal) return state;

      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            data: { ...modal.data, ...data },
          },
        },
      };
    });
  },

  // Getters
  getModalData: modalId => {
    const modal = get().modals[modalId];
    return modal?.data || {};
  },

  getCurrentStep: modalId => {
    const modal = get().modals[modalId];
    if (!modal || modal.steps.length === 0) return null;

    const step = modal.steps[modal.currentStepIndex];
    return step?.id || null;
  },

  getCurrentStepIndex: modalId => {
    return get().modals[modalId]?.currentStepIndex || 0;
  },

  getTotalSteps: modalId => {
    return get().modals[modalId]?.steps.length || 0;
  },

  isFirstStep: modalId => {
    const modal = get().modals[modalId];
    if (!modal) return true;

    // Check if we have navigation history
    return modal.navigationHistory.length === 0;
  },

  isLastStep: modalId => {
    const modal = get().modals[modalId];
    if (!modal) return false;

    return modal.currentStepIndex === modal.steps.length - 1;
  },

  isModalOpen: modalId => {
    const isOpen = !!get().modals[modalId];
    return isOpen;
  },
}));

export default useModalStore;
