import { LambdaEdgeViewerEvent } from '~/constructs/Api/types';

export const checkIsPublicEndpoint = (event: LambdaEdgeViewerEvent) => {
  const { uri, method } = event.Records[0].cf.request;
  const { publicEndpoints } = globalAuthEdgeFunctionProps;

  return Boolean(publicEndpoints[uri]?.includes(method));
};
