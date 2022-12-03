import cookie from 'cookie';

import { itCalls, itReturns, parseEventCookies } from '~/constructs/Api/utils';

vi.mock('cookie');

vi.mocked(cookie.parse).mockReturnValue({ sessionId: 'dummySessionId' });

const args = [{ cookies: ['dummyCookie1', 'dummyCookie2'] }] as unknown as Parameters<
  typeof parseEventCookies
>;

describe('parseEventCookies', () => {
  itCalls(cookie.parse, parseEventCookies, args);
  itReturns(parseEventCookies, args);

  describe('when "cookies" event prop is missing', () => {
    const argsClone = structuredClone(args);
    argsClone[0].cookies = undefined;
    itReturns(parseEventCookies, argsClone);
  });
});
