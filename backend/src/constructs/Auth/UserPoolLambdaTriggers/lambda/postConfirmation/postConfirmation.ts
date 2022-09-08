import { PostConfirmationTriggerHandler } from 'aws-lambda';

import { createUserFromEvent } from './createUserFromEvent';

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await createUserFromEvent(event);
  return event;
};
