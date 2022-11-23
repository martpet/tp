import { apiPaths, apiUrl, loginWindowSuccessMessage } from '~/common/consts';
import { IdentityProvider } from '~/common/types';

export function loginWithPopup(identityProvider: IdentityProvider) {
  const width = 600;
  const height = 650;
  const left = window.screenLeft + window.innerWidth / 2 - width / 2;
  const top = window.screenTop + window.innerHeight / 2 - height / 2;
  const popupWindowName = 'popupWindow';

  return new Promise<void>((resolve, reject) => {
    window.open(
      `${apiUrl}${apiPaths.login}?provider=${identityProvider}`,
      popupWindowName,
      `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    const listener = (event: MessageEvent) => {
      const source = event.source as WindowProxy;
      if (event.origin !== apiUrl) return;
      if (source.name !== popupWindowName) return;
      if (event.data !== loginWindowSuccessMessage) reject();

      resolve();
      source.close();
      window.removeEventListener('message', listener);
    };

    window.addEventListener('message', listener);
  });
}
