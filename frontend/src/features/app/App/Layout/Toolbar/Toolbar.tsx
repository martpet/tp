import { Divider, Flex } from '@adobe/react-spectrum';

import { Logo } from '~/common/components';
import { sideSpace } from '~/common/consts';
import { useToolbarPosition } from '~/common/hooks';

import { ProfileButton } from './ProfileButton';

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
          gap="size-85"
          alignItems="center"
        >
          <ProfileButton />
        </Flex>
      </Flex>
      <Divider size="M" orientation={isToolbarOnTop ? 'horizontal' : 'vertical'} />
    </Flex>
  );
}
