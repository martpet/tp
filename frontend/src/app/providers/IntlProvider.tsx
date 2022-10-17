import { OnErrorFn } from '@formatjs/intl';
import { ReactNode, useEffect } from 'react';
import { IntlProvider as Provider } from 'react-intl';

import { publicDirApi } from '~/app/services/publicDirApi';
import { LoadingOverlay } from '~/common/components';
import { defaultLanguage } from '~/common/consts';
import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { browserLocaleChanged, selectLanguage } from '~/features/app';

type Props = {
  children: ReactNode;
};

export function IntlProvider({ children }: Props) {
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const { data, isFetching } = publicDirApi.useGetTranslationsQuery(language, {
    skip: language === 'en',
  });

  // https://github.com/reduxjs/redux-toolkit/pull/2779
  const messages = language === 'en' ? undefined : data;

  useEffect(() => {
    const listener = () => {
      dispatch(browserLocaleChanged(window.navigator.language));
    };
    window.addEventListener('languagechange', listener);
    return () => {
      window.removeEventListener('languagechange', listener);
    };
  }, []);

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
