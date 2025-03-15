import { create } from 'zustand';

// Simple types for our store
type ModalStep = {
  id: string;
  data: Record<string, any>;
};

type ModalState = {
  steps: ModalStep[];
  currentStepIndex: number;
  data: Record<string, any>;
};

// Simple store interface
interface ModalStore {
  // State
  modals: Record<string, ModalState>;

  // Actions
  openModal: (id: string, initialData?: Record<string, any>) => void;
  closeModal: (id: string) => void;
  addStep: (modalId: string, stepId: string, data?: Record<string, any>) => void;
  nextStep: (modalId: string, data?: Record<string, any>) => void;
  prevStep: (modalId: string) => void;
  updateData: (modalId: string, data: Record<string, any>) => void;

  // Getters
  getModalData: (modalId: string) => Record<string, any>;
  getCurrentStep: (modalId: string) => string | null;
  getCurrentStepIndex: (modalId: string) => number;
  getTotalSteps: (modalId: string) => number;
  isFirstStep: (modalId: string) => boolean;
  isLastStep: (modalId: string) => boolean;
  isModalOpen: (modalId: string) => boolean;
}

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

  addStep: (modalId, stepId, data = {}) => {
    set(state => {
      const modal = state.modals[modalId];
      if (!modal) return state;

      // Check if step already exists
      const stepExists = modal.steps.some(s => s.id === stepId);
      if (stepExists) return state;

      // Add new step
      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            steps: [...modal.steps, { id: stepId, data }],
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

      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            currentStepIndex: nextIndex,
            data: { ...modal.data, ...data },
          },
        },
      };
    });
  },

  prevStep: modalId => {
    set(state => {
      const modal = state.modals[modalId];
      if (!modal) return state;

      const prevIndex = modal.currentStepIndex - 1;
      if (prevIndex < 0) return state;

      return {
        modals: {
          ...state.modals,
          [modalId]: {
            ...modal,
            currentStepIndex: prevIndex,
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
    return get().getCurrentStepIndex(modalId) === 0;
  },

  isLastStep: modalId => {
    const modal = get().modals[modalId];
    if (!modal) return false;

    return modal.currentStepIndex === modal.steps.length - 1;
  },

  isModalOpen: modalId => {
    return !!get().modals[modalId];
  },
}));

export default useModalStore;
