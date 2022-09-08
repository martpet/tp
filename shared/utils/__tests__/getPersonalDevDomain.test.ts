import { getPersonalDevDomain } from '~/utils';

const subdomainKey = 'VITE_PERSONAL_SUBDOMAIN';
const subDomainObj = { [subdomainKey]: 'john' };

const frontendArg = {
  DEV: true,
  ...subDomainObj,
};

const backendArg = {
  NODE_ENV: 'development',
  ...subDomainObj,
};

describe('getPersonalDevDomain', () => {
  describe('when called from frontend', () => {
    beforeEach(() => {
      (global as any).window = {};
    });

    it('returns a correct value', () => {
      expect(getPersonalDevDomain(frontendArg)).toMatchSnapshot();
    });

    it('returns empty string if "DEV" env var is missing', () => {
      const frontendArgClone = structuredClone(frontendArg);
      frontendArgClone.DEV = false;
      expect(getPersonalDevDomain(frontendArgClone)).toBe('');
    });

    it('throws if the subdomain env var is missing', () => {
      const frontendArgClone = structuredClone(frontendArg);
      frontendArgClone[subdomainKey] = '';
      expect(() => {
        getPersonalDevDomain(frontendArgClone);
      }).toThrow(`"${subdomainKey}" missing in .env.local`);
    });
  });

  describe('when called from backend', () => {
    beforeEach(() => {
      (global as any).window = undefined;
    });

    it('returns a correct value', () => {
      expect(getPersonalDevDomain(backendArg)).toMatchSnapshot();
    });

    it('returns empty string if "NODE_ENV" env var is not "development"', () => {
      const backendArgClone = structuredClone(backendArg);
      backendArgClone.NODE_ENV = 'other';
      expect(getPersonalDevDomain(backendArgClone)).toBe('');
    });
  });
});
