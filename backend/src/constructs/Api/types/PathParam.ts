import { SetRequired } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiMethodOptions } from '~/types';

type A = typeof apiOptions;

export type PathParam<
  R extends keyof A,
  M extends keyof A[R]['methods'],
  O = A[R]['methods'][M]
> = O extends SetRequired<ApiMethodOptions, 'pathParam'>
  ? Partial<Record<O['pathParam'], string>>
  : {};
