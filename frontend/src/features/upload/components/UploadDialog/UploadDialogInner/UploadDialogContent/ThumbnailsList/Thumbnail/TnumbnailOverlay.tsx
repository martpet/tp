import { View, ViewProps } from '@adobe/react-spectrum';

type Props = ViewProps<5>;

export function ThumbnailOverlay({ ...viewProps }: Props) {
  return (
    <View
      backgroundColor="static-black"
      {...viewProps}
      UNSAFE_style={{ opacity: 'var(--spectrum-global-color-opacity-25)' }}
    />
  );
}
