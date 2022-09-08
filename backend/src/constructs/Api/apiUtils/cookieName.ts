import { ValueOf } from 'type-fest';

import { EndpointsCookies } from '../apiTypes';

export const cookieName = (name: ValueOf<EndpointsCookies>[number]) => name;
