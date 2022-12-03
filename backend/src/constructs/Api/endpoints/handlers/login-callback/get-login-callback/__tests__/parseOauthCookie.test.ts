import { itCalls, itReturns, parseEventCookies } from '~/constructs/Api/utils';

import { parseOauthCookie } from '../parseOauthCookie';

vi.mock('~/constructs/Api/utils/parseEventCookies');

const args = [
  {
    cookies: ['dummyCookie1', 'dummyCookie2'],
  },
] as unknown as Parameters<typeof parseOauthCookie>;

vi.mocked(parseEventCookies).mockReturnValue({
  oauth: JSON.stringify({ dummyOauthCookieContentKey: 'dummyOauthCookieContentValue' }),
});

describe('parseOauthCookie', () => {
  itReturns(parseOauthCookie, args);
  itCalls(parseEventCookies, parseOauthCookie, args);

  describe('when "oauth" cookie is missing', () => {
    beforeEach(() => {
      vi.mocked(parseEventCookies).mockReturnValueOnce({});
    });
    itReturns(parseOauthCookie, args);
  });

  describe('when "oauth" cookie value is not json-parsable', () => {
    beforeEach(() => {
      vi.mocked(parseEventCookies).mockReturnValueOnce({ oauth: 'non json value' });
    });
    itReturns(parseOauthCookie, args);
  });
});
