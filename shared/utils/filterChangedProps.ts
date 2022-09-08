export const filterChangedProps = <
  NewProps extends Record<string, any>,
  OldProps extends Record<string, any>
>(
  newProps: NewProps,
  oldProps: OldProps
) => {
  const changedProps: Partial<NewProps & OldProps> = {};

  Object.keys(newProps).forEach((key) => {
    const newVal = newProps[key];
    const oldVal = oldProps[key];

    if (newVal !== oldVal) {
      changedProps[key as keyof typeof changedProps] = newVal;
    }
  });

  if (Object.keys(changedProps).length) {
    return changedProps;
  }

  return undefined;
};
