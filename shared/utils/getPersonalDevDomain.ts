import { rootDomain } from '../consts/sharedConsts';

const subdomainKey = 'VITE_PERSONAL_SUBDOMAIN';

export const getPersonalDevDomain = (env: any) => {
  // @ts-ignore
  const isBrowser = typeof window !== 'undefined';

  if (
    (isBrowser && !env.DEV) ||
    (!isBrowser && !['development', 'test'].includes(env.NODE_ENV))
  ) {
    return '';
  }

  const subdomain = env[subdomainKey];

  if (!subdomain) {
    throw Error(`"${subdomainKey}" missing in .env.local`);
  }

  const sanitizedSubdomain = subdomain.replace(/_|-$|\.|\*|\\|\//gi, '');

  return `${sanitizedSubdomain}.dev.${rootDomain}`;
};
