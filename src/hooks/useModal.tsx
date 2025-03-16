import { useCallback, useEffect, useMemo, useState } from 'react';
import useModalStore from '../core/store';
import type { UseModalOptions, UseModalReturn } from '../types/hooks';

export { type UseModalOptions } from '../types/hooks';

export function useModal({ id, initialData = {}, steps = [] }: UseModalOptions): UseModalReturn {
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

  // Local state to track changes
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [localCurrentStep, setLocalCurrentStep] = useState<string | null>(null);
  const [localCurrentStepIndex, setLocalCurrentStepIndex] = useState(0);
  const [localTotalSteps, setLocalTotalSteps] = useState(0);
  const [localIsFirst, setLocalIsFirst] = useState(true);
  const [localIsLast, setLocalIsLast] = useState(false);
  const [localData, setLocalData] = useState<Record<string, unknown>>({});
  const [_, setForceUpdate] = useState({});

  // Initialize steps when the hook is first used
  const initializeSteps = useCallback(() => {
    steps.forEach(step => {
      storeAddStep(id, step.id, step.data);
    });
  }, [id, steps, storeAddStep]);

  // Subscribe to store changes
  useEffect(() => {
    // Initial state sync
    setLocalIsOpen(isModalOpen(id));
    setLocalCurrentStep(getCurrentStep(id));
    setLocalCurrentStepIndex(getCurrentStepIndex(id));
    setLocalTotalSteps(getTotalSteps(id));
    setLocalIsFirst(isFirstStep(id));
    setLocalIsLast(isLastStep(id));
    setLocalData(getModalData(id));

    // Subscribe to changes in the modal store
    const unsubscribe = useModalStore.subscribe(state => {
      // Force update when our modal changes
      if (state.modals[id] !== undefined) {
        setLocalIsOpen(true);
        setLocalCurrentStep(getCurrentStep(id));
        setLocalCurrentStepIndex(getCurrentStepIndex(id));
        setLocalTotalSteps(getTotalSteps(id));
        setLocalIsFirst(isFirstStep(id));
        setLocalIsLast(isLastStep(id));
        setLocalData(getModalData(id));
        setForceUpdate({});
      } else {
        setLocalIsOpen(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    id,
    isModalOpen,
    getCurrentStep,
    getCurrentStepIndex,
    getTotalSteps,
    isFirstStep,
    isLastStep,
    getModalData,
  ]);

  // Open the modal and initialize steps
  const open = useCallback(
    (data?: Record<string, unknown>) => {
      openModal(id, { ...initialData, ...data });
      initializeSteps();
      setLocalIsOpen(true);
    },
    [id, initialData, openModal, initializeSteps],
  );

  // Close the modal
  const close = useCallback(() => {
    closeModal(id);
    setLocalIsOpen(false);
  }, [id, closeModal]);

  // Add or update a step
  const addStep = useCallback(
    (modalId: string, stepId: string, data?: Record<string, unknown>, previousStep?: string) => {
      storeAddStep(modalId, stepId, data, previousStep);
      setForceUpdate({});
    },
    [storeAddStep],
  );

  // Go to next step with optional data
  const next = useCallback(
    (data?: Record<string, unknown>) => {
      nextStep(id, data);
      setForceUpdate({});
    },
    [id, nextStep],
  );

  // Go to previous step
  const prev = useCallback(() => {
    prevStep(id);
    setForceUpdate({});
  }, [id, prevStep]);

  // Go to a specific step by ID
  const goTo = useCallback(
    (stepId: string, data?: Record<string, unknown>) => {
      goToStep(id, stepId, data);
      setForceUpdate({});
    },
    [id, goToStep],
  );

  // Update modal data
  const setData = useCallback(
    (data: Record<string, unknown>) => {
      updateData(id, data);
      setLocalData(prev => ({ ...prev, ...data }));
      setForceUpdate({});
    },
    [id, updateData],
  );

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
    isOpen: localIsOpen,
    currentStep: localCurrentStep,
    currentStepIndex: localCurrentStepIndex,
    totalSteps: localTotalSteps,
    isFirst: localIsFirst,
    isLast: localIsLast,
    data: localData,
  };
}
