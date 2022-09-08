import { PostAuthenticationTriggerHandler } from 'aws-lambda';

import { updateUserFromEvent } from './updateUserFromEvent';

export const handler: PostAuthenticationTriggerHandler = async (event) => {
  await updateUserFromEvent(event);
  return event;
};
