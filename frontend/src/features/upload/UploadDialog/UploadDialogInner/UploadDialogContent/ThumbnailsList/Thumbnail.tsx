import { ActionButton, Flex, Grid, View } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import Close from '@spectrum-icons/workflow/Close';
import { DragEventHandler } from 'react';
import { FormattedDate, useIntl } from 'react-intl';

import { useAppDispatch } from '~/common/hooks';
import { FileMeta } from '~/features/upload/types';
import { fileRemoved } from '~/features/upload/uploadSlice';

type Props = {
  file: FileMeta;
};

export function Thumbnail({ file }: Props) {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const preventImageDrag: DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemove = (fileKey: string) => () => {
    dispatch(fileRemoved(fileKey));
  };

  return (
    <View>
      <Grid>
        <img
          alt={file.name}
          src={file.objectURL}
          onDragStart={preventImageDrag}
          style={{ width: '100%', gridColumn: '1', gridRow: '1' }}
        />
        <Flex justifyContent="end" gridColumn="1" gridRow="1">
          <ActionButton
            onPress={handleRemove(file.key)}
            UNSAFE_style={{ transform: 'scale(0.65)' }}
            aria-label={formatMessage({
              defaultMessage: 'Remove',
              description: 'remove',
            })}
          >
            <Close />
          </ActionButton>
        </Flex>
      </Grid>
      <Label marginTop="size-50">
        {file.exif.dateTimeOriginal && (
          <FormattedDate value={file.exif.dateTimeOriginal} dateStyle="long" />
        )}
      </Label>
    </View>
  );
}
