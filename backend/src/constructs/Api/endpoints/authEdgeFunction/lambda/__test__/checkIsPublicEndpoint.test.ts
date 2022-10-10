import { lambdaEdgeViewerEvent } from '~/constructs/Api/consts';

import { checkIsPublicEndpoint } from '../checkIsPublicEndpoint';

const args = [lambdaEdgeViewerEvent] as Parameters<typeof checkIsPublicEndpoint>;
const { request } = args[0].Records[0].cf;

beforeEach(() => {
  request.uri = '/login';
  request.method = 'GET';

  global.globalAuthEdgeFunctionProps = {
    authDomain: '',
  };
});

describe('checkIsPublicEndpoint', () => {
  it('returns a correct value when the endpont method is public', () => {
    expect(checkIsPublicEndpoint(...args)).toBe(true);
  });

  describe('when the endpont method is not public', () => {
    beforeEach(() => {
      request.uri = '/me';
    });
    it('returns a correct value', () => {
      expect(checkIsPublicEndpoint(...args)).toBe(false);
    });
  });

  describe('when the endpoint path is not in "publicEndpoints"', () => {
    beforeEach(() => {
      request.uri = '';
    });
    it('returns a correct value', () => {
      expect(checkIsPublicEndpoint(...args)).toBe(false);
    });
  });
});
