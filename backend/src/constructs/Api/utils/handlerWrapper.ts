import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handlerWrapper =
  (func: APIGatewayProxyHandlerV2) =>
  (...params: Parameters<APIGatewayProxyHandlerV2>) =>
    func(...params);
