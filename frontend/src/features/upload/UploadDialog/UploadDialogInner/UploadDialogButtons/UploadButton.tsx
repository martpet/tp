import { Button, Text } from '@adobe/react-spectrum';
import UploadIcon from '@spectrum-icons/workflow/UploadToCloud';
import { FormattedMessage } from 'react-intl';

export function UploadButton() {
  return (
    <Button variant="cta">
      <UploadIcon />
      <Text>
        <FormattedMessage
          defaultMessage="Start upload"
          description="upload dialog upload button"
        />
      </Text>
    </Button>
  );
}
