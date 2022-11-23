import { View } from '@adobe/react-spectrum';
import { createPortal } from 'react-dom';

import { ThemeProvider } from '~/app';
import { LoadingOverlay } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { selectHasPendingQueriesWithLoader } from '~/features/app';

export function AppLoadingOverlay() {
  const isLoading = useAppSelector(selectHasPendingQueriesWithLoader);
  const mountNode = document.getElementById('overlay') as HTMLElement;

  if (!isLoading) {
    return null;
  }

  const element = (
    <View
      position="fixed"
      left="static-size-0"
      top="static-size-0"
      width="100vw"
      height="100vh"
      zIndex={9999}
    >
      <LoadingOverlay />
    </View>
  );

  return createPortal(<ThemeProvider>{element}</ThemeProvider>, mountNode);
}
