import cookie from 'cookie';

import { parseSessionCookie } from '../parseSessionCookie';

vi.mock('cookie');

const args = [['dummyCookie1', 'dummyCookie2']];

beforeEach(() => {
  vi.mocked(cookie.parse).mockReturnValue({ session: 'dummySessionId' });
});

describe('parseSessionCookie', () => {
  it('calls "cookie.parse" with correct args', () => {
    parseSessionCookie(...args);
    expect(vi.mocked(cookie.parse).mock.calls).toMatchSnapshot();
  });

  it('returns a correct value', () => {
    expect(parseSessionCookie(...args)).toMatchSnapshot();
  });

  describe('when "cookie.parse" throws', () => {
    beforeEach(() => {
      vi.mocked(cookie.parse).mockImplementation(() => {
        throw new Error();
      });
    });

    it('returns a correct value', () => {
      expect(parseSessionCookie(...args)).toMatchSnapshot();
    });
  });

  describe('when "session" cookie is missing', () => {
    beforeEach(() => {
      vi.mocked(cookie.parse).mockReturnValue({});
    });

    it('returns a correct value', () => {
      expect(parseSessionCookie(...args)).toMatchSnapshot();
    });
  });
});
