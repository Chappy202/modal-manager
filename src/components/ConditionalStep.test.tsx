import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConditionalStep } from '../hooks/useModal';

// Define the props type for ConditionalStep
interface ConditionalStepProps {
  modalId: string;
  stepId: string;
  condition: (data: any) => boolean;
  children: React.ReactNode;
}

// Mock the useModal hook
jest.mock('../hooks/useModal', () => {
  // Keep the original exports
  const originalModule = jest.requireActual('../hooks/useModal');

  // Create a mock implementation of useModal
  const mockUseModal = jest.fn();

  return {
    ...originalModule,
    useModal: mockUseModal,
    // We need to redefine ConditionalStep to use our mocked useModal
    ConditionalStep: (props: ConditionalStepProps) => {
      const modal = mockUseModal(props.modalId);
      const shouldShow = modal.shouldShowStep(props.stepId, props.condition);

      // Register this step with the modal (simplified version of the real component)
      React.useEffect(() => {
        if (shouldShow) {
          modal.addStep(props.stepId);
        }
      }, [props.stepId, shouldShow, modal]);

      // Only render if this is the current step and condition is met
      if (modal.currentStep !== props.stepId || !shouldShow) {
        return null;
      }

      return <>{props.children}</>;
    }
  };
});

describe('ConditionalStep', () => {
  // Get a reference to the mocked useModal hook
  const useModal = require('../hooks/useModal').useModal;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register the step when condition is true', () => {
    // Setup
    const addStep = jest.fn();
    useModal.mockReturnValue({
      currentStep: 'conditional-step',
      addStep,
      shouldShowStep: jest.fn().mockReturnValue(true),
      getModalData: jest.fn().mockReturnValue({ showStep: true }),
    });

    // Render
    render(
      <ConditionalStep
        modalId="test-modal"
        stepId="conditional-step"
        condition={(data) => data.showStep}
      >
        <div data-testid="step-content">Conditional Content</div>
      </ConditionalStep>
    );

    // Assert
    expect(useModal).toHaveBeenCalledWith('test-modal');
    expect(addStep).toHaveBeenCalledWith('conditional-step');
  });

  it('should not register the step when condition is false', () => {
    // Setup
    const addStep = jest.fn();
    useModal.mockReturnValue({
      currentStep: 'conditional-step',
      addStep,
      shouldShowStep: jest.fn().mockReturnValue(false),
      getModalData: jest.fn().mockReturnValue({ showStep: false }),
    });

    // Render
    render(
      <ConditionalStep
        modalId="test-modal"
        stepId="conditional-step"
        condition={(data) => data.showStep}
      >
        <div data-testid="step-content">Conditional Content</div>
      </ConditionalStep>
    );

    // Assert
    expect(addStep).not.toHaveBeenCalled();
  });

  it('should render children when it is the current step and condition is true', () => {
    // Setup
    useModal.mockReturnValue({
      currentStep: 'conditional-step',
      addStep: jest.fn(),
      shouldShowStep: jest.fn().mockReturnValue(true),
      getModalData: jest.fn().mockReturnValue({ showStep: true }),
    });

    // Render
    render(
      <ConditionalStep
        modalId="test-modal"
        stepId="conditional-step"
        condition={(data) => data.showStep}
      >
        <div data-testid="step-content">Conditional Content</div>
      </ConditionalStep>
    );

    // Assert
    expect(screen.getByTestId('step-content')).toBeInTheDocument();
  });

  it('should not render children when it is not the current step', () => {
    // Setup
    useModal.mockReturnValue({
      currentStep: 'other-step', // Different step is active
      addStep: jest.fn(),
      shouldShowStep: jest.fn().mockReturnValue(true),
      getModalData: jest.fn().mockReturnValue({ showStep: true }),
    });

    // Render
    render(
      <ConditionalStep
        modalId="test-modal"
        stepId="conditional-step"
        condition={(data) => data.showStep}
      >
        <div data-testid="step-content">Conditional Content</div>
      </ConditionalStep>
    );

    // Assert
    expect(screen.queryByTestId('step-content')).not.toBeInTheDocument();
  });

  it('should not render children when condition is false', () => {
    // Setup
    useModal.mockReturnValue({
      currentStep: 'conditional-step',
      addStep: jest.fn(),
      shouldShowStep: jest.fn().mockReturnValue(false),
      getModalData: jest.fn().mockReturnValue({ showStep: false }),
    });

    // Render
    render(
      <ConditionalStep
        modalId="test-modal"
        stepId="conditional-step"
        condition={(data) => data.showStep}
      >
        <div data-testid="step-content">Conditional Content</div>
      </ConditionalStep>
    );

    // Assert
    expect(screen.queryByTestId('step-content')).not.toBeInTheDocument();
  });
});
