import { Grid, View } from '@adobe/react-spectrum';
import { ReactNode } from 'react';

import { useToolbarPosition } from '~/common/hooks';

const toolbarArea = 'toolbar';
const mainArea = 'main';

type Props = {
  header: ReactNode;
  main: ReactNode;
};

export function Layout({ header, main }: Props) {
  const { isToolbarOnTop } = useToolbarPosition();

  const gridStyleProps = isToolbarOnTop
    ? {
        columns: ['1fr'],
        rows: ['58px', '1fr'],
        areas: [toolbarArea, mainArea],
      }
    : {
        columns: ['52px', '1fr'],
        rows: ['1fr'],
        areas: [[toolbarArea, mainArea].join(' ')],
      };

  return (
    <Grid height="100vh" {...gridStyleProps}>
      <View elementType="header" gridArea={toolbarArea}>
        {header}
      </View>
      <View elementType="main" gridArea={mainArea}>
        {main}
      </View>
    </Grid>
  );
}
