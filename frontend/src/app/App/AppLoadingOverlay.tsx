import { View } from '@adobe/react-spectrum';

import { selectHasPendingQueriesWithLoader } from '~/app/App/appSlice';
import { LoadingOverlay } from '~/common/components';
import { useAppSelector } from '~/common/hooks';

export function AppLoadingOverlay() {
  const isLoading = useAppSelector(selectHasPendingQueriesWithLoader);

  if (!isLoading) {
    return null;
  }

  return (
    <View position="fixed" left="0" top="0" width="100vw" height="100vh" zIndex={9999}>
      <LoadingOverlay />
    </View>
  );
}
