import { useAppSelector } from '~/common/hooks';
import { Login, selectMe } from '~/features/me';

export default function UploadContent() {
  const me = useAppSelector(selectMe);

  if (!me) {
    return <Login />;
  }

  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
  return <>todo</>;
}
