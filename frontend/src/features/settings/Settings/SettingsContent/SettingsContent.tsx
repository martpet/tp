import { Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import { useIsMobileDevice } from '@react-spectrum/utils';
import { Key, ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { selectActiveTab, SettingsTabKey, tabChanged } from '~/features/settings';

import { Languages } from './Languages';

export default function SettingsContent() {
  const activeTab = useAppSelector(selectActiveTab);
  const isMobile = useIsMobileDevice();
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

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
      children: '',
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
        marginEnd={isMobile ? 0 : 'size-400'}
        marginBottom={isMobile ? 'size-400' : 0}
      >
        {(tab: Tab) => <Item>{tab.name}</Item>}
      </TabList>
      <TabPanels>{(tab: Tab) => <Item>{tab.children}</Item>}</TabPanels>
    </Tabs>
  );
}
