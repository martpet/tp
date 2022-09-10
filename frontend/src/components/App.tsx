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
    const popupWidth = 600;
    const left = window.screen.width / 2 - popupWidth / 2;
    const options = `toolbar=no, menubar=no, width=${popupWidth}, height=650, top=100, left=${left}`;
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
