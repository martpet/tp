import cookie from 'cookie';

import { parseOauthCookie } from '../parseOauthCookie';

vi.mock('cookie');

const args = [['dummyCookie1', 'dummyCookie2']];

beforeEach(() => {
  vi.mocked(cookie.parse).mockReturnValue({
    oauth: JSON.stringify({ dummyOauthCookieContentKey: 'dummyOauthCookieContentValue' }),
  });
});

describe('parseOauthCookie', () => {
  it('calls "cookie.parse" with correct args', () => {
    parseOauthCookie(...args);
    expect(vi.mocked(cookie.parse).mock.calls).toMatchSnapshot();
  });

  it('returns a correct value', () => {
    expect(parseOauthCookie(...args)).toMatchSnapshot();
  });

  describe('when "cookie.parse" throws', () => {
    beforeEach(() => {
      vi.mocked(cookie.parse).mockImplementation(() => {
        throw new Error();
      });
    });
    it('returns a correct value', () => {
      expect(parseOauthCookie(...args)).toMatchSnapshot();
    });
  });

  describe('when "oauth" cookie is missing', () => {
    beforeEach(() => {
      vi.mocked(cookie.parse).mockReturnValue({});
    });
    it('returns a correct value', () => {
      expect(parseOauthCookie(...args)).toMatchSnapshot();
    });
  });

  describe('when "oauth" cookie content is not json', () => {
    beforeEach(() => {
      vi.mocked(cookie.parse).mockReturnValue({ oauth: 'notJson' });
    });
    it('returns a correct value', () => {
      expect(parseOauthCookie(...args)).toMatchSnapshot();
    });
  });
});
