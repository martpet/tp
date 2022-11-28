import { AwsCommand, AwsStub } from 'aws-sdk-client-mock';

import { CallbackAndArgsTuple } from '~/types';

export async function itSendsDdbCommand(
  command: new (param: any) => AwsCommand<any, any, any, any>,
  ddbMock: AwsStub<any, any>,
  ...rest: CallbackAndArgsTuple
) {
  it(`sends "${command.name}" to DynamoDB with correct args`, async () => {
    const [handler, handlerArgs = []] = rest;
    await handler(...handlerArgs);
    expect(ddbMock.commandCalls(command)[0].args[0].input).toMatchSnapshot();
  });
}
