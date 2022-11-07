import { Login, useMe } from '~/features/me';

import { DropZone } from './DropZone';
import { FilesPreview } from './FilesPreview/FilesPreview';

export default function UploadDialoContent() {
  const { me } = useMe();

  if (!me) {
    return <Login />;
  }

  return (
    <DropZone>
      <FilesPreview />
    </DropZone>
  );
}
