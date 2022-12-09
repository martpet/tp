import { Grid } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { DragEventHandler, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { removeDateStringOffset } from '~/common/utils';
import { FileMeta } from '~/features/upload';

import { ThumbnailAlert } from './ThumbnailAlert/ThumbnailAlert';
import { TnumbnailOverlay } from './ThumbnailOverlay/TnumbnailOverlay';
import { ThumbnailRemoveButton } from './ThumbnailRemoveButton';

type Props = {
  file: FileMeta;
  scollIntoView: boolean;
};

export function Thumbnail({ file, scollIntoView }: Props) {
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

    if (scollIntoView) {
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
        <TnumbnailOverlay gridColumn="1" gridRow="1" file={file} />
        <ThumbnailRemoveButton file={file} />
      </Grid>
      <ThumbnailAlert file={file} />
      {formattedDate && <Label marginTop="size-50">{formattedDate}</Label>}
    </div>
  );
}
