import { apiPaths, apiUrl, loginWindowSuccessData } from '~/common/consts';
import { IdentityProvider } from '~/common/types';

export function loginInPopupWindow(provider: IdentityProvider) {
  const url = `${apiUrl}${apiPaths.login}?provider=${provider}`;
  const target = 'loginWindow';
  const width = 600;
  const height = 650;
  const top = window.screenTop + window.innerHeight / 2 - height / 2;
  const left = window.screenLeft + window.innerWidth / 2 - width / 2;
  const features = `width=${width}, height=${height}, top=${top}, left=${left}, toolbar=no, menubar=no`;

  return new Promise<void>((resolve) => {
    const loginWindow = window.open(url, target, features);

    const listener = ({ origin, data }: MessageEvent) => {
      if (origin !== apiUrl || data !== loginWindowSuccessData) return;
      resolve();
      loginWindow?.close();
      window.removeEventListener('message', listener);
    };

    window.addEventListener('message', listener);
  });
}
