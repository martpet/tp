import { toFixedNumber } from '~/common/utils/toFixedNumber';

const fixedDigits = {
  longitude: 6,
  latitude: 6,
  altitude: 0,
  bearing: 0,
  zoom: 2,
  pitch: 2,
};

export function toFixedGeoNumber(
  key: keyof typeof fixedDigits,
  originalValue?: number | string
) {
  return toFixedNumber(originalValue, fixedDigits[key]);
}
