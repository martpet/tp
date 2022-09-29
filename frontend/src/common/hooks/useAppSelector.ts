// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '~/common/types';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
