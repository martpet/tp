import 'maplibre-gl/dist/maplibre-gl.css';

import { useProvider } from '@adobe/react-spectrum';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import MapGl, { MapRef } from 'react-map-gl';

import { useGetPublicCredentialsQuery } from '~/app';
import { Loading } from '~/common/components';
import { mapsOptions } from '~/common/consts';
import { useToolbarPosition } from '~/common/hooks';

import { transformRequest } from './transformRequest';

const { esriLightGray, esriDarkGray } = mapsOptions;

export default function Map() {
  const { colorScheme } = useProvider();
  const mapStyle = colorScheme === 'light' ? esriLightGray.mapName : esriDarkGray.mapName;
  const mapRef = useRef<MapRef>(null);
  const toolbarPosition = useToolbarPosition();

  const { data: credentials } = useGetPublicCredentialsQuery();

  useEffect(() => {
    mapRef.current?.resize();
  }, [toolbarPosition]);

  if (!credentials) {
    return <Loading />;
  }

  return (
    <MapGl
      ref={mapRef}
      mapStyle={mapStyle}
      mapLib={maplibregl}
      transformRequest={transformRequest(credentials)}
      attributionControl={false}
    />
  );
}
