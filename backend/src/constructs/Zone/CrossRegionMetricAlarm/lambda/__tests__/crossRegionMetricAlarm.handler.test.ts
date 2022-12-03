import {
  CloudWatchClient,
  DeleteAlarmsCommand,
  DeleteAlarmsCommandOutput,
  PutMetricAlarmCommand,
} from '@aws-sdk/client-cloudwatch';
import { mockClient } from 'aws-sdk-client-mock';

import { itResolves, itSendsAwsCommand } from '~/constructs/Api/utils';

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
  },
] as unknown as Parameters<typeof handler>;

beforeEach(() => {
  cloudWatchMock.reset();

  cloudWatchMock
    .on(DeleteAlarmsCommand)
    .resolves('dummyDeleteAlarmsCommandOutput' as unknown as DeleteAlarmsCommandOutput);
});

describe('crossRegionMetricAlarm.handler', () => {
  itSendsAwsCommand(PutMetricAlarmCommand, cloudWatchMock, handler, args);
  itResolves(handler, args);

  describe('when "RequestType" is "Delete"', () => {
    const argsClone = structuredClone(args);
    argsClone[0].RequestType = 'Delete';
    itSendsAwsCommand(DeleteAlarmsCommand, cloudWatchMock, handler, argsClone);
    itResolves(handler, argsClone);
  });
});
