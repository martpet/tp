import { Flex, View } from '@adobe/react-spectrum';

import { Spinner } from '~/common/components';

type Props = {
  transparent?: boolean;
  text?: string;
};

export function LoadingOverlay({ transparent, text }: Props) {
  return (
    <View
      position="absolute"
      left="static-size-0"
      top="static-size-0"
      width="100%"
      height="100%"
      zIndex={9999}
      UNSAFE_style={{
        ...(!transparent && {
          background: 'var(--spectrum-alias-background-color-modal-overlay)',
        }),
      }}
    >
      <Flex height="100%" alignItems="center" justifyContent="center">
        <Spinner text={text} />
      </Flex>
    </View>
  );
}
