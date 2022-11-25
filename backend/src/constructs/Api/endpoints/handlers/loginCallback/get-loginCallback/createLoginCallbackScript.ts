import { loginWindowSuccessData } from '~/consts';
import { EnvName } from '~/types';
import { createSha256CspHash } from '~/utils';

type CreateLoginCallbackScriptProps = {
  envName: EnvName;
  appDomain: string;
};

export const createLoginCallbackScript = ({
  envName,
  appDomain,
}: CreateLoginCallbackScriptProps) => {
  const targetOrigin = envName === 'personal' ? '*' : `https://${appDomain}`;
  const script = `opener.postMessage("${loginWindowSuccessData}", "${targetOrigin}")`;

  return { script, cspHash: createSha256CspHash(script) };
};
