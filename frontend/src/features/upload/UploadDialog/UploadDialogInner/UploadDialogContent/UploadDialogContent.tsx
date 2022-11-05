import { useAppSelector } from '~/common/hooks';
import { Login, useMe } from '~/features/me';
import { selectFiles } from '~/features/upload';

import { DropZone } from './DropZone';
import { EmptyState } from './EmptyState';
import { Thumbnails } from './Thumbnails';

export default function UploadDialoContent() {
  const { me } = useMe();
  const files = useAppSelector(selectFiles);

  if (!me) {
    return <Login />;
  }

  if (!files.length) {
    return (
      <DropZone>
        <EmptyState />
      </DropZone>
    );
  }

  return (
    <DropZone>
      <Thumbnails />
    </DropZone>
  );
}
