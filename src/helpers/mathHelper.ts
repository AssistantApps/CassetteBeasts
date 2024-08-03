import type { IRect2, IVector2D } from 'contracts/vector';

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
  const x = tryParseInt((values[0] ?? '').trim())!;
  const y = tryParseInt((values[1] ?? '').trim())!;

  return { x, y };
};

export const tryParseRect2 = (value: string): IRect2 | undefined => {
  const cleanedValue = (value ?? '').replace('Rect2(', '').replace(')', '');
  const values = cleanedValue.split(',');
  const x = tryParseInt((values[0] ?? '').trim())!;
  const y = tryParseInt((values[1] ?? '').trim())!;
  const w = tryParseInt((values[2] ?? '').trim())!;
  const h = tryParseInt((values[3] ?? '').trim())!;

  return { x, y, w, h };
};
