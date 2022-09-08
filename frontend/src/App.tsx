import { apiPaths, apiSubdomain } from '~/consts';
import { IdentityProviderName } from '~/types';
import { getPersonalDevDomain } from '~/utils';

const isDev = import.meta.env.DEV;
const devDomain = getPersonalDevDomain(import.meta.env);
const appUrl = `https://${apiSubdomain}.${isDev ? devDomain : window.location.hostname}`;
const logoutPath = `${appUrl}${apiPaths.logout}`;

function loginPath(provider: IdentityProviderName) {
  const url = new URL(appUrl);
  const params = new URLSearchParams({ provider });
  url.pathname = apiPaths.login;
  url.search = params.toString();
  return url.href;
}

export function App() {
  return (
    <>
      <p>
        <a href={loginPath('Google')}>Google</a>
      </p>
      <p>
        <a href={loginPath('SignInWithApple')}>Apple</a>
      </p>
      <p>
        <a href={logoutPath}>logout</a>
      </p>
    </>
  );
}
