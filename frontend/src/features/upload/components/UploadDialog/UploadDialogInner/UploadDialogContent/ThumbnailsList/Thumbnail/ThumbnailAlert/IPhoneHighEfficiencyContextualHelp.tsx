import { Content, ContextualHelp, Heading, Text } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import classNames from './ThumbnailError.module.css';

export function IPhoneHighEfficiencyContextualHelp() {
  return (
    <ContextualHelp variant="help" UNSAFE_className={classNames.contextualHelp}>
      <Heading>
        <FormattedMessage
          defaultMessage="iPhone users"
          description="thumbnail error iphone high efficiency help heading"
        />
      </Heading>
      <Content>
        <Text>
          <FormattedMessage
            defaultMessage='Photos taken with <em>"High Efficiency"</em> (<em>Settings → Camera → Formats</em>) cannot be uploaded from an iPhone. You can upload this photo from a Mac.'
            description="thumbnail error iphone high efficiency help content"
            values={{ em: (str) => <em>{str}</em> }}
          />
        </Text>
      </Content>
    </ContextualHelp>
  );
}
