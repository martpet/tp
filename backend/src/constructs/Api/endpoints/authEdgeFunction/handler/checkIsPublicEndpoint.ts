import { isPublicEndpoint } from '~/../../shared/utils/isPublicEndpoint';
import { LambdaEdgeViewerEvent } from '~/constructs/Api/types';

export function checkIsPublicEndpoint(edgeEvent: LambdaEdgeViewerEvent) {
  const { uri, method } = edgeEvent.Records[0].cf.request;

  return isPublicEndpoint({
    path: uri,
    method,
  });
}
