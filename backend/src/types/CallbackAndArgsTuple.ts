type Callback = () => void | Promise<unknown>;
type CallbackWithArgs = (...params: any[]) => void | Promise<unknown>;

export type CallbackAndArgsTuple =
  | [Callback]
  | [CallbackWithArgs, Parameters<CallbackWithArgs>];
