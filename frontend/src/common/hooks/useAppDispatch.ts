// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch } from 'react-redux';

import { AppDispatch } from '~/common/types';

export const useAppDispatch: () => AppDispatch = useDispatch;
