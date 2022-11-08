import { Login, useMe } from '~/features/me';

import { DropZone } from './DropZone';
import { ThumbnailsList } from './ThumbnailsList/ThumbnailsList';

export default function UploadDialoContent() {
  const { me } = useMe();

  if (!me) {
    return <Login />;
  }

  return (
    <DropZone>
      <ThumbnailsList />
    </DropZone>
  );
}
