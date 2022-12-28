import { GetCredentialsForIdentityResponse } from '@aws-sdk/client-cognito-identity';
import { CamelCaseKeys } from 'camelcase-keys';

export type GetPublicCredentialsRequest = void;

export type GetPublicCredentialsResponse = CamelCaseKeys<
  NonNullable<GetCredentialsForIdentityResponse['Credentials']>
>;
