import { ActionButton, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import Location from '@spectrum-icons/workflow/Location';
import { FormattedMessage } from 'react-intl';
import { GeolocateControl as MapGlGeolocateControl } from 'react-map-gl';

export function GeolocateControl() {
  const handleClick = () => {
    const cssSelector = '.mapboxgl-ctrl-geolocate';
    const mapboxControl = document.querySelector<HTMLDivElement>(cssSelector);
    mapboxControl?.click();
  };

  return (
    <>
      <MapGlGeolocateControl style={{ display: 'none' }} />
      <TooltipTrigger>
        <ActionButton onPress={handleClick}>
          <Location />
        </ActionButton>
        <Tooltip>
          <FormattedMessage
            defaultMessage="Find my location"
            description="map geolocation control"
          />
        </Tooltip>
      </TooltipTrigger>
    </>
  );
}
