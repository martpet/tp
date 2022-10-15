import { useLocale } from '@adobe/react-spectrum';
import { OnErrorFn } from '@formatjs/intl';
import { ReactNode, useEffect } from 'react';
import { IntlProvider as Provider } from 'react-intl';

import { publicDirApi } from '~/app/services/publicDirApi';
import { LoadingOverlay } from '~/common/components';
import { defaultLanguage } from '~/common/consts';
import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { selectLanguage } from '~/features';
import { browserLocaleChanged, selectBrowserLocale } from '~/features/app';

type Props = {
  children: ReactNode;
};

export function IntlProvider({ children }: Props) {
  const language = useAppSelector(selectLanguage);
  const storedLocale = useAppSelector(selectBrowserLocale);
  const dispatch = useAppDispatch();
  const { locale } = useLocale();

  const { data: messages, isFetching } = publicDirApi.useGetTranslationsQuery(language, {
    skip: language === 'en',
  });

  useEffect(() => {
    if (locale !== storedLocale) {
      dispatch(browserLocaleChanged(locale));
    }
  }, [locale]);

  const handleError: OnErrorFn = (error) => {
    console.warn(error.message);
  };

  return (
    <Provider
      locale={language}
      defaultLocale={defaultLanguage}
      messages={messages}
      onError={handleError}
    >
      {isFetching ? <LoadingOverlay /> : children}
    </Provider>
  );
}
