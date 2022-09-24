import { lambdaEdgeViewerEvent } from '~/constructs/Api/__fixtures__';
import { LambdaEdgeViewerRequestHandler } from '~/constructs/Api/types';
import { parseEventCookies, parseLambdaEdgeEventCookies } from '~/constructs/Api/utils';

vi.mock('../parseEventCookies');

const args = [lambdaEdgeViewerEvent] as Parameters<LambdaEdgeViewerRequestHandler>;

describe('parseLambdaEdgeEventCookies', () => {
  it('calls "parseEventCookies" with correct args', () => {
    parseLambdaEdgeEventCookies(...args);
    expect(vi.mocked(parseEventCookies).mock.calls).toMatchSnapshot();
  });

  it('returns a correct value', () => {
    expect(parseLambdaEdgeEventCookies(...args)).toMatchSnapshot();
  });
});
