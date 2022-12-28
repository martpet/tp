import { lazy, Suspense } from 'react';

import { useGetPublicCredentialsQuery } from '~/app';
import { Loading } from '~/common/components';

import { AppLoading } from './AppLoading';
import { AppLoginDialog } from './AppLoginDialog';
import { useDisableDragDrop, useThemeColorMetaTag } from './hooks';
import { Layout } from './Layout';
import { Toolbar } from './Toolbar/Toolbar';

const mapImport = import('./Map/Map');
const Map = lazy(() => mapImport);

export function App() {
  useThemeColorMetaTag();
  useDisableDragDrop();
  useGetPublicCredentialsQuery(undefined, { pollingInterval: 2 * 60 * 60 * 1000 });

  return (
    <>
      <AppLoginDialog />
      <AppLoading />
      <Layout
        header={<Toolbar />}
        main={
          <Suspense fallback={<Loading />}>
            <Map />
          </Suspense>
        }
      />
    </>
  );
}
