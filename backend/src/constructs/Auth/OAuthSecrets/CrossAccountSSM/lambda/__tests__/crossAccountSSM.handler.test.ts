import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';

import { itRejectsCorrectly, itResolvesCorrectly } from '~/constructs/Api/utils';
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
  } as unknown as CloudFormationCustomResourceEvent,
] as Parameters<typeof handler>;

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
  it('calls "getRoleCredentials" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(getRoleCredentials).mock.calls).toMatchSnapshot();
  });

  it('sends "GetParametersCommand" to SSM with correct args', async () => {
    await handler(...args);
    expect(ssmMock.commandCalls(GetParametersCommand)[0].args[0].input).toMatchSnapshot();
  });

  itResolvesCorrectly(handler, args);

  describe('when "getParametersInput.Names" is missing', () => {
    const argsClone = structuredClone(args);
    delete argsClone[0].ResourceProperties.getParametersInput.Names;
    itRejectsCorrectly(handler, argsClone);
  });

  describe('when "Parameters" is missing from "GetParametersCommand" output', () => {
    beforeEach(() => {
      ssmMock.on(GetParametersCommand).resolves({});
    });
    itRejectsCorrectly(handler, args);
  });

  describe('when "Parameters" are missing required values', () => {
    beforeEach(() => {
      ssmMock.on(GetParametersCommand).resolves({
        Parameters: [{ Name: 'dummyName' }],
      });
    });
    itRejectsCorrectly(handler, args);
  });
});
