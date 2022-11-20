import { SetRequired } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiMethodOptions, DeepValues, envVarsKey } from '~/types';

type Routes = typeof apiOptions;
type EnvVarsKey = typeof envVarsKey;
type ApiMethodOptionsWithEnvVars = SetRequired<ApiMethodOptions, EnvVarsKey>;

export type ApiEnvVars = Record<DeepValues<Routes, EnvVarsKey>[number], string>;

export type HandlerEnv<
  Route extends keyof Routes,
  Method extends keyof Routes[Route]['methods'],
  MethodOptions = Routes[Route]['methods'][Method]
> = MethodOptions extends ApiMethodOptionsWithEnvVars
  ? Partial<Record<MethodOptions[EnvVarsKey][number], string>>
  : {};
