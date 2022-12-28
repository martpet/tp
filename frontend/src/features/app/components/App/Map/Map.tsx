import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import MapGl, { MapRef } from 'react-map-gl';

import { useGetPublicCredentialsQuery } from '~/app';
import { Loading } from '~/common/components';
import { useToolbarPosition } from '~/common/hooks';

import { transformRequest } from './transformRequest';
import { useMapStyle } from './useMapStyle';

export default function Map() {
  const { data: credentials } = useGetPublicCredentialsQuery();
  const mapStyle = useMapStyle();
  const toolbarPosition = useToolbarPosition();
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    mapRef.current?.resize();
  }, [toolbarPosition]);

  if (!credentials || !mapStyle) {
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
