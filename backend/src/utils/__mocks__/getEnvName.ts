import { EnvName } from '~/types';

const envName: EnvName = 'production';

export const getEnvName = vi.fn().mockName('getEnvName').mockReturnValue(envName);
