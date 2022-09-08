import {
  CreateTopicCommand,
  DeleteTopicCommand,
  DeleteTopicCommandOutput,
  SNSClient,
  SubscribeCommand,
} from '@aws-sdk/client-sns';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';

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
] as const;

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
  it('sends "CreateTopicCommand" to SNS with correct args', async () => {
    await handler(...args);
    expect(snsMock.commandCalls(CreateTopicCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toMatchSnapshot();
  });

  describe('when "subscribeInputs" is provided', () => {
    const argsClone = structuredClone(args);
    argsClone[0].ResourceProperties.subscribeInputs = [
      {
        subscribeKey1: 'subscribeValue1',
      },
      {
        subscribeKey2: 'subscribeValue2',
      },
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

    it('sends "DeleteTopicCommand" to SNS with correct args', async () => {
      await handler(...argsClone);
      expect(snsMock.commandCalls(DeleteTopicCommand)[0].args[0].input).toMatchSnapshot();
    });

    it('resolves with a correct value', () => {
      expect(handler(...argsClone)).resolves.toMatchSnapshot();
    });
  });
});
