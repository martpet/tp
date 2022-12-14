import 'maplibre-gl/dist/maplibre-gl.css';

import { Flex } from '@adobe/react-spectrum';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import MapGl, { MapRef } from 'react-map-gl';
import { useSelector } from 'react-redux';

import { useGetPublicCredentialsQuery } from '~/app';
import { Loading } from '~/common/components';
import { sideSpace } from '~/common/consts';
import { useAppDispatch, useToolbarPosition } from '~/common/hooks';
import { mapLoaded, mapMoved, selectMapView } from '~/features/map';

import {
  BearingResetControl,
  GeolocateControl,
  PitchResetControl,
  ZoomControls,
} from './controls';
import { transformRequest } from './transformRequest';
import { useMapStyle } from './useMapStyle';

export default function Map() {
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
    <MapGl
      ref={mapRef}
      mapStyle={mapStyle}
      mapLib={maplibregl}
      attributionControl={false}
      transformRequest={transformRequest(credentials)}
      initialViewState={initialViewState}
      onMoveEnd={(event) => dispatch(mapMoved(event.viewState))}
      onLoad={() => dispatch(mapLoaded())}
    >
      <Flex height="calc(100% - (100vh - 100dvh))">
        <Flex margin={sideSpace} alignItems="end" justifyContent="end" flexGrow={1}>
          <Flex direction="column" gap="size-75">
            <PitchResetControl />
            <BearingResetControl />
            <GeolocateControl />
            <ZoomControls />
          </Flex>
        </Flex>
      </Flex>
    </MapGl>
  );
}
