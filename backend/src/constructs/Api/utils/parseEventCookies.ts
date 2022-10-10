import { APIGatewayProxyEventV2 } from 'aws-lambda';
import cookie from 'cookie';

import { EndpointCookies, PathWithCookies } from '../types';

export const parseEventCookies = <T extends PathWithCookies>(
  event: APIGatewayProxyEventV2
): EndpointCookies<T> => {
  try {
    const cookieHeaderString = event.cookies?.join(';');
    if (!cookieHeaderString) throw new Error();
    return cookie.parse(cookieHeaderString);
  } catch (e) {
    return {};
  }
};
