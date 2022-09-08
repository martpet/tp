import { PostAuthenticationTriggerEvent, PostConfirmationTriggerEvent } from 'aws-lambda';

import {
  CognitoIdentity,
  IdentityProviderName,
  UserPropsFromCognitoEvent,
} from '~/types';

type TriggerEvent = PostConfirmationTriggerEvent | PostAuthenticationTriggerEvent;

export const getUserPropsFromCognitoEvent = (
  event: TriggerEvent
): UserPropsFromCognitoEvent => {
  const { userAttributes } = event.request;
  const identity = JSON.parse(userAttributes.identities)[0] as CognitoIdentity;

  return {
    id: userAttributes.sub,
    providerName: identity.providerName as IdentityProviderName,
    givenName: userAttributes.given_name,
    familyName: userAttributes.family_name,
    picture: userAttributes.picture as string | undefined,
    email: userAttributes.email,
    dateCreated: identity.dateCreated,
  };
};
