import { defaultTheme, Provider } from '@adobe/react-spectrum';

import { useAppSelector } from '~/common/hooks';
import { selectLanguage } from '~/features/me';

type Props = {
  children?: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const language = useAppSelector(selectLanguage);

  return (
    <Provider theme={defaultTheme} locale={language}>
      {children}
    </Provider>
  );
}
