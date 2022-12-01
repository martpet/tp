type Callback = () => unknown | Promise<unknown>;
type CallbackWithArgs = (...params: any[]) => unknown | Promise<unknown>;

export type CallbackAndArgsTuple =
  | [Callback]
  | [CallbackWithArgs, Parameters<CallbackWithArgs>];
