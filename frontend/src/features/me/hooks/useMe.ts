import { useAppSelector } from '~/common/hooks';
import { meApi } from '~/features/me/meApi';
import { selectIsSignedIn } from '~/features/me/meSlice';

export const useMe = () => {
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const result = meApi.endpoints.getMe.useQuery(undefined, { skip: !isSignedIn });
  return {
    me: result.data,
    ...result,
  };
};
