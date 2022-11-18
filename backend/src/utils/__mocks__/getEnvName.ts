import { EnvName } from '~/types';

const envName: EnvName = 'production';

export const getEnvName = vi.fn().mockReturnValue(envName);
