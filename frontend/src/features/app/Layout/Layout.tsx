import { Grid, View } from '@adobe/react-spectrum';
import { GridStyleProps } from '@react-types/shared';

import { Text } from '~/common/components';
import { useToolbarPosition } from '~/common/hooks';

import { AppLoadingOverlay } from './AppLoadingOverlay';
import { Toolbar } from './Toolbar';

const toolbarArea = 'toolbar';
const contentArea = 'content';

export function Layout() {
  return (
    <>
      <AppLoadingOverlay />
      <Grid height="100vh" {...useGridStyle()}>
        <View gridArea={toolbarArea} elementType="header">
          <Toolbar />
        </View>
        <View gridArea={contentArea} elementType="main">
          <Text id="foo" />
        </View>
      </Grid>
    </>
  );
}

function useGridStyle(): GridStyleProps {
  const { isToolbarOnTop } = useToolbarPosition();

  if (isToolbarOnTop) {
    return {
      columns: ['1fr'],
      rows: ['58px', '1fr'],
      areas: [toolbarArea, contentArea],
    };
  }

  return {
    columns: ['52px', '1fr'],
    rows: ['1fr'],
    areas: [[toolbarArea, contentArea].join(' ')],
  };
}
