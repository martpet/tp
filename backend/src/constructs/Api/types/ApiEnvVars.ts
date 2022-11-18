import { SetRequired } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiMethodOptions, DeepValues, envVarsKey } from '~/types';

type Routes = typeof apiOptions;
type EnvVarsKey = typeof envVarsKey;
type ApiMethodOptionsWithEnvVars = SetRequired<ApiMethodOptions, EnvVarsKey>;

export type ApiEnvVars = Record<DeepValues<Routes, EnvVarsKey>[number], string>;

export type HandlerEnvVars<
  Path extends keyof Routes,
  Method extends keyof Routes[Path]['methods'],
  MethodOptions = Routes[Path]['methods'][Method]
> = MethodOptions extends ApiMethodOptionsWithEnvVars
  ? Record<MethodOptions[EnvVarsKey][number], string>
  : {};
