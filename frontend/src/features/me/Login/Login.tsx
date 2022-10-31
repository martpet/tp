import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./LoginContent');
const LoginContent = lazy(() => modulePromise);

type Props = {
  onLoginButtonClick?: () => void;
};

export function Login({ onLoginButtonClick }: Props) {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <LoginContent onLoginButtonClick={onLoginButtonClick} />
    </Suspense>
  );
}
