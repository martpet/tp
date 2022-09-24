import { LambdaEdgeResponse } from '~/constructs/Api/types';

export type LambdaEdgeViewerRequestHandler = (
  event: LambdaEdgeViewerEvent
) => Promise<LambdaEdgeViewerRequest | LambdaEdgeResponse>;

export type LambdaEdgeViewerEvent = {
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: string;
          distributionId: string;
          eventType: 'viewer-request';
          requestId: string;
        };
        request: LambdaEdgeViewerRequest;
      };
    }
  ];
};

type LambdaEdgeViewerRequest = {
  clientIp: string;
  headers: {
    host: [
      {
        key: 'Host';
        value: string;
      }
    ];
    'user-agent': [
      {
        key: 'User-Agent';
        value: string;
      }
    ];
    accept: [
      {
        key: 'accept';
        value: string;
      }
    ];
    'accept-language': [
      {
        key: 'accept-language';
        value: string;
      }
    ];
    referer: [
      {
        key: 'referer';
        value: string;
      }
    ];
    cookie?: [
      {
        key?: string;
        value: string;
      }
    ];
    authorization?: [
      {
        key?: string;
        value: string;
      }
    ];
  };
  method: string;
  querystring: string;
  uri: string;
};
