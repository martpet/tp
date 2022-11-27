import { AppLoadingOverlay } from './AppLoadingOverlay';
import { AppLoginDialog } from './AppLoginDialog';
import { useDisableDragDrop, useThemeColorMetaTag } from './hooks';
import { Layout } from './Layout/Layout';

export function App() {
  useThemeColorMetaTag();
  useDisableDragDrop();

  return (
    <>
      <AppLoginDialog />
      <AppLoadingOverlay />
      <Layout />
    </>
  );
}
