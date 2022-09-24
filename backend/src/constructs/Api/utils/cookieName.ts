import { ValueOf } from 'type-fest';

import { EndpointsCookies } from '~/constructs/Api/types';

export const cookieName = (name: ValueOf<EndpointsCookies>[number]) => name;
