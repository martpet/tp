import { getPersonalDevDomain } from '~/common/utils';

export const appDomain = import.meta.env.DEV
  ? getPersonalDevDomain(import.meta.env)
  : window.location.hostname;
