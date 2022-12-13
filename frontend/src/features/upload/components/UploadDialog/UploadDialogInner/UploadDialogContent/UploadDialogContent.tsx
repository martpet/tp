import { DropZone } from './DropZone';
import { ThumbnailsList } from './ThumbnailsList/ThumbnailsList';
import { UploadAlerts } from './UploadAlerts';

export default function UploadDialogContent() {
  return (
    <DropZone>
      <UploadAlerts />
      <ThumbnailsList />
    </DropZone>
  );
}
