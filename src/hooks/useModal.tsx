import { useCallback, useEffect, useMemo, useState } from 'react';
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
    addStep: storeAddStep,
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

  // Local state to track changes - rename to _ since we only use setState
  const [_, setForceUpdate] = useState({});

  // Initialize steps when the hook is first used
  const initializeSteps = useCallback(() => {
    steps.forEach(step => {
      storeAddStep(id, step.id, step.data);
    });
  }, [id, steps, storeAddStep]);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = useModalStore.subscribe(state => {
      // Force update when our modal changes
      if (state.modals[id] !== undefined) {
        setForceUpdate({});
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  // Open the modal and initialize steps
  const open = useCallback(
    (data?: Record<string, unknown>) => {
      openModal(id, { ...initialData, ...data });
      initializeSteps();
      // Force immediate update
      setForceUpdate({});
    },
    [id, initialData, openModal, initializeSteps],
  );

  // Close the modal
  const close = useCallback(() => {
    closeModal(id);
    // Force immediate update
    setForceUpdate({});
  }, [id, closeModal]);

  // Add or update a step
  const addStep = useCallback(
    (modalId: string, stepId: string, data?: Record<string, unknown>, previousStep?: string) => {
      storeAddStep(modalId, stepId, data, previousStep);
      // Force immediate update
      setForceUpdate({});
    },
    [storeAddStep],
  );

  // Go to next step with optional data
  const next = useCallback(
    (data?: Record<string, unknown>) => {
      nextStep(id, data);
      // Force immediate update
      setForceUpdate({});
    },
    [id, nextStep],
  );

  // Go to previous step
  const prev = useCallback(() => {
    prevStep(id);
    // Force immediate update
    setForceUpdate({});
  }, [id, prevStep]);

  // Go to a specific step by ID
  const goTo = useCallback(
    (stepId: string, data?: Record<string, unknown>) => {
      goToStep(id, stepId, data);
      // Force immediate update
      setForceUpdate({});
    },
    [id, goToStep],
  );

  // Update modal data
  const setData = useCallback(
    (data: Record<string, unknown>) => {
      updateData(id, data);
      // Force immediate update
      setForceUpdate({});
    },
    [id, updateData],
  );

  // Get current modal state - remove forceUpdate from dependency arrays
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
    addStep,

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
