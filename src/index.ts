// Core
import useModalStoreOriginal from './core/store';
export { useModalStoreOriginal as useModalStore };
export type { ModalStep, ModalState } from './core/store';

// Hooks
import { useModal as useModalHook } from './hooks/useModal';
export { useModalHook as useModal };
export type { UseModalOptions } from './hooks/useModal';

// Components
import { ModalContent as ModalContentComponent } from './components/ModalContent';
export { ModalContentComponent as ModalContent };
export type { ModalContentProps } from './components/ModalContent';

import {
  Step as StepComponent,
  StepRenderer as StepRendererComponent,
} from './components/StepRenderer';
export { StepComponent as Step, StepRendererComponent as StepRenderer };
export type { StepProps, StepRendererProps } from './components/StepRenderer';

import { ModalDebugger as ModalDebuggerComponent } from './components/ModalDebugger';
export { ModalDebuggerComponent as ModalDebugger };
export type { ModalDebuggerProps } from './components/ModalDebugger';

// Types
export * from './types';

// Create a default export with all components
const ModalManager = {
  useModalStore: useModalStoreOriginal,
  useModal: useModalHook,
  ModalContent: ModalContentComponent,
  Step: StepComponent,
  StepRenderer: StepRendererComponent,
  ModalDebugger: ModalDebuggerComponent,
};

export default ModalManager;
