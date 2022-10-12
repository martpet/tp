import { View } from '@adobe/react-spectrum';

import { LoadingOverlay } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { selectHasPendingQueriesWithLoader } from '~/features/app/appSlice';

export function AppLoadingOverlay() {
  const isLoading = useAppSelector(selectHasPendingQueriesWithLoader);

  if (!isLoading) {
    return null;
  }

  return (
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
}
