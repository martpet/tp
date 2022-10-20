import { Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import { useIsMobileDevice } from '@react-spectrum/utils';
import { Key, ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { selectActiveTab, SettingsTabKey, tabChanged } from '~/features/settings';

import { Colors } from './Colors/Colors';
import { Languages } from './Languages/Languages';

export default function SettingsContent() {
  const activeTab = useAppSelector(selectActiveTab);
  const isMobile = useIsMobileDevice();
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const tabListSpace = 'size-400';

  type Tab = {
    key: SettingsTabKey;
    name: string;
    children: ReactNode;
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
      children: '',
    },
  ];

  const handleTabChange = (key: Key) => {
    dispatch(tabChanged(key as SettingsTabKey));
  };

  return (
    <Tabs
      items={tabs}
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
