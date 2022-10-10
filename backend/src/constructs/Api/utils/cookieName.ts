import { AllEndpointsCookies } from '~/constructs/Api/types';

export const cookieName = (name: keyof AllEndpointsCookies) => name;
