import { Content, Flex, Heading, View } from '@adobe/react-spectrum';

import { Avatar } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { LogoutButton, selectMe } from '~/features/me';

type Props = {
  close?: () => void;
};

export default function ProfileDialogContent({ close }: Props) {
  const me = useAppSelector(selectMe);

  if (!me) {
    return null;
  }

  const fullName = `${me.givenName} ${me.familyName}`;

  return (
    <Content>
      <Flex direction="column" alignItems="center">
        <Avatar user={me} size="XXL" />
        <Heading level={2} marginY="size-100">
          {fullName}
        </Heading>
        {me.email}
        <View marginTop="size-350">
          <LogoutButton onClick={close} />
        </View>
      </Flex>
    </Content>
  );
}
