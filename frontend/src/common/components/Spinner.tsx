import { ProgressCircle, SpectrumProgressCircleProps } from '@adobe/react-spectrum';

export function Spinner(props: SpectrumProgressCircleProps) {
  // Hardcode aria-label, because Spinner can be used outside IntlProvider context

  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
  return <ProgressCircle isIndeterminate aria-label="Loading" {...props} />;
}
