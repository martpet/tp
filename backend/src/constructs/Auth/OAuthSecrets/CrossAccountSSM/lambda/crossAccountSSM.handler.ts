import {
  GetParametersCommand,
  GetParametersCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';

import { getRoleCredentials } from '~/utils';

export type ResourceProps = {
  roleArn: string;
  getParametersInput: GetParametersCommandInput;
};

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  const { roleArn, getParametersInput } =
    event.ResourceProperties as unknown as ResourceProps;

  const inputParametersNames = getParametersInput.Names;

  if (!inputParametersNames) {
    throw Error('Missing input parameters names');
  }

  const credentials = await getRoleCredentials(roleArn, 'cross-account-ssm');
  const ssmClient = new SSMClient({ credentials });

  const { Parameters: outputParameters } = await ssmClient.send(
    new GetParametersCommand(getParametersInput)
  );

  if (!outputParameters) {
    throw Error('No output parameters');
  }

  outputParameters.sort(
    (paramA, paramB) =>
      inputParametersNames.indexOf(paramA.Name!) -
      inputParametersNames.indexOf(paramB.Name!)
  );

  return {
    Data: {
      values: outputParameters.map(({ Value }) => Value),
    },
  };
};
