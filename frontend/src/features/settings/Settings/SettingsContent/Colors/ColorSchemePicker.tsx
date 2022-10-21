import { ActionGroup, Item, Text } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { ColorScheme } from '@react-types/provider';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';
import OS from '@spectrum-icons/workflow/OS';
import { Key, ReactNode, useId } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { colorSchemeChanged, selectColorScheme } from '~/features/app';

export function ColorSchemePicker() {
  const colorScheme = useAppSelector(selectColorScheme);
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const autoScheme = 'auto';
  const labelId = useId();

  const handleChange = (key: Key) => {
    let newScheme: ColorScheme | undefined;
    if (key === autoScheme) {
      newScheme = undefined;
    } else {
      newScheme = key as ColorScheme;
    }
    dispatch(colorSchemeChanged(newScheme));
  };

  type Item = {
    key: ColorScheme | typeof autoScheme;
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
      key: autoScheme,
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
        selectedKeys={[colorScheme || autoScheme]}
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
