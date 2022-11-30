import { PostConfirmationTriggerHandler } from 'lambda-layer';

import { createUserFromCognitoEvent } from './createUserFromCognitoEvent';

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await createUserFromCognitoEvent(event);
  return event;
};
