import { AppLoadingOverlay } from './AppLoadingOverlay';
import { MyProfile } from './MyProfile';

export function App() {
  return (
    <>
      <AppLoadingOverlay />
      <MyProfile />
    </>
  );
}
