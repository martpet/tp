import { Grid } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { DragEventHandler, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { removeDateStringOffset } from '~/common/utils';
import { selectFiles } from '~/features/upload';
import { FileMeta } from '~/features/upload/types';

import { ThumbnailAlert } from './ThumbnailAlert/ThumbnailAlert';
import { ThumbnailRemoveButton } from './ThumbnailRemoveButton';
import { ThumbnailOverlay } from './TnumbnailOverlay';

type Props = {
  file: FileMeta;
  didAddFilesSinceDialogOpen: boolean;
};

export function Thumbnail({ file, didAddFilesSinceDialogOpen }: Props) {
  const files = useSelector(selectFiles);
  const isLastFile = file === files.at(-1);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const { formatDate } = useIntl();

  const formattedDate =
    file.exif.dateTimeOriginal &&
    formatDate(removeDateStringOffset(file.exif.dateTimeOriginal), {
      dateStyle: 'long',
    });

  const handleDragStart: DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleImgLoaded = () => {
    setImageLoaded(true);

    if (isLastFile && didAddFilesSinceDialogOpen) {
      requestAnimationFrame(() => {
        container.current?.scrollIntoView({
          block: 'end',
          behavior: 'smooth',
        });
      });
    }
  };

  return (
    <div ref={container} style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }}>
      <Grid position="relative">
        <img
          alt={file.name}
          src={file.objectURL}
          onDragStart={handleDragStart}
          onLoad={handleImgLoaded}
          style={{
            width: '100%',
            gridColumn: '1',
            gridRow: '1',
            display: 'block',
          }}
        />
        <ThumbnailOverlay gridColumn="1" gridRow="1" />
        <ThumbnailRemoveButton file={file} />
      </Grid>
      <ThumbnailAlert file={file} />
      {formattedDate && <Label marginTop="size-50">{formattedDate}</Label>}
    </div>
  );
}
