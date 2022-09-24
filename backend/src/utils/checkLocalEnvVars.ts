import { EnvName } from '~/types';

export const checkLocalEnvVars = (envName: EnvName) => {
  const names = [
    'VITE_PERSONAL_SUBDOMAIN',
    'PERSONAL_DEV_ACCOUNT_ID',
    'PERSONAL_DEV_ACCOUNT_REGION',
  ];
  if (envName === 'personal') {
    names.forEach((varName) => {
      if (!process.env[varName]) {
        throw new Error(`Environment variable "${varName}" is missing from .env.local`);
      }
    });
  }
};
