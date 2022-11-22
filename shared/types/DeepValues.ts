export type DeepValues<T, K> = K extends keyof T
  ? T[K]
  : T extends object
  ? DeepValues<T[keyof T], K>
  : never;
