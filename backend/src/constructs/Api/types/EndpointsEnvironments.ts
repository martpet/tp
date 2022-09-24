import { OnlyApiPaths } from '~/types';

export type EndpointsEnvironemntsKeys = OnlyApiPaths<{
  '/login': 'authDomain' | 'clientId' | 'loginCallbackUrl';
  '/loginCallback': 'authDomain' | 'clientId' | 'loginCallbackUrl';
  '/logout':
    | 'authDomain'
    | 'clientId'
    | 'logoutCallbackUrl'
    | 'logoutCallbackLocalhostUrl';
}>;

export type EndpointsEnvironments<T extends keyof EndpointsEnvironemntsKeys> = Record<
  EndpointsEnvironemntsKeys[T],
  string
>;

export type ProcessEnv<T extends keyof EndpointsEnvironemntsKeys> = Partial<
  EndpointsEnvironments<T>
>;
