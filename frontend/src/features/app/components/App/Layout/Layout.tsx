import { Grid, View } from '@adobe/react-spectrum';

import { useToolbarPosition } from '~/common/hooks';

import { Toolbar } from './Toolbar/Toolbar';

const toolbarArea = 'toolbar';
const contentArea = 'content';

export function Layout() {
  const { isToolbarOnTop } = useToolbarPosition();

  const gridStyleProps = isToolbarOnTop
    ? {
        columns: ['1fr'],
        rows: ['58px', '1fr'],
        areas: [toolbarArea, contentArea],
      }
    : {
        columns: ['52px', '1fr'],
        rows: ['1fr'],
        areas: [[toolbarArea, contentArea].join(' ')],
      };

  return (
    <Grid height="100vh" {...gridStyleProps}>
      <View gridArea={toolbarArea} elementType="header">
        <Toolbar />
      </View>
      <View gridArea={contentArea} elementType="main" />
    </Grid>
  );
}
