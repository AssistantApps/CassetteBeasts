export const oneDayInMs = 24 * 60 * 60 * 1000;

export const longDate = (date?: Date): string => {
  return (date ?? new Date()).toString().split(' ').slice(0, 4).join(' ');
};
export const isoDate = (date?: Date): string => {
  return (date ?? new Date()).toISOString().split('T')[0];
};
