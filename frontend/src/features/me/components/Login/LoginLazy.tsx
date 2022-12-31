import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const loginImport = import('./Login/Login');
const Login = lazy(() => loginImport);

type Props = {
  onLoginButtonClick?: () => void;
};

export function LoginLazy({ onLoginButtonClick }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Login onLoginButtonClick={onLoginButtonClick} />
    </Suspense>
  );
}
