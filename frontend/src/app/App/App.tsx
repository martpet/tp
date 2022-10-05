import { Text } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { selectLanguage } from '~/features/me';

import { AppLoadingOverlay } from './AppLoadingOverlay';
import { MyProfile } from './MyProfile';

export function App() {
  const language = useAppSelector(selectLanguage);

  return (
    <>
      <p>{language}</p>
      <p>
        <Text id="foo" />
      </p>
      <AppLoadingOverlay />
      <MyProfile />
    </>
  );
}
