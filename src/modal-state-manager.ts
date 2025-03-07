// modal-state-manager.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export type ModalStep = {
  id: string;
  data?: any;
};

export type ModalStackItem = {
  modalId: string;
  steps: ModalStep[];
  currentStepIndex: number;
  initialData?: any;
};

// State interface
export interface ModalState {
  // Modal stack allows for nested modals
  modalStack: ModalStackItem[];
  
  // State management
  registerModal: (modalId: string, initialData?: any) => void;
  closeModal: (modalId?: string) => void;
  closeAllModals: () => void;
  
  // Step management
  addStep: (modalId: string, stepId: string, stepData?: any) => void;
  goToStep: (modalId: string, stepId: string, stepData?: any) => void;
  goToStepByIndex: (modalId: string, index: number, stepData?: any) => void;
  nextStep: (modalId: string, stepData?: any) => void;
  prevStep: (modalId: string) => void;
  
  // Data management
  updateStepData: (modalId: string, stepId: string, data: any) => void;
  getStepData: (modalId: string, stepId: string) => any;
  getAllData: (modalId: string) => Record<string, any>;
  
  // Utility functions
  isModalOpen: (modalId: string) => boolean;
  getCurrentStep: (modalId: string) => ModalStep | null;
  getCurrentStepIndex: (modalId: string) => number;
  getTotalSteps: (modalId: string) => number;
  isFirstStep: (modalId: string) => boolean;
  isLastStep: (modalId: string) => boolean;
}

const useModalStore = create<ModalState>()(
  devtools(
    (set, get) => ({
      modalStack: [],
      
      // State management
      registerModal: (modalId, initialData = {}) => {
        set((state) => {
          // Check if modal already exists
          const modalExists = state.modalStack.some(m => m.modalId === modalId);
          
          if (modalExists) {
            // If it exists, bring it to the top of the stack
            const newStack = state.modalStack.filter(m => m.modalId !== modalId);
            const existingModal = state.modalStack.find(m => m.modalId === modalId)!;
            
            return {
              modalStack: [
                ...newStack,
                {
                  ...existingModal,
                  initialData: { ...existingModal.initialData, ...initialData }
                }
              ]
            };
          }
          
          // Otherwise create a new modal
          return {
            modalStack: [
              ...state.modalStack,
              {
                modalId,
                steps: [],
                currentStepIndex: -1,
                initialData
              }
            ]
          };
        });
      },
      
      closeModal: (modalId) => {
        set((state) => {
          if (!modalId) {
            // Close the top modal if no modalId provided
            if (state.modalStack.length === 0) return state;
            return {
              modalStack: state.modalStack.slice(0, -1)
            };
          }
          
          return {
            modalStack: state.modalStack.filter(m => m.modalId !== modalId)
          };
        });
      },
      
      closeAllModals: () => {
        set({ modalStack: [] });
      },
      
      // Step management
      addStep: (modalId, stepId, stepData = {}) => {
        set((state) => {
          const modalIndex = state.modalStack.findIndex(m => m.modalId === modalId);
          if (modalIndex === -1) return state;
          
          const modal = state.modalStack[modalIndex];
          const stepExists = modal.steps.some(s => s.id === stepId);
          
          if (stepExists) return state;
          
          const newSteps = [...modal.steps, { id: stepId, data: stepData }];
          const isFirstStep = newSteps.length === 1;
          
          const newStack = [...state.modalStack];
          newStack[modalIndex] = {
            ...modal,
            steps: newSteps,
            currentStepIndex: isFirstStep ? 0 : modal.currentStepIndex
          };
          
          return { modalStack: newStack };
        });
      },
      
      goToStep: (modalId, stepId, stepData) => {
        set((state) => {
          const modalIndex = state.modalStack.findIndex(m => m.modalId === modalId);
          if (modalIndex === -1) return state;
          
          const modal = state.modalStack[modalIndex];
          const stepIndex = modal.steps.findIndex(s => s.id === stepId);
          
          if (stepIndex === -1) return state;
          
          const newSteps = [...modal.steps];
          if (stepData) {
            newSteps[stepIndex] = { ...newSteps[stepIndex], data: { ...newSteps[stepIndex].data, ...stepData } };
          }
          
          const newStack = [...state.modalStack];
          newStack[modalIndex] = {
            ...modal,
            steps: newSteps,
            currentStepIndex: stepIndex
          };
          
          return { modalStack: newStack };
        });
      },
      
      goToStepByIndex: (modalId, index, stepData) => {
        set((state) => {
          const modalIndex = state.modalStack.findIndex(m => m.modalId === modalId);
          if (modalIndex === -1) return state;
          
          const modal = state.modalStack[modalIndex];
          
          if (index < 0 || index >= modal.steps.length) return state;
          
          const newSteps = [...modal.steps];
          if (stepData) {
            newSteps[index] = { ...newSteps[index], data: { ...newSteps[index].data, ...stepData } };
          }
          
          const newStack = [...state.modalStack];
          newStack[modalIndex] = {
            ...modal,
            steps: newSteps,
            currentStepIndex: index
          };
          
          return { modalStack: newStack };
        });
      },
      
      nextStep: (modalId, stepData) => {
        const modal = get().modalStack.find(m => m.modalId === modalId);
        if (!modal) return;
        
        const nextIndex = modal.currentStepIndex + 1;
        if (nextIndex >= modal.steps.length) return;
        
        get().goToStepByIndex(modalId, nextIndex, stepData);
      },
      
      prevStep: (modalId) => {
        const modal = get().modalStack.find(m => m.modalId === modalId);
        if (!modal) return;
        
        const prevIndex = modal.currentStepIndex - 1;
        if (prevIndex < 0) return;
        
        get().goToStepByIndex(modalId, prevIndex);
      },
      
      // Data management
      updateStepData: (modalId, stepId, data) => {
        set((state) => {
          const modalIndex = state.modalStack.findIndex(m => m.modalId === modalId);
          if (modalIndex === -1) return state;
          
          const modal = state.modalStack[modalIndex];
          const stepIndex = modal.steps.findIndex(s => s.id === stepId);
          
          if (stepIndex === -1) return state;
          
          const newSteps = [...modal.steps];
          newSteps[stepIndex] = {
            ...newSteps[stepIndex],
            data: { ...newSteps[stepIndex].data, ...data }
          };
          
          const newStack = [...state.modalStack];
          newStack[modalIndex] = {
            ...modal,
            steps: newSteps
          };
          
          return { modalStack: newStack };
        });
      },
      
      getStepData: (modalId, stepId) => {
        const modal = get().modalStack.find(m => m.modalId === modalId);
        if (!modal) return null;
        
        const step = modal.steps.find(s => s.id === stepId);
        return step?.data || null;
      },
      
      getAllData: (modalId) => {
        const modal = get().modalStack.find(m => m.modalId === modalId);
        if (!modal) return {};
        
        // Combine all step data into one object
        return modal.steps.reduce((acc, step) => {
          return { ...acc, ...(step.data || {}) };
        }, { ...modal.initialData });
      },
      
      // Utility functions
      isModalOpen: (modalId) => {
        return get().modalStack.some(m => m.modalId === modalId);
      },
      
      getCurrentStep: (modalId) => {
        const modal = get().modalStack.find(m => m.modalId === modalId);
        if (!modal || modal.currentStepIndex === -1) return null;
        
        return modal.steps[modal.currentStepIndex] || null;
      },
      
      getCurrentStepIndex: (modalId) => {
        const modal = get().modalStack.find(m => m.modalId === modalId);
        if (!modal) return -1;
        
        return modal.currentStepIndex;
      },
      
      getTotalSteps: (modalId) => {
        const modal = get().modalStack.find(m => m.modalId === modalId);
        if (!modal) return 0;
        
        return modal.steps.length;
      },
      
      isFirstStep: (modalId) => {
        const currentIndex = get().getCurrentStepIndex(modalId);
        return currentIndex === 0;
      },
      
      isLastStep: (modalId) => {
        const currentIndex = get().getCurrentStepIndex(modalId);
        const totalSteps = get().getTotalSteps(modalId);
        return currentIndex === totalSteps - 1;
      }
    }),
    { name: 'modal-store' }
  )
);

export default useModalStore;