import {
  CloudFormationCustomResourceEvent,
  CloudWatchClient,
  DeleteAlarmsCommand,
  PutMetricAlarmCommand,
  PutMetricAlarmCommandInput,
} from 'lambda-layer';

export type ResourceProps = {
  region: string;
  putMetricAlarmInput: PutMetricAlarmCommandInput & {
    AlarmName: string;
  };
};

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  const { region, putMetricAlarmInput } =
    event.ResourceProperties as unknown as ResourceProps;

  const cloudWatchClient = new CloudWatchClient({ region });

  const { AlarmName } = putMetricAlarmInput;

  if (event.RequestType === 'Delete') {
    return cloudWatchClient.send(new DeleteAlarmsCommand({ AlarmNames: [AlarmName] }));
  }

  await cloudWatchClient.send(new PutMetricAlarmCommand(putMetricAlarmInput));

  return {
    PhysicalResourceId: AlarmName,
  };
};
