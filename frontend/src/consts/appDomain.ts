import { getPersonalDevDomain } from '~/utils';

const isDev = import.meta.env.DEV;

export const appDomain = isDev
  ? getPersonalDevDomain(import.meta.env)
  : window.location.hostname;
