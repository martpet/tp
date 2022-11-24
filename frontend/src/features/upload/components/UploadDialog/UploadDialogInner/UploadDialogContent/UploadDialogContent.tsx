import { useSelector } from 'react-redux';

import { Login, selectMe } from '~/features/me';

import { DropZone } from './DropZone';
import { ThumbnailsList } from './ThumbnailsList/ThumbnailsList';

export default function UploadDialoContent() {
  const me = useSelector(selectMe);

  if (!me) {
    return <Login />;
  }

  return (
    <DropZone>
      <ThumbnailsList />
    </DropZone>
  );
}
