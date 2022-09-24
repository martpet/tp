import { JsonValue } from 'type-fest';

export const objectValuesToJson = (input: Record<string, JsonValue>) =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, JSON.stringify(value)])
  );
