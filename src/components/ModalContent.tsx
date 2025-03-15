import React from 'react';
import { useModal } from '../hooks/useModal';

export type ModalContentProps = {
  id: string;
  children: React.ReactNode | ((props: {
    currentStep: string | null;
    data: Record<string, unknown>;
    next: (data?: Record<string, unknown>) => void;
    prev: () => void;
    close: () => void;
    goTo: (stepId: string, data?: Record<string, unknown>) => void;
    setData: (data: Record<string, unknown>) => void;
    isFirst: boolean;
    isLast: boolean;
  }) => React.ReactNode);
};

export function ModalContent({ id, children }: ModalContentProps) {
  const {
    currentStep,
    data,
    next,
    prev,
    close,
    goTo,
    setData,
    isFirst,
    isLast,
  } = useModal({ id });

  // If children is a function, call it with the current state
  if (typeof children === 'function') {
    return children({
      currentStep,
      data,
      next,
      prev,
      close,
      goTo,
      setData,
      isFirst,
      isLast,
    });
  }

  // Otherwise, just render the children
  return <>{children}</>;
}
