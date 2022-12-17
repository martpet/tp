import { View } from '@adobe/react-spectrum';
import { Avatar as SpectrumAvatar } from '@react-spectrum/avatar';
import { SpectrumAvatarProps } from '@react-types/avatar';
import BoringAvatar from 'boring-avatars';

import { Me } from '~/common/types';

import classes from './Avatar.module.css';

type Props = {
  user: Me;
  size?: SpectrumAvatarProps['size'];
  spectrumProps?: Omit<SpectrumAvatarProps, 'src'>;
};

export function Avatar({ user, size = 'avatar-size-100', spectrumProps }: Props) {
  const altText = `${user.givenName} ${user.familyName}`;

  return user.picture ? (
    <SpectrumAvatar src={user.picture} alt={altText} size={size} {...spectrumProps} />
  ) : (
    <View width={size} height={size} UNSAFE_className={classes.boringAvatarWrap}>
      <BoringAvatar size={size} name={user.givenName + user.familyName} variant="beam" />
    </View>
  );
}
