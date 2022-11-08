import { OnErrorFn } from '@formatjs/intl';
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { IntlProvider as Provider } from 'react-intl';

import { publicDirApi } from '~/app/services/publicDirApi';
import { LoadingOverlay } from '~/common/components';
import { defaultLanguage } from '~/common/consts';
import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { browserLocaleChanged } from '~/features/app';
import { selectLanguage } from '~/features/settings';

type Props = {
  children: ReactNode;
};

export function IntlProvider({ children }: Props) {
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const skip = language === 'en';
  const [lastFetchedLanguage, setLastFetchedLanguage] = useState('');
  const { data, isFetching, isSuccess } = publicDirApi.useGetTranslationsQuery(language, {
    skip,
  });
  const messages = lastFetchedLanguage === defaultLanguage ? undefined : data;

  useLayoutEffect(() => {
    if (skip || isSuccess) {
      setLastFetchedLanguage(language);
    }
  }, [skip, isSuccess]);

  useEffect(() => {
    const listener = () => dispatch(browserLocaleChanged());
    window.addEventListener('languagechange', listener);
    return () => window.removeEventListener('languagechange', listener);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleError: OnErrorFn = (error) => {
    console.warn(error.message);
  };

  return (
    <Provider
      locale={lastFetchedLanguage || defaultLanguage}
      defaultLocale={defaultLanguage}
      messages={messages}
      onError={handleError}
    >
      {!lastFetchedLanguage && isFetching ? <LoadingOverlay /> : children}
    </Provider>
  );
}
