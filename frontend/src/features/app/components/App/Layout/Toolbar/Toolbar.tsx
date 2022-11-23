import { Divider, Flex } from '@adobe/react-spectrum';

import { Logo } from '~/common/components';
import { sideSpace } from '~/common/consts';
import { useToolbarPosition } from '~/common/hooks';
import { UploadButton } from '~/features/app/components/App/Layout/Toolbar/UploadButton';

import { ProfileButton } from './ProfileButton';
import { SettingsButton } from './SettingsButton';

export function Toolbar() {
  const { isToolbarOnTop } = useToolbarPosition();

  return (
    <Flex direction={isToolbarOnTop ? 'column' : 'row'} height="100%">
      <Flex
        flexGrow={1}
        direction={isToolbarOnTop ? 'row' : 'column'}
        alignItems="center"
        justifyContent="space-between"
        marginX={isToolbarOnTop ? sideSpace : 0}
        marginY={isToolbarOnTop ? 0 : sideSpace}
      >
        <Logo />
        <Flex
          direction={isToolbarOnTop ? 'row' : 'column'}
          gap="size-50"
          alignItems="center"
        >
          <UploadButton />
          <SettingsButton />
          <ProfileButton />
        </Flex>
      </Flex>
      <Divider size="S" orientation={isToolbarOnTop ? 'horizontal' : 'vertical'} />
    </Flex>
  );
}
