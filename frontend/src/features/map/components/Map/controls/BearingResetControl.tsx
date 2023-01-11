import { ActionButton, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import CompassIcon from '@spectrum-icons/workflow/Compass';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-map-gl';
import { useSelector } from 'react-redux';

import { selectMapView } from '~/features/map';

export function BearingResetControl() {
  const { bearing } = useSelector(selectMapView);
  const mapRef = useMap();

  if (!bearing) {
    return null;
  }

  return (
    <TooltipTrigger>
      <ActionButton onPress={() => mapRef.current?.flyTo({ bearing: 0 })}>
        <CompassIcon />
      </ActionButton>
      <Tooltip>
        <FormattedMessage
          defaultMessage="Reset north"
          description="map compass control"
        />
      </Tooltip>
    </TooltipTrigger>
  );
}
