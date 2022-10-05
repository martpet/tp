import { useLocale } from '@adobe/react-spectrum';
import { OnErrorFn } from '@formatjs/intl';
import { ReactNode, useEffect } from 'react';
import { IntlProvider as Provider } from 'react-intl';

import { browserLocaleChanged, selectBrowserLocale } from '~/app/App';
import { publicDirApi } from '~/app/services';
import { LoadingOverlay } from '~/common/components';
import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { selectLanguage } from '~/features/me';

type Props = {
  children: ReactNode;
};

export function IntlProvider({ children }: Props) {
  const appLanguage = useAppSelector(selectLanguage);
  const storedLocale = useAppSelector(selectBrowserLocale);
  const { locale } = useLocale();
  const { data, isFetching } = publicDirApi.useGetTranslationsQuery(appLanguage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (locale !== storedLocale) {
      dispatch(browserLocaleChanged(locale));
    }
  }, [locale]);

  const handleError: OnErrorFn = (error) => {
    if (import.meta.env.DEV) {
      throw error;
    }
  };

  return (
    <Provider locale={appLanguage} messages={data} onError={handleError}>
      {isFetching ? <LoadingOverlay /> : children}
    </Provider>
  );
}
