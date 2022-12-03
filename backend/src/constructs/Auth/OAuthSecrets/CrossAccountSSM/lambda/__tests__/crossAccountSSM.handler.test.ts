import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itCalls,
  itRejects,
  itResolves,
  itSendsAwsCommand,
} from '~/constructs/Api/utils';
import { getRoleCredentials } from '~/utils';

import { handler } from '../crossAccountSSM.handler';

vi.mock('~/utils/getRoleCredentials');

const ssmMock = mockClient(SSMClient);

const args = [
  {
    ResourceProperties: {
      roleArn: 'dummyRoleArn',
      getParametersInput: {
        Names: ['dummyParameterName1', 'dummyParameterName2'],
      },
    },
  },
] as unknown as Parameters<typeof handler>;

beforeEach(() => {
  ssmMock.reset();

  ssmMock.on(GetParametersCommand).resolves({
    Parameters: [
      {
        Name: 'dummyParameterName2',
        Value: 'dummyParameterValue2',
      },
      {
        Name: 'dummyParameterName1',
        Value: 'dummyParameterValue1',
      },
    ],
  });
});

describe('crossAccountSSM.handler', () => {
  itCalls(getRoleCredentials, handler, args);
  itSendsAwsCommand(GetParametersCommand, ssmMock, handler, args);
  itResolves(handler, args);

  describe('when "getParametersInput.Names" is missing', () => {
    const argsClone = structuredClone(args);
    delete argsClone[0].ResourceProperties.getParametersInput.Names;
    itRejects(handler, argsClone);
  });

  describe('when "Parameters" is missing from "GetParametersCommand" output', () => {
    beforeEach(() => {
      ssmMock.on(GetParametersCommand).resolves({});
    });
    itRejects(handler, args);
  });

  describe('when "Parameters" are missing required values', () => {
    beforeEach(() => {
      ssmMock.on(GetParametersCommand).resolves({
        Parameters: [{ Name: 'dummyName' }],
      });
    });
    itRejects(handler, args);
  });
});
