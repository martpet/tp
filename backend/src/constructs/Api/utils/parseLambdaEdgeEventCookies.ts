import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { LambdaEdgeViewerEvent } from '~/constructs/Api/types';
import { parseEventCookies } from '~/constructs/Api/utils';

export const parseLambdaEdgeEventCookies = (edgeEvent: LambdaEdgeViewerEvent) => {
  const { request } = edgeEvent.Records[0].cf;
  const cookies = request.headers.cookie?.map(({ value }) => value);
  const apiGatewayEvent = { cookies } as unknown as APIGatewayProxyEventV2;

  return parseEventCookies(apiGatewayEvent);
};
