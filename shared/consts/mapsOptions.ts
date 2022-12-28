import { MapsOptions, MapType, mapTypes } from '../types';
import { appName } from './sharedConsts';

const styles: Record<`${MapType}${string}`, string> = {
  esriLightGray: 'VectorEsriLightGrayCanvas',
  esriDarkGray: 'VectorEsriDarkGrayCanvas',
  hereExplore: 'VectorHereExplore',
};

export const mapsOptions = Object.fromEntries(
  Object.entries(styles).map(([key, style]) => [
    key,
    {
      mapName: `${appName}-${style}`,
      style,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      type: mapTypes.find((type) => key.includes(type))!,
    } satisfies MapsOptions,
  ])
);
