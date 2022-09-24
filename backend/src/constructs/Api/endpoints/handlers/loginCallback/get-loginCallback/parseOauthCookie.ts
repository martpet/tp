import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { OauthCookieProps } from '~/constructs/Api/types';
import { parseEventCookies } from '~/constructs/Api/utils';

export const parseOauthCookie = (event: APIGatewayProxyEventV2) => {
  try {
    const { oauth } = parseEventCookies<'/loginCallback'>(event);
    if (!oauth) throw new Error();
    return JSON.parse(oauth) as Partial<OauthCookieProps>;
  } catch (e) {
    console.error(e);
    return {};
  }
};
