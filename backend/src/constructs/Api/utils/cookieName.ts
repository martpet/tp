import { AllCookies } from '~/constructs/Api/types';

export const cookieName = (name: keyof AllCookies) => name;
