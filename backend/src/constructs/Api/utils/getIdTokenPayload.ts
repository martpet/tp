import camelcaseKeys from 'camelcase-keys';

import { IdTokenPayload } from '~/constructs/Api/types';

export const getIdTokenPayload = (idToken: string): IdTokenPayload => {
  const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());

  return camelcaseKeys(payload);
};
