import { ActionButton, Tooltip, TooltipTrigger, View } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-map-gl';
import { useSelector } from 'react-redux';

import { selectMapView } from '~/features/map';

export function PitchResetControl() {
  const mapRef = useMap();
  const { pitch } = useSelector(selectMapView);

  if (!pitch) {
    return null;
  }

  return (
    <TooltipTrigger>
      <ActionButton onPress={() => mapRef.current?.flyTo({ pitch: 0 })}>
        {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
        <View position="absolute">2D</View>
      </ActionButton>
      <Tooltip>
        <FormattedMessage defaultMessage="Reset pitch" description="map pitch control" />
      </Tooltip>
    </TooltipTrigger>
  );
}
