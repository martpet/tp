import { View } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { DragEventHandler } from 'react';
import { useIntl } from 'react-intl';

import { removeDateStringOffset } from '~/common/utils';
import { FileMeta } from '~/features/upload/types';

import { ThumbnailError } from './ThumbnailError/ThumbnailError';
import { ThumbnailRemoveButton } from './ThumbnailRemoveButton';

type Props = {
  file: FileMeta;
};

export function Thumbnail({ file }: Props) {
  const { formatDate } = useIntl();

  const formattedDate =
    file.exif.dateTimeOriginal &&
    formatDate(removeDateStringOffset(file.exif.dateTimeOriginal), {
      dateStyle: 'long',
    });

  const preventDrag: DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      <View position="relative">
        <img
          alt={file.name}
          src={file.objectURL}
          onDragStart={preventDrag}
          style={{
            width: '100%',
            gridColumn: '1',
            gridRow: '1',
            display: 'block'
          }}
        />
        <ThumbnailRemoveButton file={file} />
      </View>
      <ThumbnailError file={file} />
      {formattedDate && <Label marginTop="size-50">{formattedDate}</Label>}
    </>
  );
}
