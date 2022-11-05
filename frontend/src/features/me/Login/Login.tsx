import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./LoginInner/LoginInner');
const LoginInner = lazy(() => modulePromise);

type Props = {
  onLoginButtonClick?: () => void;
};

export function Login({ onLoginButtonClick }: Props) {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <LoginInner onLoginButtonClick={onLoginButtonClick} />
    </Suspense>
  );
}
