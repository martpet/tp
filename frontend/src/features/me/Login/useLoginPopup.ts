import { apiPaths, apiUrl, loginPopupSuccessMessage } from '~/common/consts';
import { useAppDispatch } from '~/common/hooks';
import { IdentityProvider } from '~/common/types';
import { signedIn } from '~/features/me';

export const useLoginPopup = () => {
  const dispatch = useAppDispatch();

  const windowListener = ({ origin, source, data }: MessageEvent) => {
    if (origin === apiUrl && data === loginPopupSuccessMessage) {
      dispatch(signedIn());
      (source as WindowProxy).close();
      window.removeEventListener('message', windowListener);
    }
  };

  return (provider: IdentityProvider) => {
    const url = `${apiUrl}${apiPaths.login}?provider=${provider}`;
    const width = 600;
    const height = 650;
    const left = window.screenLeft + window.innerWidth / 2 - width / 2;
    const top = window.screenTop + window.innerHeight / 2 - height / 2;
    const options = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;
    window.open(url, 'loginpopup', options);
    window.addEventListener('message', windowListener);
  };
};
