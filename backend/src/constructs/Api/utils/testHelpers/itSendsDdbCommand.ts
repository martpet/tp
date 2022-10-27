import { AwsCommand, AwsStub } from 'aws-sdk-client-mock';

import { CallbackAndArgsTuple } from '~/types';

export const itSendsDdbCommand = async (
  command: new (param: any) => AwsCommand<any, any, any, any>,
  ddbMock: AwsStub<any, any>,
  ...rest: CallbackAndArgsTuple
) => {
  it(`sends "${command.name}" to DynamoDB with correct args`, async () => {
    const [callback, callbackArgs = []] = rest;
    await callback(...callbackArgs);
    expect(ddbMock.commandCalls(command)[0].args[0].input).toMatchSnapshot();
  });
};
