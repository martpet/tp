import { ActionGroup, Item, Text } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';
import OS from '@spectrum-icons/workflow/OS';
import { Key, ReactNode, useId } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { ColorScheme } from '~/common/types';
import { selectColorScheme, settingsChanged } from '~/features/settings';

export function ColorSchemePicker() {
  const colorScheme = useAppSelector(selectColorScheme);
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const labelId = useId();

  const handleChange = (newScheme: Key) => {
    dispatch(settingsChanged({ colorScheme: newScheme as ColorScheme }));
  };

  type Item = {
    key: ColorScheme;
    label: string;
    icon?: ReactNode;
  };

  const items: Item[] = [
    {
      key: 'light',
      icon: <Light />,
      label: formatMessage({
        defaultMessage: 'Light',
        description: 'color scheme picker item - light',
      }),
    },
    {
      key: 'dark',
      icon: <Moon />,
      label: formatMessage({
        defaultMessage: 'Dark',
        description: 'color scheme picker item - dark',
      }),
    },
    {
      key: 'os',
      icon: <OS />,
      label: formatMessage({
        defaultMessage: 'Auto',
        description: 'color scheme picker item - auto',
      }),
    },
  ];

  return (
    <>
      <Label elementType="span" id={labelId}>
        <FormattedMessage
          defaultMessage="Color scheme"
          description="color scheme picker label"
        />
      </Label>
      <ActionGroup
        aria-labelledby={labelId}
        density="compact"
        selectionMode="single"
        items={items}
        selectedKeys={[colorScheme]}
        onAction={handleChange}
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
