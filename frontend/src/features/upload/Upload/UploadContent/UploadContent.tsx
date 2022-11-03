import { Login, useMe } from '~/features/me';

import { DropZone } from './DropZone';
import { EmptyState } from './EmptyState';

export default function UploadContent() {
  const { me } = useMe();

  if (!me) {
    return <Login />;
  }

  return (
    <DropZone>
      <EmptyState />
    </DropZone>
  );
}
