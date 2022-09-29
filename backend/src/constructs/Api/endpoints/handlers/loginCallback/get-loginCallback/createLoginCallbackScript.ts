import { loginPopupSuccessMessage } from '~/consts';
import { EnvName } from '~/types';
import { createSha256CspHash } from '~/utils/createSha256CspHash';

type CreateLoginCallbackScriptProps = {
  envName: EnvName;
  appDomain: string;
};

export const createLoginCallbackScript = ({
  envName,
  appDomain,
}: CreateLoginCallbackScriptProps) => {
  const postMessageTargetOrigin = envName === 'personal' ? '*' : `https://${appDomain}}`;
  const script = `opener.postMessage("${loginPopupSuccessMessage}", "${postMessageTargetOrigin}")`;

  return {
    script,
    cspHash: createSha256CspHash(script),
  };
};
