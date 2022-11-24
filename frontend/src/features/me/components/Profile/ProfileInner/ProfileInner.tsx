import { Flex, Heading, View } from '@adobe/react-spectrum';

import { Avatar } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { selectMe } from '~/features/me/meSlice';

import { LogoutButton } from './LogoutButton';

export default function ProfileInner() {
  const me = useAppSelector(selectMe);

  if (!me) {
    return null;
  }

  const fullName = `${me.givenName} ${me.familyName}`;

  return (
    <Flex direction="column" alignItems="center">
      <Avatar user={me} size={72} />
      <Heading level={2} marginY="size-100">
        {fullName}
      </Heading>
      {me.email}
      <View marginTop="size-350">
        <LogoutButton />
      </View>
    </Flex>
  );
}
