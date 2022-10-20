import { defaultTheme, Provider } from '@adobe/react-spectrum';

import { useAppSelector } from '~/common/hooks';
import { selectColorScheme, selectLanguage } from '~/features/app';

type Props = {
  children?: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const colorScheme = useAppSelector(selectColorScheme);
  const language = useAppSelector(selectLanguage);

  return (
    <Provider theme={defaultTheme} locale={language} colorScheme={colorScheme}>
      {children}
    </Provider>
  );
}
