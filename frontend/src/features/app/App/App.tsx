import { useDisableDragDrop } from '~/features/app/App/useDisableDragDrop';

import { AppLoadingOverlay } from './AppLoadingOverlay';
import { Layout } from './Layout/Layout';
import { useThemeColorMetaTag } from './useThemeColorMetaTag';

export function App() {
  useThemeColorMetaTag();
  useDisableDragDrop();

  return (
    <>
      <AppLoadingOverlay />
      <Layout />
    </>
  );
}
