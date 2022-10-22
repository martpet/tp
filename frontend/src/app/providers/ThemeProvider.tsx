import { defaultTheme, Provider } from '@adobe/react-spectrum';

import { useAppSelector } from '~/common/hooks';
import { selectColorScheme, selectLanguage } from '~/features/settings';

type Props = {
  children?: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const colorScheme = useAppSelector(selectColorScheme);
  const spectrumColorScheme = colorScheme === 'os' ? undefined : colorScheme;
  const language = useAppSelector(selectLanguage);

  return (
    <Provider theme={defaultTheme} locale={language} colorScheme={spectrumColorScheme}>
      {children}
    </Provider>
  );
}
