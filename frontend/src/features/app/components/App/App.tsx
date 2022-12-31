import { useGetPublicCredentialsQuery } from '~/app';
import { Map } from '~/features/map';

import { AppLoading } from './AppLoading';
import { AppLoginDialog } from './AppLoginDialog';
import { useDisableDragDrop, useThemeColorMetaTag } from './hooks';
import { Layout } from './Layout';
import { Toolbar } from './Toolbar/Toolbar';

export function App() {
  useThemeColorMetaTag();
  useDisableDragDrop();
  useGetPublicCredentialsQuery(undefined, { pollingInterval: 2 * 60 * 60 * 1000 });

  return (
    <>
      <AppLoginDialog />
      <AppLoading />
      <Layout header={<Toolbar />} main={<Map />} />
    </>
  );
}
