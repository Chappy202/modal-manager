import { useCallback, useMemo } from 'react';
import useModalStore from '../core/store';
import type { ModalStep } from '../core/store';

export type UseModalOptions = {
  id: string;
  initialData?: Record<string, unknown>;
  steps?: ModalStep[];
};

export function useModal({ id, initialData = {}, steps = [] }: UseModalOptions) {
  const {
    openModal,
    closeModal,
    addStep,
    nextStep,
    prevStep,
    goToStep,
    updateData,
    getModalData,
    getCurrentStep,
    getCurrentStepIndex,
    getTotalSteps,
    isFirstStep,
    isLastStep,
    isModalOpen,
  } = useModalStore();

  // Initialize steps when the hook is first used
  const initializeSteps = useCallback(() => {
    steps.forEach(step => {
      addStep(id, step.id, step.data);
    });
  }, [id, steps, addStep]);

  // Open the modal and initialize steps
  const open = useCallback((data?: Record<string, unknown>) => {
    openModal(id, { ...initialData, ...data });
    initializeSteps();
  }, [id, initialData, openModal, initializeSteps]);

  // Close the modal
  const close = useCallback(() => {
    closeModal(id);
  }, [id, closeModal]);

  // Go to next step with optional data
  const next = useCallback((data?: Record<string, unknown>) => {
    nextStep(id, data);
  }, [id, nextStep]);

  // Go to previous step
  const prev = useCallback(() => {
    prevStep(id);
  }, [id, prevStep]);

  // Go to a specific step by ID
  const goTo = useCallback((stepId: string, data?: Record<string, unknown>) => {
    goToStep(id, stepId, data);
  }, [id, goToStep]);

  // Update modal data
  const setData = useCallback((data: Record<string, unknown>) => {
    updateData(id, data);
  }, [id, updateData]);

  // Get current modal state
  const isOpen = useMemo(() => isModalOpen(id), [id, isModalOpen]);
  const currentStep = useMemo(() => getCurrentStep(id), [id, getCurrentStep]);
  const currentStepIndex = useMemo(() => getCurrentStepIndex(id), [id, getCurrentStepIndex]);
  const totalSteps = useMemo(() => getTotalSteps(id), [id, getTotalSteps]);
  const isFirst = useMemo(() => isFirstStep(id), [id, isFirstStep]);
  const isLast = useMemo(() => isLastStep(id), [id, isLastStep]);
  const data = useMemo(() => getModalData(id), [id, getModalData]);

  return {
    // Actions
    open,
    close,
    next,
    prev,
    goTo,
    setData,

    // State
    isOpen,
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirst,
    isLast,
    data,
  };
}
