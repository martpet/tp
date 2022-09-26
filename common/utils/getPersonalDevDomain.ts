import { rootDomain } from '../consts/commonConsts';

const subdomainKey = 'VITE_PERSONAL_SUBDOMAIN';

export const getPersonalDevDomain = (env: any) => {
  // @ts-ignore
  const isBrowser = typeof window !== 'undefined';

  if ((isBrowser && !env.DEV) || (!isBrowser && env.NODE_ENV !== 'development')) {
    return '';
  }

  const subdomain = env[subdomainKey];

  if (!subdomain) {
    throw Error(`"${subdomainKey}" missing in .env.local`);
  }

  const sanitizedSubdomain = subdomain.replace(/_|-$|\.|\*|\\|\//gi, '');

  return `${sanitizedSubdomain}.dev.${rootDomain}`;
};
