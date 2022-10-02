import { defaultTheme, Provider } from '@adobe/react-spectrum';

import { selectAppLanguage } from '~/app/App';
import { useAppSelector } from '~/common/hooks';

type Props = {
  children?: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const language = useAppSelector(selectAppLanguage);

  return (
    <Provider theme={defaultTheme} locale={language}>
      {children}
    </Provider>
  );
}
