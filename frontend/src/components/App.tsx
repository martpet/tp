import { MouseEventHandler } from 'react';

import { apiPaths, apiUrl, loginPopupSuccessMessage } from '~/consts';
import { IdentityProviderName } from '~/types';

export function App() {
  return (
    <>
      <p>
        <LoginButton provider="Google" />
      </p>
      <p>
        <LoginButton provider="SignInWithApple" />
      </p>
      <p>
        <a href={`${apiUrl}${apiPaths.logout}`}>logout</a>
      </p>
      <a href={`${apiUrl}${apiPaths.me}`}>me</a>
    </>
  );
}

function LoginButton({ provider }: { provider: IdentityProviderName }) {
  const popupMessageListener = ({ origin, source, data }: MessageEvent) => {
    if (origin === apiUrl && data === loginPopupSuccessMessage) {
      (source as WindowProxy).close();
      window.removeEventListener('message', popupMessageListener);
    }
  };

  const openPopup = () => {
    const url = `${apiUrl}${apiPaths.login}?provider=${provider}`;
    const width = 600;
    const height = 650;
    const left = window.screenLeft + window.innerWidth / 2 - width / 2;
    const top = window.screenTop + window.innerHeight / 2 - height / 2;
    const options = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;
    window.open(url, 'loginpopup', options);
    window.addEventListener('message', popupMessageListener);
  };

  const clickHandler: MouseEventHandler<HTMLButtonElement> = () => {
    openPopup();
  };

  return (
    <button type="button" onClick={clickHandler}>
      {provider}
    </button>
  );
}
