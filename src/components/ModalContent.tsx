import React from 'react';
import { useModal } from '../hooks/useModal';
import type { ModalContentProps } from '../types/components';

export { type ModalContentProps } from '../types/components';

export function ModalContent({ id, children }: ModalContentProps) {
  // Get all props from useModal
  const { open, addStep, ...modalProps } = useModal({ id });

  // If children is a function, call it with the current state
  if (typeof children === 'function') {
    return children(modalProps);
  }

  // Otherwise, just render the children
  return <>{children}</>;
}
