import { AllApiRoutesCookies } from '~/constructs/Api/types';

export const cookieName = (name: keyof AllApiRoutesCookies) => name;
