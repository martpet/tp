import { IdTokenPayload } from '~/constructs/Api/types';

export const getIdTokenPayload = async (idToken: string): Promise<IdTokenPayload> => {
  const camelcaseKeys = (await import('camelcase-keys')).default;
  const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());

  return camelcaseKeys(payload);
};
