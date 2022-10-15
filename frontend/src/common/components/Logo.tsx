import { ActionButton, Flex, View } from '@adobe/react-spectrum';
import { StyleProps } from '@react-types/shared';
import { useNavigate } from 'react-router-dom';

type Props = {
  size?: StyleProps['width'];
};

export function Logo({ size = 'static-size-400' }: Props) {
  const navigate = useNavigate();
  const logoText = 'TP';

  const handleClick = () => {
    navigate('/');
  };

  return (
    <ActionButton isQuiet onPress={handleClick}>
      <View
        width={size}
        height={size}
        borderRadius="large"
        borderWidth="thick"
        borderColor="gray-500"
      >
        <Flex height="100%" justifyContent="center" alignItems="center">
          {logoText}
        </Flex>
      </View>
    </ActionButton>
  );
}
