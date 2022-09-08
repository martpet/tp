import cookie from 'cookie';

import { cookieName } from '../../../apiUtils';

export const parseSessionCookie = (cookies?: string[]) => {
  try {
    const parsedCookies = cookie.parse(cookies!.join(';'));
    return parsedCookies[cookieName('session')];
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
