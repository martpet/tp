import {
  CreateTopicCommand,
  DeleteTopicCommand,
  DeleteTopicCommandOutput,
  SNSClient,
  SubscribeCommand,
} from '@aws-sdk/client-sns';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';

import { itResolves, itSendsAwsCommand } from '~/constructs/Api/utils';

import { handler } from '../crossRegionSNSTopic.handler';

const snsMock = mockClient(SNSClient);

const args = [
  {
    PhysicalResourceId: 'dummyPhysicalResourceId',
    ResourceProperties: {
      region: 'dummyRegion',
      createTopicInput: 'dummyCreateTopicInput',
    },
  } as unknown as CloudFormationCustomResourceEvent,
] as Parameters<typeof handler>;

beforeEach(() => {
  snsMock.reset();

  snsMock.on(CreateTopicCommand).resolves({
    TopicArn: 'dummyTopicArn',
  });

  snsMock
    .on(DeleteTopicCommand)
    .resolves('dummyDeleteTopicCommandOutput' as unknown as DeleteTopicCommandOutput);
});

describe('crossRegionSNSTopic.handler', () => {
  itSendsAwsCommand(CreateTopicCommand, snsMock, handler, args);
  itResolves(handler, args);

  describe('when "subscribeInputs" is provided', () => {
    const argsClone = structuredClone(args);
    argsClone[0].ResourceProperties.subscribeInputs = [
      { subscribeKey1: 'subscribeValue1' },
      { subscribeKey2: 'subscribeValue2' },
    ];

    it('sends "SubscribeCommand" to SNS for each "subscribeInputs" item', async () => {
      await handler(...argsClone);
      expect(
        snsMock.commandCalls(SubscribeCommand).map((call) => call.args[0].input)
      ).toMatchSnapshot();
    });
  });

  describe('when "RequestType" is "Delete"', () => {
    const argsClone = structuredClone(args);
    argsClone[0].RequestType = 'Delete';
    itSendsAwsCommand(DeleteTopicCommand, snsMock, handler, argsClone);
    itResolves(handler, argsClone);
  });
});
