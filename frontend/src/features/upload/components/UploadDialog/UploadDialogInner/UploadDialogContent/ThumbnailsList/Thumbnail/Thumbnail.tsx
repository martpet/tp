import { View } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { DragEventHandler, RefObject, useRef } from 'react';
import { useIntl } from 'react-intl';

import { removeDateStringOffset } from '~/common/utils';
import { FileMeta } from '~/features/upload/types';

import { ThumbnailError } from './ThumbnailError/ThumbnailError';
import { ThumbnailRemoveButton } from './ThumbnailRemoveButton';

type Props = {
  file: FileMeta;
  onImgLoad(id: string, ref: RefObject<HTMLDivElement>): void;
};

export function Thumbnail({ file, onImgLoad }: Props) {
  const { formatDate } = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);

  const formattedDate =
    file.exif.dateTimeOriginal &&
    formatDate(removeDateStringOffset(file.exif.dateTimeOriginal), {
      dateStyle: 'long',
    });

  const handleDragStart: DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleImgLoad = () => {
    onImgLoad(file.id, containerRef);
  };

  return (
    <div ref={containerRef}>
      <View position="relative">
        <img
          alt={file.name}
          src={file.objectURL}
          onDragStart={handleDragStart}
          onLoad={handleImgLoad}
          style={{
            width: '100%',
            gridColumn: '1',
            gridRow: '1',
            display: 'block',
          }}
        />
        <ThumbnailRemoveButton file={file} />
      </View>
      <ThumbnailError file={file} />
      {formattedDate && <Label marginTop="size-50">{formattedDate}</Label>}
    </div>
  );
}
