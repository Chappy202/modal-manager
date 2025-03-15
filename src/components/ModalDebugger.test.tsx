import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalDebugger } from './ModalDebugger';

// Mock the useModalStore hook
jest.mock('../core/store', () => {
  // Create a mock implementation that returns the store state and functions
  return {
    __esModule: true,
    default: jest.fn((selector) => selector({
      modals: {
        'test-modal': {
          steps: [
            { id: 'step-1', data: {} },
            { id: 'step-2', data: {} }
          ],
          currentStepIndex: 0,
          data: { name: 'Test User', email: 'test@example.com' }
        }
      },
      isModalOpen: jest.fn().mockReturnValue(true),
      getCurrentStep: jest.fn().mockReturnValue('step-1'),
      getCurrentStepIndex: jest.fn().mockReturnValue(0),
      getTotalSteps: jest.fn().mockReturnValue(2)
    }))
  };
});

describe('ModalDebugger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a toggle button', () => {
    render(<ModalDebugger />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should toggle debug panel when button is clicked', () => {
    render(<ModalDebugger />);

    // Initially the debug panel should be hidden
    expect(screen.queryByText(/modal data/i)).not.toBeInTheDocument();

    // Click the toggle button
    fireEvent.click(screen.getByRole('button'));

    // Now the debug panel should be visible with some modal data
    expect(screen.getByText(/test-modal/i)).toBeInTheDocument();
  });
});
