import { PostAuthenticationTriggerHandler } from 'aws-lambda';

import { updateUserFromCognitoEvent } from './updateUserFromCognitoEvent';

export const handler: PostAuthenticationTriggerHandler = async (event) => {
  await updateUserFromCognitoEvent(event);
  return event;
};
