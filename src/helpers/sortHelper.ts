export const sortByStringProperty =
  <T>(getProp: (t: T) => string) =>
  (a: T, b: T) => {
    if (getProp(a) < getProp(b)) {
      return -1;
    }
    if (getProp(a) > getProp(b)) {
      return 1;
    }
    return 0;
  };
