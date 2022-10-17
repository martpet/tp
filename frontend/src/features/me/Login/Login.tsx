import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const promise = import('./LoginContent');
const LoginContent = lazy(() => promise);

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
