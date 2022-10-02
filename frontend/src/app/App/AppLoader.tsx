import { selectHasActiveAppQueries } from '~/app/App/appSlice';
import { LoadingOverlay } from '~/common/components';
import { useAppSelector } from '~/common/hooks';

export function AppLoader() {
  const hasActiveQueries = useAppSelector(selectHasActiveAppQueries);

  if (!hasActiveQueries) {
    return null;
  }

  return <LoadingOverlay />;
}
