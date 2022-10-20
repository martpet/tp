import { Flex, Item, Picker } from '@adobe/react-spectrum';
import { Key } from 'react';
import { useIntl } from 'react-intl';

import { publicDirApi } from '~/app';
import { Spinner } from '~/common/components';
import { languages } from '~/common/consts';
import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { Language } from '~/common/types';
import { languageChanged, selectLanguage } from '~/features/app';

export function Languages() {
  const language = useAppSelector(selectLanguage);
  const { isLoading } = publicDirApi.endpoints.getTranslations.useQueryState(language);
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const handleChange = (newLanguage: Key) => {
    dispatch(languageChanged(newLanguage as Language));
  };

  const items = languages.map((code) => ({
    key: code,
    label: new Intl.DisplayNames([code], { type: 'language' }).of(code),
  }));

  items.sort();

  return (
    <Flex alignItems="center">
      <Picker
        items={items}
        selectedKey={language}
        onSelectionChange={handleChange}
        label={formatMessage({
          defaultMessage: 'Choose language',
          description: 'language picker label',
        })}
      >
        {(item) => <Item>{item.label}</Item>}
      </Picker>

      {isLoading && <Spinner size="S" marginStart="size-125" />}
    </Flex>
  );
}
