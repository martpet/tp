import { apiSubdomain } from '~/consts';
import { getPersonalDevDomain } from '~/utils';

const domain = import.meta.env.DEV
  ? getPersonalDevDomain(import.meta.env)
  : window.location.hostname;

export const apiUrl = `https://${apiSubdomain}.${domain}`;
