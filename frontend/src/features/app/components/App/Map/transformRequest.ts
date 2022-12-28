import { Signer } from '@aws-amplify/core';
import { RequestParameters, ResourceType } from 'mapbox-gl';

import { region } from '~/common/consts';
import { GetPublicCredentialsResponse } from '~/common/types';

export const transformRequest =
  (credentials: GetPublicCredentialsResponse) =>
  (originalUrl: string, resourceType: ResourceType): RequestParameters => {
    let url = originalUrl;

    if (resourceType === 'Style' && !url.includes('://')) {
      url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
    }

    if (url.includes('amazonaws.com')) {
      return {
        url: Signer.signUrl(url, {
          access_key: credentials.accessKeyId,
          secret_key: credentials.secretKey,
          session_token: credentials.sessionToken,
        }),
      };
    }

    return { url };
  };
