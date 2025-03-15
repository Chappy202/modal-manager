import React, { useEffect, useCallback } from 'react';
import useModalStore from '../core/store';
import type { ModalOptions, ModalStepProps, ModalFlowProps, ConditionalStepProps } from '../types';

/**
 * Custom hook for interacting with a specific modal
 */
export function useModal(modalId: string, options?: ModalOptions) {
  const store = useModalStore();

  // Register modal on mount and clean up on unmount
  useEffect(() => {
    store.openModal(modalId, options?.initialData);

    // Clean up the modal when the component unmounts
    return () => {
      // Only close if no callbacks are provided (to avoid double-closing)
      if (!options?.onCancel && !options?.onComplete) {
        store.closeModal(modalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalId]);

  // Helper to determine if a step should be shown based on a condition
  const shouldShowStep = useCallback((stepId: string, condition?: (data: Record<string, any>) => boolean) => {
    if (!condition) return true;
    const data = store.getModalData(modalId);
    return condition(data);
  }, [modalId, store]);

  return {
    // State
    isOpen: store.isModalOpen(modalId),
    currentStep: store.getCurrentStep(modalId),
    currentStepIndex: store.getCurrentStepIndex(modalId),
    totalSteps: store.getTotalSteps(modalId),
    isFirstStep: store.isFirstStep(modalId),
    isLastStep: store.isLastStep(modalId),
    data: store.getModalData(modalId),

    // Actions
    addStep: (stepId: string) => store.addStep(modalId, stepId),
    nextStep: (data?: Record<string, any>) => store.nextStep(modalId, data),
    prevStep: () => store.prevStep(modalId),
    updateData: (data: Record<string, any>) => store.updateData(modalId, data),
    shouldShowStep,

    // Modal lifecycle
    close: () => {
      if (options?.onCancel) options.onCancel();
      store.closeModal(modalId);
    },
    complete: () => {
      const data = store.getModalData(modalId);
      if (options?.onComplete) options.onComplete(data);
      store.closeModal(modalId);
    }
  };
}

/**
 * Component for rendering a specific step in a modal flow
 */
export function ModalStep({ modalId, stepId, children }: ModalStepProps) {
  const { currentStep, addStep } = useModal(modalId);

  // Register this step with the modal
  useEffect(() => {
    addStep(stepId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  // Only render if this is the current step
  if (currentStep !== stepId) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Component for rendering a conditional step in a modal flow
 * Only registers and renders if the condition is met
 */
export function ConditionalStep({
  modalId,
  stepId,
  condition,
  children
}: ConditionalStepProps) {
  const modal = useModal(modalId);
  const shouldShow = modal.shouldShowStep(stepId, condition);

  // Only register this step with the modal if the condition is met
  useEffect(() => {
    if (shouldShow) {
      modal.addStep(stepId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId, shouldShow]);

  // Only render if this is the current step and condition is met
  if (modal.currentStep !== stepId || !shouldShow) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Component for connecting a modal UI to the modal state manager
 */
export function ModalFlow({ id, open, onOpenChange, children, options }: ModalFlowProps) {
  const store = useModalStore();

  // Register the modal with the store
  useEffect(() => {
    if (open) {
      store.openModal(id, options?.initialData);
    }
  }, [id, open, options?.initialData, store]);

  // Handle modal closing from the store
  useEffect(() => {
    const isOpen = store.isModalOpen(id);
    if (!isOpen && open) {
      // If the modal is closed in the store but still open in the parent component,
      // update the parent component's state
      onOpenChange(false);
    }
  }, [id, open, onOpenChange, store]);

  // Only render children when open is true
  if (!open) return null;

  return <>{children}</>;
}
