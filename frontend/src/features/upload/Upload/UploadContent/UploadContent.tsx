import { Login, useMe } from '~/features/me';

export default function UploadContent() {
  const { me } = useMe();

  if (!me) {
    return <Login />;
  }

  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
  return <>todo</>;
}
