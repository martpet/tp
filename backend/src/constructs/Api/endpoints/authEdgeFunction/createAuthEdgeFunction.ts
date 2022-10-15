import { Construct } from 'constructs';

import { Auth, Tables } from '~/constructs';
import { createEdgeFunction } from '~/constructs/utils';

declare global {
  var globalAuthEdgeFunctionProps: {
    authDomain: string;
  };
}

type Props = {
  scope: Construct;
  auth: Auth;
  tables: Tables;
};

export const createAuthEdgeFunction = ({ scope, auth, tables }: Props) => {
  const edgeFunction = createEdgeFunction(scope, 'AuthEdge', {
    functionName: `AuthEdge`,
    entry: `${__dirname}/lambda/authEdgeHandler.ts`,
    globalProps: {
      globalAuthEdgeFunctionProps: {
        authDomain: auth.authDomain,
      },
    },
  });

  tables.sessionsTable.grantReadData(edgeFunction);
  tables.sessionsTable.grantWriteData(edgeFunction);

  return edgeFunction;
};
