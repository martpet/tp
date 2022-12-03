import { lambdaEdgeViewerEvent } from '~/constructs/Api/consts';
import { itReturns } from '~/constructs/Api/utils';

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
  itReturns(checkIsPublicEndpoint, args);

  describe('when the endpont method is not public', () => {
    beforeEach(() => {
      request.uri = '/me';
    });
    itReturns(checkIsPublicEndpoint, args);
  });

  describe('when the endpoint path is not in "publicEndpoints"', () => {
    beforeEach(() => {
      request.uri = '';
    });
    itReturns(checkIsPublicEndpoint, args);
  });
});
