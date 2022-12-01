import { lambdaEdgeViewerEvent } from '~/constructs/Api/consts';
import { LambdaEdgeViewerRequestHandler } from '~/constructs/Api/types';
import {
  itReturns,
  parseEventCookies,
  parseLambdaEdgeEventCookies,
} from '~/constructs/Api/utils';

vi.mock('../parseEventCookies');

const args = [lambdaEdgeViewerEvent] as Parameters<LambdaEdgeViewerRequestHandler>;

describe('parseLambdaEdgeEventCookies', () => {
  it('calls "parseEventCookies" with correct args', () => {
    parseLambdaEdgeEventCookies(...args);
    expect(vi.mocked(parseEventCookies).mock.calls).toMatchSnapshot();
  });
  itReturns(parseLambdaEdgeEventCookies, args);
});
