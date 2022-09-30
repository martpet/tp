import { apiPaths, apiUrl } from '~/common/consts';
import { useAppDispatch, useAppSelector, useLoginPopup } from '~/common/hooks';
import { IdentityProviderName } from '~/common/types';
import { selectMe, signedOut } from '~/features/me';

export function App() {
  const me = useAppSelector(selectMe);

  return me ? (
    <>
      <strong>{me.givenName}</strong>
      <LogoutButton />
    </>
  ) : (
    <>
      <LoginButton provider="Google" />
      <LoginButton provider="SignInWithApple" />
    </>
  );
}

function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    await dispatch(signedOut());
    window.location.href = apiUrl + apiPaths.logout;
  };

  return (
    <button type="button" onClick={handleClick}>
      Logout
    </button>
  );
}

function LoginButton({ provider }: { provider: IdentityProviderName }) {
  const login = useLoginPopup();

  const handleClick = () => {
    login(provider);
  };

  return (
    <button type="button" onClick={handleClick}>
      {provider}
    </button>
  );
}
