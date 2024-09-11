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

export const statsCoord = (value: number, section: string) => {
  const percentValue = value / 3;
  const a = percentValue * Math.sin(30 * (Math.PI / 180));
  const b = Math.sqrt(Math.pow(percentValue, 2) - Math.pow(a, 2));

  const maxA100 = Math.min(a, 100);
  const maxB100 = Math.min(b, 100);
  const minA0 = Math.max(maxA100, 0);
  const minB0 = Math.max(maxB100, 0);

  switch (section) {
    case 'max_hp':
      return `100,${(100 - percentValue).toFixed(2)}`;
    case 'melee_attack':
      return `${(100 + minB0).toFixed(2)},${(100 - minA0).toFixed(2)}`;
    case 'melee_defense':
      return `${(100 + minB0).toFixed(2)},${(100 + minA0).toFixed(2)}`;
    case 'ranged_attack':
      return `${(100 - minB0).toFixed(2)},${(100 - minA0).toFixed(2)}`;
    case 'ranged_defense':
      return `${(100 - minB0).toFixed(2)},${(100 + minA0).toFixed(2)}`;
    case 'speed':
      return `100,${(100 + percentValue).toFixed(2)}`;
  }

  return '100,100';
};

export const randomNumber = (min: number, max: number) => {
  const value = Math.random() * (max - min);
  return value + min;
};

export const randomNumbers = (numberOfRandoms: number, min: number, max: number) => {
  const result: Array<number> = [];

  for (let index = 0; index < numberOfRandoms * 3; index++) {
    const value = Math.random() * (max - min);
    if (result.includes(value)) continue;

    result.push(Math.round(value + min));
    if (result.length >= numberOfRandoms) break;
  }

  return result;
};
