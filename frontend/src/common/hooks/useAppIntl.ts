/* eslint-disable @typescript-eslint/no-restricted-imports */

import { Options as IntlMessageFormatOptions } from 'intl-messageformat';
import { MessageDescriptor, PrimitiveType, useIntl } from 'react-intl';
import { Merge } from 'type-fest';

import { TranslationMessages } from '~/common/types';

export const useAppIntl = () => {
  const intl = useIntl();

  return {
    ...intl,

    formatMessage(
      // Todo: use MergeDeep from type-fest
      // ...(MergeDeep<
      //   [Parameters<typeof intl.formatMessage>],
      //   [Merge<MessageDescriptor, { id: keyof TranslationMessages }>]
      // >)

      descriptor: Merge<MessageDescriptor, { id: keyof TranslationMessages }>,
      values?: Record<string, PrimitiveType>,
      opts?: IntlMessageFormatOptions
    ) {
      return intl.formatMessage(descriptor, values, opts);
    },
  };
};
