import { useAppSelector } from '~/common/hooks';
import { meApi } from '~/features/me/meApi';
import { selectIsSignedIn } from '~/features/me/meSlice';

export const useMe = () => {
  const isLogedIn = useAppSelector(selectIsSignedIn);
  const result = meApi.endpoints.getMe.useQuery(undefined, { skip: !isLogedIn });
  return {
    me: result.data,
    ...result,
  };
};
