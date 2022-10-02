import { Flex, ProgressCircle } from '@adobe/react-spectrum';
import { SpectrumProgressCircleProps } from '@react-types/progress';

type Props = SpectrumProgressCircleProps & {
  centered?: boolean;
};

export function Spinner({ centered, ...progressCircleProps }: Props) {
  return (
    <Flex justifyContent={centered ? 'center' : 'start'}>
      <ProgressCircle isIndeterminate aria-label="Loading" {...progressCircleProps} />
    </Flex>
  );
}
