import { IdentityProvider } from '../IdentityProvider';
import { UserSettings } from '../UserSettings';

export type UsersTableItem = UserPropsFromCognito & {
  settings: UserSettings;
};

export type UserPropsFromCognito = {
  id: string;
  providerName: IdentityProvider;
  givenName: string;
  familyName: string;
  picture?: string;
  email: string;
  dateCreated: number;
};
