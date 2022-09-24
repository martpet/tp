import cookie from 'cookie';

import { parseEventCookies } from '~/constructs/Api/utils';

vi.mock('cookie');

const args = [
  {
    cookies: ['dummyCookie1', 'dummyCookie2'],
  },
] as unknown as Parameters<typeof parseEventCookies>;

vi.mocked(cookie.parse).mockReturnValue({ sessionId: 'dummySessionId' });

describe('parseEventCookies', () => {
  it('calls "cookie.parse" with correct args', () => {
    parseEventCookies(...args);
    expect(vi.mocked(cookie.parse).mock.calls).toMatchSnapshot();
  });

  it('returns a correct value', () => {
    expect(parseEventCookies(...args)).toMatchSnapshot();
  });

  describe('when "cookies" event prop is missing', () => {
    const argsClone = structuredClone(args);
    argsClone[0].cookies = undefined;

    it('returns a correct value', () => {
      expect(parseEventCookies(...argsClone)).toMatchSnapshot();
    });
  });
});
