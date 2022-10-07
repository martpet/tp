import { PostConfirmationTriggerHandler } from 'aws-lambda';

import { createUserFromCognitoEvent } from './createUserFromCognitoEvent';

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await createUserFromCognitoEvent(event);
  return event;
};
