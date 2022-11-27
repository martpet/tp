import { LambdaEdgeViewerEvent } from '~/constructs/Api/types';
import { isPublicEndpoint } from '~/utils';

export function checkIsPublicEndpoint(edgeEvent: LambdaEdgeViewerEvent) {
  const { uri, method } = edgeEvent.Records[0].cf.request;

  return isPublicEndpoint({
    path: uri,
    method,
  });
}
