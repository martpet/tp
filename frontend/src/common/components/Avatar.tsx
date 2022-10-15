import { Icon, IconProps } from '@adobe/react-spectrum';
import BoringAvatar from 'boring-avatars';

import { Me } from '~/common/types';

type Props = {
  user: Me;
  size?: IconProps['size'];
};

export function Avatar({ user, size = 'M' }: Props) {
  const altText = `${user.givenName} ${user.familyName}`;

  const image = (
    <span>
      <img src={user.picture} alt={altText} style={{ borderRadius: '50px' }} />
    </span>
  );

  const fallback = (
    <BoringAvatar
      name={user.givenName + user.familyName}
      variant="beam"
      size={
        {
          XXS: 9,
          XS: 12,
          S: 18,
          M: 24,
          L: 36,
          XL: 48,
          XXL: 72,
        }[size]
      }
    />
  );

  return <Icon size={size}>{user.picture ? image : fallback}</Icon>;
}
