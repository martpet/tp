import {
  CloudFormationCustomResourceEvent,
  CreateTopicCommand,
  CreateTopicCommandInput,
  DeleteTopicCommand,
  SNSClient,
  SubscribeCommand,
  SubscribeCommandInput,
} from 'lambda-layer';

export type ResourceProps = {
  region: string;
  createTopicInput: CreateTopicCommandInput & {
    Name: string;
  };
  subscribeInputs?: Array<Omit<SubscribeCommandInput, 'TopicArn'>>;
};

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  const { region, createTopicInput, subscribeInputs } =
    event.ResourceProperties as unknown as ResourceProps;

  const snsClient = new SNSClient({ region });

  if (event.RequestType === 'Delete') {
    const TopicArn = event.PhysicalResourceId;
    return snsClient.send(new DeleteTopicCommand({ TopicArn }));
  }

  const { TopicArn } = await snsClient.send(new CreateTopicCommand(createTopicInput));

  if (subscribeInputs) {
    await Promise.all(
      subscribeInputs.map((subscribeInput) => {
        return snsClient.send(new SubscribeCommand({ ...subscribeInput, TopicArn }));
      })
    );
  }

  return {
    PhysicalResourceId: TopicArn,
    Data: { TopicArn },
  };
};
