import { ValueOf } from 'type-fest';

import { apiPaths } from '../consts';

export type ApiPath = ValueOf<typeof apiPaths>;
