import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import Map, { MapRef } from 'react-map-gl';
import { useSelector } from 'react-redux';

import { useGetPublicCredentialsQuery } from '~/app';
import { Loading } from '~/common/components';
import { useAppDispatch, useToolbarPosition } from '~/common/hooks';
import { mapMoved, selectMapView } from '~/features/map';

import { transformRequest } from './transformRequest';
import { useMapStyle } from './useMapStyle';

export default function MapInner() {
  const initialViewState = useSelector(selectMapView);
  const { data: credentials } = useGetPublicCredentialsQuery();
  const mapStyle = useMapStyle();
  const { toolbarPosition } = useToolbarPosition();
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    mapRef.current?.resize();
  }, [toolbarPosition]);

  if (!credentials || !mapStyle) {
    return <Loading />;
  }

  return (
    <Map
      ref={mapRef}
      mapStyle={mapStyle}
      mapLib={maplibregl}
      attributionControl={false}
      transformRequest={transformRequest(credentials)}
      initialViewState={initialViewState}
      onMoveEnd={(event) => dispatch(mapMoved(event.viewState))}
    />
  );
}
