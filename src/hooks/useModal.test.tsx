import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';
import useModalStore from '../core/store';

// Mock the store
jest.mock('../core/store', () => {
  const mockStore = {
    openModal: jest.fn(),
    closeModal: jest.fn(),
    addStep: jest.fn(),
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goToStep: jest.fn(),
    updateData: jest.fn(),
    isModalOpen: jest.fn().mockReturnValue(true),
    getCurrentStep: jest.fn().mockReturnValue('step-1'),
    getCurrentStepIndex: jest.fn().mockReturnValue(0),
    getTotalSteps: jest.fn().mockReturnValue(3),
    isFirstStep: jest.fn().mockReturnValue(true),
    isLastStep: jest.fn().mockReturnValue(false),
    getModalData: jest.fn(),
    shouldShowStep: jest.fn().mockReturnValue(true),
  };
  return jest.fn(() => mockStore);
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Set default mock return value for getModalData
  (useModalStore().getModalData as jest.Mock).mockReturnValue({ testData: 'value' });
});

describe('useModal', () => {
  it('should register modal on mount', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    expect(result.current.isOpen).toBe(true);
    expect(useModalStore().openModal).toHaveBeenCalledWith('test-modal', undefined);
  });

  it('should register modal with initial data', () => {
    const initialData = { foo: 'bar' };
    renderHook(() => useModal('test-modal', { initialData }));

    expect(useModalStore().openModal).toHaveBeenCalledWith('test-modal', initialData);
  });

  it('should close modal when unmounted', () => {
    const { unmount } = renderHook(() => useModal('test-modal'));
    unmount();

    expect(useModalStore().closeModal).toHaveBeenCalledWith('test-modal');
  });

  it('should not close modal when unmounted if callbacks are provided', () => {
    const { unmount } = renderHook(() =>
      useModal('test-modal', {
        onComplete: () => {},
        onCancel: () => {}
      })
    );
    unmount();

    expect(useModalStore().closeModal).not.toHaveBeenCalled();
  });

  it('should navigate to next step', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    act(() => {
      result.current.nextStep();
    });

    expect(useModalStore().nextStep).toHaveBeenCalledWith('test-modal', undefined);
  });

  it('should navigate to next step with data', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    const newData = { newData: 'value' };

    act(() => {
      result.current.nextStep(newData);
    });

    expect(useModalStore().nextStep).toHaveBeenCalledWith('test-modal', newData);
  });

  it('should navigate to previous step', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    act(() => {
      result.current.prevStep();
    });

    expect(useModalStore().prevStep).toHaveBeenCalledWith('test-modal');
  });

  it('should add a step', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    act(() => {
      result.current.addStep('new-step');
    });

    expect(useModalStore().addStep).toHaveBeenCalledWith('test-modal', 'new-step');
  });

  it('should update data', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    const newData = { updated: true };

    act(() => {
      result.current.updateData(newData);
    });

    expect(useModalStore().updateData).toHaveBeenCalledWith('test-modal', newData);
  });

  it('should complete the modal and call onComplete callback', () => {
    const mockComplete = jest.fn();
    const mockData = { completed: true };

    // Mock getModalData to return our test data
    (useModalStore().getModalData as jest.Mock).mockReturnValue(mockData);

    const { result } = renderHook(() =>
      useModal('test-modal', { onComplete: mockComplete })
    );

    act(() => {
      result.current.complete();
    });

    expect(mockComplete).toHaveBeenCalledWith(mockData);
    expect(useModalStore().closeModal).toHaveBeenCalledWith('test-modal');
  });

  it('should cancel the modal and call onCancel callback', () => {
    const mockCancel = jest.fn();

    const { result } = renderHook(() =>
      useModal('test-modal', { onCancel: mockCancel })
    );

    act(() => {
      result.current.close();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(useModalStore().closeModal).toHaveBeenCalledWith('test-modal');
  });

  it('should provide access to modal state', () => {
    // Ensure getModalData returns the expected value for this test
    (useModalStore().getModalData as jest.Mock).mockReturnValue({ testData: 'value' });

    const { result } = renderHook(() => useModal('test-modal'));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.currentStep).toBe('step-1');
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.totalSteps).toBe(3);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.data).toEqual({ testData: 'value' });
  });

  it('should check if a step should be shown based on a condition', () => {
    // Mock getModalData to return data that will make the condition true
    (useModalStore().getModalData as jest.Mock).mockReturnValue({ showStep: true });

    const { result } = renderHook(() => useModal('test-modal'));
    const condition = (data: Record<string, any>) => data.showStep === true;

    let shouldShow = false;
    act(() => {
      shouldShow = result.current.shouldShowStep('conditional-step', condition);
    });

    expect(shouldShow).toBe(true);
    expect(useModalStore().getModalData).toHaveBeenCalledWith('test-modal');
  });
});

