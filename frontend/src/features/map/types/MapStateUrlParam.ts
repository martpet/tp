import { ValueOf } from 'type-fest';

import { MapState, shortMapStateUrlParams } from '~/features/map';

type ShortKey = keyof typeof shortMapStateUrlParams;
type LongKey = Exclude<keyof MapState['view'], ValueOf<typeof shortMapStateUrlParams>>;

export type MapStateUrlParam = ShortKey | LongKey;
