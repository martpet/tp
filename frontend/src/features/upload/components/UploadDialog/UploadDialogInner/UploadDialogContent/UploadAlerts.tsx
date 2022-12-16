import { Flex, View } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import CloudError from '@spectrum-icons/workflow/CloudError';
import { ReactNode, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  selectCompletedUploads,
  selectFailedUploads,
  selectFiles,
  selectUnuploadableFiles,
  selectUploadFlowEnded,
} from '~/features/upload';

export function UploadAlerts() {
  const isFlowEnded = useSelector(selectUploadFlowEnded);
  const files = useSelector(selectFiles);
  const completedUploads = useSelector(selectCompletedUploads);
  const failedUploads = useSelector(selectFailedUploads);
  const unuploadableFiles = useSelector(selectUnuploadableFiles);
  const container = useRef<HTMLDivElement>(null);

  let successAlert: ReactNode;
  let failureAlert: ReactNode;
  let validationAlert: ReactNode;

  if (completedUploads.length) {
    successAlert = (
      <AlertItem icon={<CheckmarkCircle color="positive" />}>
        {completedUploads.length > 1 && completedUploads.length === files.length ? (
          <FormattedMessage
            defaultMessage="All {count} files are uploaded"
            description="upload notification success all"
            values={{ count: completedUploads.length }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="{count} {count, plural, one {file is} other {files are}} uploaded"
            description="upload notification success"
            values={{ count: completedUploads.length }}
          />
        )}
      </AlertItem>
    );
  }

  if (failedUploads.length) {
    failureAlert = (
      <AlertItem icon={<CloudError color="negative" />}>
        <FormattedMessage
          defaultMessage="{count} {count, plural, one {file} other {files}} failed to upload."
          description="upload notification failure"
          values={{ count: failedUploads.length }}
        />{' '}
        {isFlowEnded && (
          <FormattedMessage
            defaultMessage="Press <em>Start upload</em> again"
            description="upload notification failure - try again"
            values={{ em: (msg) => <em>{msg}</em> }}
          />
        )}
      </AlertItem>
    );
  }

  if (unuploadableFiles.length) {
    validationAlert = (
      <AlertItem icon={<Alert color="negative" />}>
        <FormattedMessage
          defaultMessage="{count} {count, plural, one {file does not} other {files don't}} meet upload criteria"
          description="upload notification invalid files"
          values={{ count: unuploadableFiles.length }}
        />
      </AlertItem>
    );
  }

  const hasAlert = successAlert || failureAlert || validationAlert;

  useEffect(() => {
    if (isFlowEnded && hasAlert) {
      container.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isFlowEnded]);

  if (!hasAlert) {
    return null;
  }

  return (
    <div ref={container}>
      <Flex direction="column" gap="size-150" marginBottom="size-400">
        {successAlert} {failureAlert} {validationAlert}
      </Flex>
    </div>
  );
}

function AlertItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Flex alignItems="center" gap="size-150">
      {icon}
      <View>{children}</View>
    </Flex>
  );
}
