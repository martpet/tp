import cookie from 'cookie';

import { OauthCookieProps } from '../../../apiTypes';
import { cookieName } from '../../../apiUtils';

export const parseOauthCookie = (cookies?: string[]) => {
  try {
    const parsedCookies = cookie.parse(cookies!.join(';'));
    const oauthCookie = parsedCookies[cookieName('oauth')];
    return JSON.parse(oauthCookie) as Partial<OauthCookieProps>;
  } catch (e) {
    console.error(e);
    return {};
  }
};
