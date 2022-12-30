import { CSSProperties } from 'react';
import { TransitionStatus } from 'react-transition-group/Transition';

export const transitionStyles: Partial<Record<TransitionStatus, CSSProperties>> = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};
