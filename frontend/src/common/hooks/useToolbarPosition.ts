import { useIsMobileDevice } from '@react-spectrum/utils';

import { useAppSelector } from '~/common/hooks';
import { selectToolbarPosition } from '~/features';

// In the future, disable positioning for toolbar, and use a positioned "rail" container for instruments

export const useToolbarPosition = () => {
  const toolbarPosition = useAppSelector(selectToolbarPosition);
  const isMobile = useIsMobileDevice();
  const isToolbarPositionDisabled = isMobile;
  const usedPosition = isToolbarPositionDisabled ? 'top' : toolbarPosition;

  return {
    toolbarPosition: usedPosition,
    isToolbarPositionDisabled,
    isToolbarOnTop: usedPosition === 'top',
  };
};
