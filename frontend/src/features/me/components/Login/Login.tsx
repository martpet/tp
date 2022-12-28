import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const loginImport = import('./LoginInner/LoginInner');
const LoginInner = lazy(() => loginImport);

type Props = {
  onLoginButtonClick?: () => void;
};

export function Login({ onLoginButtonClick }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <LoginInner onLoginButtonClick={onLoginButtonClick} />
    </Suspense>
  );
}
