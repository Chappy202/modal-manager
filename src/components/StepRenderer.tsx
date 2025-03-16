import React from 'react';
import type { StepProps, StepRendererProps } from '../types/components';

export { type StepProps, type StepRendererProps } from '../types/components';

export function Step({ children }: StepProps) {
  return <>{children}</>;
}

export function StepRenderer({ currentStep, children }: StepRendererProps) {
  // Find the step that matches the current step ID
  const childrenArray = React.Children.toArray(children) as React.ReactElement<StepProps>[];

  const currentStepElement = childrenArray.find(child => child.props.id === currentStep);

  // If no matching step is found, return null
  if (!currentStepElement) {
    return null;
  }

  return currentStepElement;
}
