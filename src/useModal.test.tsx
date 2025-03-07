import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';

// Mock the modal store
jest.mock('./modal-state-manager', () => {
  const mockStore = {
    registerModal: jest.fn(),
    closeModal: jest.fn(),
    addStep: jest.fn(),
    goToStep: jest.fn(),
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    updateStepData: jest.fn(),
    getStepData: jest.fn(),
    getAllData: jest.fn(() => ({})),
    getCurrentStep: jest.fn(() => null),
    getCurrentStepIndex: jest.fn(() => 0),
    getTotalSteps: jest.fn(() => 3),
    isFirstStep: jest.fn(() => true),
    isLastStep: jest.fn(() => false),
    isModalOpen: jest.fn(() => true),
  };
  
  return {
    __esModule: true,
    default: () => mockStore,
  };
});

describe('useModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register modal on mount', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    
    expect(result.current.isOpen).toBe(true);
    expect(require('./modal-state-manager').default().registerModal).toHaveBeenCalledWith('test-modal', undefined);
  });

  it('should register modal with initial data', () => {
    const initialData = { foo: 'bar' };
    renderHook(() => useModal('test-modal', { initialData }));
    
    expect(require('./modal-state-manager').default().registerModal).toHaveBeenCalledWith('test-modal', initialData);
  });

  it('should close modal', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    
    act(() => {
      result.current.close();
    });
    
    expect(require('./modal-state-manager').default().closeModal).toHaveBeenCalledWith('test-modal');
  });

  it('should complete modal and call onComplete', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useModal('test-modal', { onComplete }));
    
    act(() => {
      result.current.complete();
    });
    
    expect(require('./modal-state-manager').default().getAllData).toHaveBeenCalledWith('test-modal');
    expect(require('./modal-state-manager').default().closeModal).toHaveBeenCalledWith('test-modal');
    expect(onComplete).toHaveBeenCalled();
  });

  it('should navigate to next step', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    
    act(() => {
      result.current.nextStep({ newData: 'value' });
    });
    
    expect(require('./modal-state-manager').default().nextStep).toHaveBeenCalledWith('test-modal', { newData: 'value' });
  });

  it('should navigate to previous step', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    
    act(() => {
      result.current.prevStep();
    });
    
    expect(require('./modal-state-manager').default().prevStep).toHaveBeenCalledWith('test-modal');
  });

  it('should go to specific step', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    
    act(() => {
      result.current.goToStep('step-2', { stepData: 'value' });
    });
    
    expect(require('./modal-state-manager').default().goToStep).toHaveBeenCalledWith('test-modal', 'step-2', { stepData: 'value' });
  });

  it('should update step data', () => {
    const { result } = renderHook(() => useModal('test-modal'));
    
    act(() => {
      result.current.updateStepData('step-1', { updated: true });
    });
    
    expect(require('./modal-state-manager').default().updateStepData).toHaveBeenCalledWith('test-modal', 'step-1', { updated: true });
  });
}); 