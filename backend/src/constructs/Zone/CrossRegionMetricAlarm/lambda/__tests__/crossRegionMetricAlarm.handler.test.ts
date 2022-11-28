import {
  CloudWatchClient,
  DeleteAlarmsCommand,
  DeleteAlarmsCommandOutput,
  PutMetricAlarmCommand,
} from '@aws-sdk/client-cloudwatch';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';

import { itResolves } from '~/constructs/Api/utils';

import { handler } from '../crossRegionMetricAlarm.handler';

const cloudWatchMock = mockClient(CloudWatchClient);

const args = [
  {
    ResourceProperties: {
      region: 'dummyRegion',
      putMetricAlarmInput: {
        AlarmName: 'dummyAlarmName',
      },
    },
  } as unknown as CloudFormationCustomResourceEvent,
] as Parameters<typeof handler>;

beforeEach(() => {
  cloudWatchMock.reset();

  cloudWatchMock
    .on(DeleteAlarmsCommand)
    .resolves('dummyDeleteAlarmsCommandOutput' as unknown as DeleteAlarmsCommandOutput);
});

describe('crossRegionMetricAlarm.handler', () => {
  itResolves(handler, args);

  it('sends "PutMetricAlarmCommand" to CloudWatch with correct args', async () => {
    await handler(...args);
    expect(
      cloudWatchMock.commandCalls(PutMetricAlarmCommand)[0].args[0].input
    ).toMatchSnapshot();
  });

  describe('when "RequestType" is "Delete"', () => {
    const argsClone = structuredClone(args);
    argsClone[0].RequestType = 'Delete';

    it('sends "DeleteAlarmsCommand" to CloudWatch with correct args', async () => {
      await handler(...argsClone);
      expect(
        cloudWatchMock.commandCalls(DeleteAlarmsCommand)[0].args[0].input
      ).toMatchSnapshot();
    });

    it('resolves with correct output', () => {
      return expect(handler(...argsClone)).resolves.toMatchSnapshot();
    });
  });
});
