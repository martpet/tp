import { ApiMethod, LambdaEdgeViewerEvent } from '~/constructs/Api/types';
import { ApiPath } from '~/types';

export const checkIsPublicEndpoint = (event: LambdaEdgeViewerEvent) => {
  const { uri, method } = event.Records[0].cf.request;
  const { publicEndpoints } = globalAuthEdgeFunctionProps;

  return Boolean(publicEndpoints[uri as ApiPath]?.includes(method as ApiMethod));
};
