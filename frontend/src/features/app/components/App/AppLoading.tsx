import { View } from '@adobe/react-spectrum';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '~/app';
import { Loading } from '~/common/components';
import { selectHasPendingQueriesWithLoader } from '~/features/app';

export function AppLoading() {
  const isLoading = useSelector(selectHasPendingQueriesWithLoader);
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
      <Loading dim />
    </View>
  );

  return createPortal(<ThemeProvider>{element}</ThemeProvider>, mountNode);
}
