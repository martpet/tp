import { crypto, getRandomBase64UrlSafe } from 'lambda-layer';

export async function generateOauthRandoms() {
  const idTokenNonce = await getRandomBase64UrlSafe(128);
  const stateNonce = await getRandomBase64UrlSafe(128);
  const codeVerifier = await getRandomBase64UrlSafe(128);

  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return {
    idTokenNonce,
    stateNonce,
    codeVerifier,
    codeChallenge,
  };
}
