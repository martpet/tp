import { createSha256CspHash, EnvName, loginWindowSuccessData } from 'lambda-layer';

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
