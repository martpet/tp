import { APIGatewayProxyEventV2 } from 'aws-lambda';
import cookie from 'cookie';

import { EndpointsCookies } from '../types';

export const parseEventCookies = <T extends keyof EndpointsCookies>(
  event: APIGatewayProxyEventV2
): Partial<Record<EndpointsCookies[T][number], string>> => {
  try {
    const cookieHeaderString = event.cookies?.join(';');
    if (!cookieHeaderString) throw new Error();
    return cookie.parse(cookieHeaderString);
  } catch (e) {
    return {};
  }
};
