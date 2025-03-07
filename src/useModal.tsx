import React, { useEffect, useCallback, ReactNode } from 'react';
import useModalStore from './modal-state-manager';

export interface ModalOptions {
  onComplete?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  initialData?: Record<string, any>;
}

export interface ModalFlowProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  options?: ModalOptions;
}

export interface ModalStepProps {
  modalId: string;
  stepId: string;
  children: ReactNode | ((data: any) => ReactNode);
}

export function useModal(modalId: string, options?: ModalOptions) {
  const {
    registerModal,
    closeModal,
    addStep,
    goToStep,
    nextStep,
    prevStep,
    updateStepData,
    getStepData,
    getAllData,
    getCurrentStep,
    getCurrentStepIndex,
    getTotalSteps,
    isFirstStep,
    isLastStep,
    isModalOpen,
  } = useModalStore();

  // Register modal on mount
  useEffect(() => {
    registerModal(modalId, options?.initialData);
    // We intentionally only want to register once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalId]);

  const close = useCallback(() => {
    closeModal(modalId);
  }, [closeModal, modalId]);

  const complete = useCallback(() => {
    const data = getAllData(modalId);
    options?.onComplete?.(data);
    closeModal(modalId);
  }, [closeModal, getAllData, modalId, options]);

  return {
    // State
    isOpen: isModalOpen(modalId),
    currentStep: getCurrentStep(modalId),
    currentStepIndex: getCurrentStepIndex(modalId),
    totalSteps: getTotalSteps(modalId),
    isFirstStep: isFirstStep(modalId),
    isLastStep: isLastStep(modalId),

    // Actions
    addStep: (stepId: string, data?: any) => addStep(modalId, stepId, data),
    goToStep: (stepId: string, data?: any) => goToStep(modalId, stepId, data),
    nextStep: (data?: any) => nextStep(modalId, data),
    prevStep: () => prevStep(modalId),
    close,
    complete,

    // Data
    updateStepData: (stepId: string, data: any) => updateStepData(modalId, stepId, data),
    getStepData: (stepId: string) => getStepData(modalId, stepId),
    getAllData: () => getAllData(modalId),
  };
}

export function ModalStep({ modalId, stepId, children }: ModalStepProps) {
  const { currentStep, addStep, getStepData } = useModal(modalId);
  
  // Register this step with the modal
  useEffect(() => {
    addStep(stepId);
    // We only want to register once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  // Only render if this is the current step
  if (!currentStep || currentStep.id !== stepId) {
    return null;
  }

  // Get the data for this step
  const stepData = getStepData(stepId);

  // Render children, passing step data if children is a function
  return (
    <>
      {typeof children === 'function' ? children(stepData || {}) : children}
    </>
  );
}

export function ModalFlow({ id, open, onOpenChange, children, options }: ModalFlowProps) {
  const modal = useModal(id, options);
  
  // Sync open state with modal
  useEffect(() => {
    if (open && !modal.isOpen) {
      // If the UI says it's open but our state says it's closed, register it
      useModalStore.getState().registerModal(id, options?.initialData);
    } else if (!open && modal.isOpen) {
      // If the UI says it's closed but our state says it's open, close it
      useModalStore.getState().closeModal(id);
    }
  }, [id, modal.isOpen, open, options?.initialData]);

  // Handle closing from the modal state
  useEffect(() => {
    if (!modal.isOpen && open) {
      onOpenChange(false);
    }
  }, [modal.isOpen, onOpenChange, open]);

  return <>{children}</>;
}