/* eslint-disable formatjs/no-literal-string-in-jsx */
import { ProgressCircle, SpectrumProgressCircleProps } from '@adobe/react-spectrum';

type Props = SpectrumProgressCircleProps & {
  text?: string;
};

export function Spinner({ text, ...props }: Props) {
  // Hardcode aria-label text, since component can be used outside `IntlProvider`.
  return (
    <>
      <ProgressCircle
        marginX="size-125"
        aria-label="Loading"
        isIndeterminate
        {...props}
      />
      {text}
    </>
  );
}
