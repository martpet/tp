export const toFixedNumber = (input?: string | number, digits?: number) => {
  let result = Number(input);

  if (Number.isNaN(result)) {
    return undefined;
  }

  if (typeof digits !== undefined) {
    result = Number(result.toFixed(digits));
  }

  return result;
};
