import { JsonObject } from 'type-fest';

export const objectValuesToJson = (input: JsonObject) =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, JSON.stringify(value)])
  );
