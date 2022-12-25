import { SetRequired } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiMethodOptions, DeepValues } from '~/types';

type A = typeof apiOptions;

export type EnvVars<
  R extends keyof A,
  M extends keyof A[R]['methods'],
  O = A[R]['methods'][M]
> = O extends SetRequired<ApiMethodOptions, 'envVars'>
  ? Partial<Record<O['envVars'][number], string>>
  : {};

export type AllEnvVars = Record<DeepValues<A, 'envVars'>[number], string>;
