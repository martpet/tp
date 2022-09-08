import { FromApiPaths } from '~/types';

export type EndpointsEnvironemntsKeys = FromApiPaths<{
  '/login': 'authDomain' | 'clientId' | 'loginCallbackUrl';
  '/loginCallback': 'authDomain' | 'clientId' | 'loginCallbackUrl' | 'envName';
  '/logout':
    | 'authDomain'
    | 'clientId'
    | 'logoutCallbackUrl'
    | 'logoutCallbackLocalhostUrl'
    | 'envName';
}>;

export type EndpointsEnvironments<T extends keyof EndpointsEnvironemntsKeys> = Record<
  EndpointsEnvironemntsKeys[T],
  string
>;

export type ProcessEnv<T extends keyof EndpointsEnvironemntsKeys> = Partial<
  EndpointsEnvironments<T>
>;
