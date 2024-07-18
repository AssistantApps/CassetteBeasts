import { IVector2D } from 'contracts/vector';

export const tryParseInt = (num: string): number | undefined => {
  try {
    const attempt = parseInt(num);
    if (isNaN(attempt)) return undefined;

    return attempt;
  } catch (e) {
    return undefined;
  }
};
export const tryParseFloat = (num: string): number | undefined => {
  try {
    const attempt = parseFloat(num);
    if (isNaN(attempt)) return undefined;

    return attempt;
  } catch (e) {
    return undefined;
  }
};
export const tryParseVector2D = (value: string): IVector2D | undefined => {
  const cleanedValue = (value ?? '').replace('Vector2(', '').replace(')', '');
  const values = cleanedValue.split(',');
  const x = tryParseInt((values[0] ?? '').trim());
  const y = tryParseInt((values[1] ?? '').trim());

  return { x, y };
};
