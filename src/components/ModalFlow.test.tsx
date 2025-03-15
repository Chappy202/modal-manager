import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModalFlow } from '../hooks/useModal';
import useModalStore from '../core/store';

// Mock the store
jest.mock('../core/store', () => {
  const mockStore = {
    openModal: jest.fn(),
    isModalOpen: jest.fn(),
  };
  return jest.fn(() => mockStore);
});

describe('ModalFlow', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register the modal when open is true', () => {
    // Setup
    const mockStore = useModalStore();

    // Render
    render(
      <ModalFlow id="test-modal" open={true} onOpenChange={mockOnOpenChange}>
        <div data-testid="modal-content">Modal Content</div>
      </ModalFlow>
    );

    // Assert
    expect(mockStore.openModal).toHaveBeenCalledWith('test-modal', undefined);
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('should register the modal with initial data', () => {
    // Setup
    const mockStore = useModalStore();
    const initialData = { foo: 'bar' };

    // Render
    render(
      <ModalFlow
        id="test-modal"
        open={true}
        onOpenChange={mockOnOpenChange}
        options={{ initialData }}
      >
        <div data-testid="modal-content">Modal Content</div>
      </ModalFlow>
    );

    // Assert
    expect(mockStore.openModal).toHaveBeenCalledWith('test-modal', initialData);
  });

  it('should not render children when open is false', () => {
    // Render
    render(
      <ModalFlow id="test-modal" open={false} onOpenChange={mockOnOpenChange}>
        <div data-testid="modal-content">Modal Content</div>
      </ModalFlow>
    );

    // Assert
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  it('should call onOpenChange when modal is closed in the store', () => {
    // Setup
    const mockStore = useModalStore();
    (mockStore.isModalOpen as jest.Mock).mockReturnValue(false);

    // Render
    render(
      <ModalFlow id="test-modal" open={true} onOpenChange={mockOnOpenChange}>
        <div data-testid="modal-content">Modal Content</div>
      </ModalFlow>
    );

    // Assert - we need to wait for the effect to run
    // This is handled by React's act in the test environment
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not call onOpenChange when modal is open in the store', () => {
    // Setup
    const mockStore = useModalStore();
    (mockStore.isModalOpen as jest.Mock).mockReturnValue(true);

    // Render
    render(
      <ModalFlow id="test-modal" open={true} onOpenChange={mockOnOpenChange}>
        <div data-testid="modal-content">Modal Content</div>
      </ModalFlow>
    );

    // Assert
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });
});
