import { ActionGroup, Item, Text } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import RailLeft from '@spectrum-icons/workflow/RailLeft';
import RailTop from '@spectrum-icons/workflow/RailTop';
import { Key, ReactNode, useId } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppDispatch, useToolbarPosition } from '~/common/hooks';
import { ToolbarPosition } from '~/common/types';
import { toolbarPositionChanged } from '~/features/app';

export function ToolbarPositionPicker() {
  const { toolbarPosition, isToolbarPositionDisabled } = useToolbarPosition();
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const labelId = useId();

  type Item = {
    key: ToolbarPosition;
    label: string;
    icon: ReactNode;
  };

  const items: Item[] = [
    {
      key: 'left',
      label: formatMessage({
        defaultMessage: 'Left',
        description: 'toolbar position picker label - left',
      }),
      icon: <RailLeft />,
    },
    {
      key: 'top',
      label: formatMessage({
        defaultMessage: 'Top',
        description: 'toolbar position picker label - top',
      }),
      icon: <RailTop />,
    },
  ];

  const handleChange = (key: Key) => {
    const newPosition = key as ToolbarPosition;
    dispatch(toolbarPositionChanged(newPosition));
  };

  return (
    <>
      <Label elementType="span" id={labelId}>
        <FormattedMessage
          defaultMessage="Toolbar position"
          description="toolbar position picker label"
        />
        {isToolbarPositionDisabled && (
          <>
            &nbsp;
            <em>
              <FormattedMessage
                defaultMessage="(Disabled on mobile)"
                description="toolbar position disabled picker additional label"
              />
            </em>
          </>
        )}
      </Label>
      <ActionGroup
        aria-labelledby={labelId}
        density="compact"
        selectionMode="single"
        items={items}
        selectedKeys={[toolbarPosition]}
        onAction={handleChange}
        isDisabled={isToolbarPositionDisabled}
      >
        {(item: Item) => (
          <Item>
            {item.icon}
            <Text>{item.label}</Text>
          </Item>
        )}
      </ActionGroup>
    </>
  );
}
