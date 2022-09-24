import { lambdaEdgeViewerEvent } from '~/constructs/Api/__fixtures__/lambdaEdgeViewerEvent';

import { checkIsPublicEndpoint } from '../checkIsPublicEndpoint';

const args = [lambdaEdgeViewerEvent] as Parameters<typeof checkIsPublicEndpoint>;

beforeEach(() => {
  const { request } = args[0].Records[0].cf;
  request.uri = '/dummyPublicUri';
  request.method = 'GET';

  global.globalAuthEdgeFunctionProps = {
    publicEndpoints: { '/dummyPublicUri': ['GET'] },
    authDomain: '',
  };
});

describe('checkIsPublicEndpoint', () => {
  it('returns a correct value when the endpont method is public', () => {
    expect(checkIsPublicEndpoint(...args)).toBe(true);
  });

  describe('when the endpont method is not public', () => {
    beforeEach(() => {
      global.globalAuthEdgeFunctionProps.publicEndpoints = { '/dummyPublicUri': [] };
    });
    it('returns a correct value', () => {
      expect(checkIsPublicEndpoint(...args)).toBe(false);
    });
  });

  describe('when the endpoint path is not in "publicEndpoints"', () => {
    beforeEach(() => {
      global.globalAuthEdgeFunctionProps.publicEndpoints = {};
    });
    it('returns a correct value', () => {
      expect(checkIsPublicEndpoint(...args)).toBe(false);
    });
  });
});
