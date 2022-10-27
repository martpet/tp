import { ColorScheme as SpectrumColorScheme } from '@react-types/provider';

import { languages } from '../../consts/languages';

export type UsersTableItem = UserPropsFromCognito & {
  settings: UserSettings;
};

export type UserPropsFromCognito = {
  id: string;
  providerName: IdentityProviderName;
  givenName: string;
  familyName: string;
  picture?: string;
  email: string;
  dateCreated: number;
};

export type IdentityProviderName = 'SignInWithApple' | 'Google';

export type UserSettings = {
  language?: Language;
  colorScheme?: ColorScheme;
  toolbarPosition?: 'top' | 'left';
};

export type Language = typeof languages[number];
export type ColorScheme = SpectrumColorScheme | 'os';
export type ToolbarPosition = 'top' | 'left';
