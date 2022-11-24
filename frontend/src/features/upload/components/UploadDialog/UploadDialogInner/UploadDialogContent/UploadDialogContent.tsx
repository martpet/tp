import { DropZone } from './DropZone';
import { ThumbnailsList } from './ThumbnailsList/ThumbnailsList';

export default function UploadDialogContent() {
  return (
    <DropZone>
      <ThumbnailsList />
    </DropZone>
  );
}
