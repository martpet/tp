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
      <Grid areas={['header', 'main', 'footer']}>
        <img
          alt={file.name}
          src={file.objectURL}
          onDragStart={handleDragStart}
          onLoad={handleImgLoaded}
          style={{
            width: '100%',
            gridArea: 'header / main / footer',
            display: 'block',
            borderRadius: 'var(--spectrum-alias-border-radius-regular)',
          }}
        />
        <TnumbnailOverlay gridArea="header / main / footer" file={file} />
        <ThumbnailRemoveButton gridArea="header" file={file} />
        <ThumbnailAlert gridArea="footer" file={file} />
      </Grid>
      {formattedDate && <Label marginTop="size-50">{formattedDate}</Label>}
    </div>
  );
}
