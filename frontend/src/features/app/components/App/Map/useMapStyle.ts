import { useProvider } from '@adobe/react-spectrum';
import { Signer } from '@aws-amplify/core';
import { AnyLayer, Style } from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { SymbolLayer } from 'react-map-gl';
import { useSelector } from 'react-redux';
import { SetRequired } from 'type-fest';

import { useGetPublicCredentialsQuery } from '~/app';
import { mapsOptions, region } from '~/common/consts';
import { AWSCredentials, Language, MapProvider, MapsOptions } from '~/common/types';
import { selectLanguage } from '~/features/settings';

const { esriLightGray, esriDarkGray } = mapsOptions;

export function useMapStyle() {
  const [initialStyle, setInitialStyle] = useState<Style>();
  const [mapStyle, setMapStyle] = useState<Style>();
  const { data: credentials } = useGetPublicCredentialsQuery();
  const language = useSelector(selectLanguage);
  const { colorScheme } = useProvider();
  const map = colorScheme === 'light' ? esriLightGray : esriDarkGray;
  const url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${map.mapName}/style-descriptor`;

  useEffect(() => {
    if (!credentials) return;
    (async () => {
      const style = await fetchStyle(url, credentials);
      setInitialStyle(style);
    })();
  }, [url, credentials]);

  useEffect(() => {
    if (!initialStyle) return;
    const localized = localizeStyle(initialStyle, language, map);
    setMapStyle(localized);
  }, [initialStyle, language]);

  return mapStyle;
}

async function fetchStyle(url: string, credentials: AWSCredentials): Promise<Style> {
  const signedUrl = Signer.signUrl(url, credentials);
  const res = await fetch(signedUrl);
  if (!res.ok) throw new Error('No style descriptor found');
  return res.json();
}

function localizeStyle(style: Style, lang: Language, map: MapsOptions): Style {
  return {
    ...style,
    layers: localizeLayers(style.layers, lang, map),
  };
}

function localizeLayers(
  layers: AnyLayer[],
  lang: Language,
  map: MapsOptions
): AnyLayer[] {
  const values: Record<
    MapProvider,
    {
      primary: string;
      fallback(initial: string): string;
    }
  > = {
    esri: {
      primary: `_name_${lang}`,
      fallback: (initial) => initial.replace(/[{}]/g, ''),
    },
    here: {
      primary: `name:${lang}`,
      fallback: () => 'name',
    },
  };

  if (!Object.keys(values).includes(map.provider)) {
    return layers;
  }

  return layers.map((layer) => {
    if (
      !isSymbolLayerWithLayout(layer) ||
      typeof layer.layout['text-field'] !== 'string' ||
      !layer.layout['text-field'].length
    ) {
      return layer;
    }

    return {
      ...layer,
      layout: {
        ...layer.layout,
        'text-field': [
          'coalesce',
          ['get', values[map.provider].primary],
          ['get', values[map.provider].fallback(layer.layout['text-field'])],
        ],
      },
    };
  });
}

function isSymbolLayerWithLayout(
  layer: AnyLayer
): layer is SetRequired<SymbolLayer, 'layout'> {
  return Boolean((layer as SymbolLayer).layout?.['text-field']);
}
