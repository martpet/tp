import { Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import { useIsMobileDevice } from '@react-spectrum/utils';
import { Key, ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector, useToolbarPosition } from '~/common/hooks';
import { activeTabChanged, selectActiveTab, SettingsTabKey } from '~/features/settings';

import { Colors } from './Colors/Colors';
import { Languages } from './Languages/Languages';
import { Layout } from './Layout/Layout';

export default function Settings() {
  const activeTab = useAppSelector(selectActiveTab);
  const isMobile = useIsMobileDevice();
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const { isToolbarPositionDisabled } = useToolbarPosition();
  const tabListSpace = 'size-400';

  type Tab = {
    key: SettingsTabKey;
    name: string;
    children: ReactNode;
    disabled?: boolean;
  };

  const tabs: Tab[] = [
    {
      key: 'language',
      name: formatMessage({ defaultMessage: 'Language', description: 'settings tab' }),
      children: <Languages />,
    },
    {
      key: 'colors',
      name: formatMessage({ defaultMessage: 'Colors', description: 'settings tab' }),
      children: <Colors />,
    },
    {
      key: 'layout',
      name: formatMessage({ defaultMessage: 'Layout', description: 'settings tab' }),
      children: <Layout />,
      disabled: isToolbarPositionDisabled,
    },
  ];

  const handleTabChange = (key: Key) => {
    dispatch(activeTabChanged(key as SettingsTabKey));
  };

  return (
    <Tabs
      items={tabs.filter(({ disabled }) => !disabled)}
      selectedKey={activeTab}
      onSelectionChange={handleTabChange}
      orientation={isMobile ? 'horizontal' : 'vertical'}
    >
      <TabList
        marginEnd={isMobile ? 0 : tabListSpace}
        marginBottom={isMobile ? tabListSpace : 0}
      >
        {(tab: Tab) => <Item>{tab.name}</Item>}
      </TabList>
      <TabPanels>{(tab: Tab) => <Item>{tab.children}</Item>}</TabPanels>
    </Tabs>
  );
}
