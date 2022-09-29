import { IdentityProviderName } from '../IdentityProviderName';

export type UsersTableItem = {
  id: string;
  providerName: IdentityProviderName;
  givenName: string;
  familyName: string;
  picture?: string;
  email: string;
  dateCreated: number;
};

export type UserPropsFromCognitoEvent = Pick<
  UsersTableItem,
  'id' | 'providerName' | 'givenName' | 'familyName' | 'picture' | 'email' | 'dateCreated'
>;
