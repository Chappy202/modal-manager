import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';
import useModalStore from '../core/store';

// Mock the store
jest.mock('../core/store', () => {
  const mockStore = {
    registerModal: jest.fn(),
    closeModal: jest.fn(),
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goToStep: jest.fn(),
    updateStepData: jest.fn(),
    isModalOpen: jest.fn().mockReturnValue(true),
    getCurrentStep: jest.fn(),
    getCurrentStepIndex: jest.fn(),
    getTotalSteps: jest.fn(),
    isFirstStep: jest.fn(),
    isLastStep: jest.fn(),
    getAllData: jest.fn(),
    getStepData: jest.fn(),
  };
  return jest.fn(() => mockStore);
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('useModal', () => {
  it('should register modal on mount', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    expect(result.current.isOpen).toBe(true);
    expect(useModalStore().registerModal).toHaveBeenCalledWith('test-modal', undefined);
  });

  it('should register modal with initial data', () => {
    const initialData = { foo: 'bar' };
    renderHook(() => useModal('test-modal', { initialData }));

    expect(useModalStore().registerModal).toHaveBeenCalledWith('test-modal', initialData);
  });

  it('should close modal when unmounted', () => {
    const { unmount } = renderHook(() => useModal('test-modal'));
    unmount();

    expect(useModalStore().closeModal).toHaveBeenCalledWith('test-modal');
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

  it('should navigate to specific step', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    act(() => {
      result.current.goToStep('step-2', { stepData: 'value' });
    });

    expect(useModalStore().goToStep).toHaveBeenCalledWith('test-modal', 'step-2', {
      stepData: 'value',
    });
  });

  it('should update step data', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    act(() => {
      result.current.updateStepData('step-1', { updated: true });
    });

    expect(useModalStore().updateStepData).toHaveBeenCalledWith('test-modal', 'step-1', {
      updated: true,
    });
  });

  it('should get step data', () => {
    const { result } = renderHook(() => useModal('test-modal'));

    result.current.getStepData('step-1');

    expect(useModalStore().getStepData).toHaveBeenCalledWith('test-modal', 'step-1');
  });
});
