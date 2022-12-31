import { Signer } from '@aws-amplify/core';
import { RequestParameters } from 'mapbox-gl';

import { AWSCredentials } from '~/common/types';

export const transformRequest =
  (credentials: AWSCredentials) =>
  (originalUrl: string): RequestParameters => {
    let url = originalUrl;

    if (url.includes('amazonaws.com')) {
      url = Signer.signUrl(url, credentials);
    }

    return { url };
  };
