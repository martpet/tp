import { ActionGroup, Item, Text } from '@adobe/react-spectrum';
import AddIcon from '@spectrum-icons/workflow/Add';
import RemoveIcon from '@spectrum-icons/workflow/Remove';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-map-gl';

export function ZoomControls() {
  const mapRef = useMap();
  const zoomInKey = 'zoomIn';
  const zoomOutKey = 'zoomOut';

  return (
    <ActionGroup
      orientation="vertical"
      density="compact"
      buttonLabelBehavior="hide"
      onAction={(key) => {
        if (key === zoomInKey) mapRef.current?.zoomIn();
        else mapRef.current?.zoomOut();
      }}
    >
      <Item key={zoomInKey}>
        <AddIcon />
        <Text>
          <FormattedMessage defaultMessage="Zoom in" description="zoom control - in" />
        </Text>
      </Item>
      <Item key={zoomOutKey}>
        <RemoveIcon />
        <Text>
          <FormattedMessage defaultMessage="Zoom out" description="zoom control - out" />
        </Text>
      </Item>
    </ActionGroup>
  );
}
