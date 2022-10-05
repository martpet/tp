// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { FormattedMessage } from 'react-intl';
import { Props as FormattedMessageProps } from 'react-intl/src/components/message';

import { TranslationMessages } from '~/common/types';

type Props = FormattedMessageProps & {
  id: keyof TranslationMessages;
};

export function Text({ id, ...props }: Props) {
  return <FormattedMessage id={id} {...props} />;
}
