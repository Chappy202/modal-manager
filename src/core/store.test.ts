import useModalStore from './store';
import { act } from '@testing-library/react';

// Helper to create a clean store for each test
const createTestStore = () => {
  const store = useModalStore.getState();
  // Clear any existing modals
  const modalIds = Object.keys(store.modals);
  modalIds.forEach(id => {
    store.closeModal(id);
  });
  return store;
};

describe('useModalStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useModalStore.getState();
    const modalIds = Object.keys(store.modals);
    modalIds.forEach(id => {
      store.closeModal(id);
    });
  });

  describe('openModal', () => {
    it('should create a new modal with default values', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
      });

      expect(store.isModalOpen('test-modal')).toBe(true);
      expect(store.getTotalSteps('test-modal')).toBe(0);
      expect(store.getCurrentStepIndex('test-modal')).toBe(0);
      expect(store.getModalData('test-modal')).toEqual({});
    });

    it('should create a new modal with initial data', () => {
      const store = createTestStore();
      const initialData = { foo: 'bar' };

      act(() => {
        store.openModal('test-modal', initialData);
      });

      expect(store.getModalData('test-modal')).toEqual(initialData);
    });

    it('should not overwrite an existing modal', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.addStep('test-modal', 'step-1');
        store.openModal('test-modal', { newData: true });
      });

      expect(store.getTotalSteps('test-modal')).toBe(1);
      expect(store.getCurrentStep('test-modal')).toBe('step-1');
    });
  });

  describe('closeModal', () => {
    it('should remove the modal from the store', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.closeModal('test-modal');
      });

      expect(store.isModalOpen('test-modal')).toBe(false);
    });

    it('should handle closing a non-existent modal', () => {
      const store = createTestStore();

      act(() => {
        store.closeModal('non-existent-modal');
      });

      expect(store.isModalOpen('non-existent-modal')).toBe(false);
    });
  });

  describe('addStep', () => {
    it('should add a step to the modal', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.addStep('test-modal', 'step-1');
      });

      expect(store.getTotalSteps('test-modal')).toBe(1);
      expect(store.getCurrentStep('test-modal')).toBe('step-1');
    });

    it('should not add a duplicate step', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.addStep('test-modal', 'step-1');
        store.addStep('test-modal', 'step-1'); // Duplicate
      });

      expect(store.getTotalSteps('test-modal')).toBe(1);
    });

    it('should do nothing if the modal does not exist', () => {
      const store = createTestStore();

      act(() => {
        store.addStep('non-existent-modal', 'step-1');
      });

      expect(store.isModalOpen('non-existent-modal')).toBe(false);
    });
  });

  describe('nextStep', () => {
    it('should increment the current step index', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.addStep('test-modal', 'step-1');
        store.addStep('test-modal', 'step-2');
        store.nextStep('test-modal');
      });

      expect(store.getCurrentStepIndex('test-modal')).toBe(1);
      expect(store.getCurrentStep('test-modal')).toBe('step-2');
    });

    it('should update data when moving to the next step', () => {
      const store = createTestStore();
      const newData = { newValue: 'test' };

      act(() => {
        store.openModal('test-modal', { initialValue: 'initial' });
        store.addStep('test-modal', 'step-1');
        store.addStep('test-modal', 'step-2');
        store.nextStep('test-modal', newData);
      });

      expect(store.getModalData('test-modal')).toEqual({
        initialValue: 'initial',
        newValue: 'test'
      });
    });

    it('should not go beyond the last step', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.addStep('test-modal', 'step-1');
        store.nextStep('test-modal'); // Already at the last step
        store.nextStep('test-modal'); // Try to go beyond
      });

      expect(store.getCurrentStepIndex('test-modal')).toBe(0);
      expect(store.getCurrentStep('test-modal')).toBe('step-1');
    });

    it('should do nothing if the modal does not exist', () => {
      const store = createTestStore();

      act(() => {
        store.nextStep('non-existent-modal');
      });

      expect(store.isModalOpen('non-existent-modal')).toBe(false);
    });
  });

  describe('prevStep', () => {
    it('should decrement the current step index', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.addStep('test-modal', 'step-1');
        store.addStep('test-modal', 'step-2');
        store.nextStep('test-modal'); // Go to step 2
        store.prevStep('test-modal'); // Go back to step 1
      });

      expect(store.getCurrentStepIndex('test-modal')).toBe(0);
      expect(store.getCurrentStep('test-modal')).toBe('step-1');
    });

    it('should not go before the first step', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal');
        store.addStep('test-modal', 'step-1');
        store.prevStep('test-modal'); // Try to go before first step
      });

      expect(store.getCurrentStepIndex('test-modal')).toBe(0);
    });

    it('should do nothing if the modal does not exist', () => {
      const store = createTestStore();

      act(() => {
        store.prevStep('non-existent-modal');
      });

      expect(store.isModalOpen('non-existent-modal')).toBe(false);
    });
  });

  describe('updateData', () => {
    it('should merge new data with existing data', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal', { initialValue: 'initial' });
        store.updateData('test-modal', { newValue: 'test' });
      });

      expect(store.getModalData('test-modal')).toEqual({
        initialValue: 'initial',
        newValue: 'test'
      });
    });

    it('should overwrite existing properties with the same name', () => {
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal', { value: 'initial' });
        store.updateData('test-modal', { value: 'updated' });
      });

      expect(store.getModalData('test-modal').value).toBe('updated');
    });

    it('should do nothing if the modal does not exist', () => {
      const store = createTestStore();

      act(() => {
        store.updateData('non-existent-modal', { value: 'test' });
      });

      expect(store.isModalOpen('non-existent-modal')).toBe(false);
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      // Setup a test modal for all getter tests
      const store = createTestStore();

      act(() => {
        store.openModal('test-modal', { initialValue: 'initial' });
        store.addStep('test-modal', 'step-1');
        store.addStep('test-modal', 'step-2');
        store.addStep('test-modal', 'step-3');
      });
    });

    it('getModalData should return the modal data', () => {
      const store = useModalStore.getState();
      expect(store.getModalData('test-modal')).toEqual({ initialValue: 'initial' });
    });

    it('getModalData should return an empty object for non-existent modals', () => {
      const store = useModalStore.getState();
      expect(store.getModalData('non-existent-modal')).toEqual({});
    });

    it('getCurrentStep should return the current step ID', () => {
      const store = useModalStore.getState();
      expect(store.getCurrentStep('test-modal')).toBe('step-1');
    });

    it('getCurrentStep should return null for non-existent modals', () => {
      const store = useModalStore.getState();
      expect(store.getCurrentStep('non-existent-modal')).toBeNull();
    });

    it('getCurrentStepIndex should return the current step index', () => {
      const store = useModalStore.getState();
      expect(store.getCurrentStepIndex('test-modal')).toBe(0);
    });

    it('getCurrentStepIndex should return 0 for non-existent modals', () => {
      const store = useModalStore.getState();
      expect(store.getCurrentStepIndex('non-existent-modal')).toBe(0);
    });

    it('getTotalSteps should return the total number of steps', () => {
      const store = useModalStore.getState();
      expect(store.getTotalSteps('test-modal')).toBe(3);
    });

    it('getTotalSteps should return 0 for non-existent modals', () => {
      const store = useModalStore.getState();
      expect(store.getTotalSteps('non-existent-modal')).toBe(0);
    });

    it('isFirstStep should return true when on the first step', () => {
      const store = useModalStore.getState();
      expect(store.isFirstStep('test-modal')).toBe(true);
    });

    it('isFirstStep should return false when not on the first step', () => {
      const store = useModalStore.getState();

      act(() => {
        store.nextStep('test-modal');
      });

      expect(store.isFirstStep('test-modal')).toBe(false);
    });

    it('isLastStep should return true when on the last step', () => {
      const store = useModalStore.getState();

      act(() => {
        store.nextStep('test-modal');
        store.nextStep('test-modal');
      });

      expect(store.isLastStep('test-modal')).toBe(true);
    });

    it('isLastStep should return false when not on the last step', () => {
      const store = useModalStore.getState();
      expect(store.isLastStep('test-modal')).toBe(false);
    });

    it('isModalOpen should return true when the modal exists', () => {
      const store = useModalStore.getState();
      expect(store.isModalOpen('test-modal')).toBe(true);
    });

    it('isModalOpen should return false when the modal does not exist', () => {
      const store = useModalStore.getState();
      expect(store.isModalOpen('non-existent-modal')).toBe(false);
    });
  });
});
