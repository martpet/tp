import { Construct } from 'constructs';

import { Auth, Tables } from '~/constructs';
import { createEdgeFunction } from '~/constructs/utils';
import { appName } from '~/consts';

import { PublicEndpoints } from '../getPublicEndpoints';

declare global {
  var globalAuthEdgeFunctionProps: {
    authDomain: string;
    publicEndpoints: PublicEndpoints;
  };
}

type CreateAuthEdgeFunctionProps = {
  scope: Construct;
  auth: Auth;
  tables: Tables;
  publicEndpoints: PublicEndpoints;
};

export const createAuthEdgeFunction = ({
  scope,
  auth,
  tables,
  publicEndpoints,
}: CreateAuthEdgeFunctionProps) => {
  const fn = createEdgeFunction(scope, 'AuthEdgeFunction', {
    functionName: `${appName}-AuthEdge`,
    entry: `${__dirname}/lambda/authEdgeHandler.ts`,
    globalLambdaProps: {
      globalAuthEdgeFunctionProps: {
        authDomain: auth.authDomain,
        publicEndpoints,
      },
    },
  });

  tables.sessionsTable.grantReadData(fn);
  tables.sessionsTable.grantWriteData(fn);

  return fn;
};
