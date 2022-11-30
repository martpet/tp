import {
  APIGatewayProxyEventV2,
  OauthCookieProps,
  parseEventCookies,
} from 'lambda-layer';

export const parseOauthCookie = (event: APIGatewayProxyEventV2) => {
  try {
    const { oauth } = parseEventCookies<'/login-callback'>(event);
    if (!oauth) throw new Error();
    return JSON.parse(oauth) as Partial<OauthCookieProps>;
  } catch (e) {
    console.error(e);
    return {};
  }
};
