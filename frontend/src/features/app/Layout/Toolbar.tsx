import { Divider, Flex } from '@adobe/react-spectrum';

import { Logo } from '~/common/components';
import { sideSpace } from '~/common/consts';
import { useAppSelector, useToolbarPosition } from '~/common/hooks';
import { selectLanguage } from '~/features/me';

import { MyProfile } from './MyProfile';

export function Toolbar() {
  const { isToolbarOnTop } = useToolbarPosition();
  const language = useAppSelector(selectLanguage);

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
          <p>{language}</p>
          <MyProfile />
        </Flex>
      </Flex>
      <Divider size="M" orientation={isToolbarOnTop ? 'horizontal' : 'vertical'} />
    </Flex>
  );
}
