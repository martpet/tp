import { lambdaEdgeViewerEvent } from '~/constructs/Api/consts';
import {
  itCalls,
  itReturns,
  parseEventCookies,
  parseLambdaEdgeEventCookies,
} from '~/constructs/Api/utils';

vi.mock('../parseEventCookies');

const args = [lambdaEdgeViewerEvent] as Parameters<typeof parseLambdaEdgeEventCookies>;

describe('parseLambdaEdgeEventCookies', () => {
  itCalls(parseEventCookies, parseLambdaEdgeEventCookies, args);
  itReturns(parseLambdaEdgeEventCookies, args);
});
