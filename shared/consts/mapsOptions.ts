import { appName } from './sharedConsts';

const styles = {
  esriLightGray: 'VectorEsriLightGrayCanvas',
  esriDarkGray: 'VectorEsriDarkGrayCanvas',
};

export const mapsOptions = Object.fromEntries(
  Object.entries(styles).map(([key, style]) => [
    key,
    {
      mapName: `${appName}-${style}`,
      style,
    },
  ])
);
