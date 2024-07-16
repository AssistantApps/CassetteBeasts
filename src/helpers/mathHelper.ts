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
