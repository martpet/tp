import { AppLoadingOverlay } from './AppLoadingOverlay';
import { Layout } from './Layout/Layout';
import { useThemeColorMetaTag } from './useThemeColorMetaTag';

export function App() {
  useThemeColorMetaTag();

  return (
    <>
      <AppLoadingOverlay />
      <Layout />
    </>
  );
}
