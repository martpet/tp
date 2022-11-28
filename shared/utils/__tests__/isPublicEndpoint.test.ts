import { isPublicEndpoint } from '../isPublicEndpoint';

describe('isPublicEndpoint', () => {
  it('returns correct value', () => {
    expect(isPublicEndpoint({ path: '/login', method: 'GET' })).toBeTruthy();
    expect(isPublicEndpoint({ path: '/me', method: 'GET' })).toBeFalsy();
  });
});
