import { LambdaEdgeViewerEvent } from '~/constructs/Api/types';
import { publicEndpoints } from '~/consts';
import { ApiMethod, ApiPath } from '~/types';

export const checkIsPublicEndpoint = (event: LambdaEdgeViewerEvent) => {
  const { uri, method } = event.Records[0].cf.request;
  return Boolean(publicEndpoints[uri as ApiPath]?.includes(method as ApiMethod));
};
