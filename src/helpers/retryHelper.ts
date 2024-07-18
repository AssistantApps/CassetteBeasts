interface IRetryProps<T> {
  func: () => Promise<T>;
  attempts: number;
  onError?: (ex: unknown) => void;
}

export const retryAsync = async <T>(props: IRetryProps<T>): Promise<T | undefined> => {
  for (let attemptNum = 0; attemptNum < props.attempts; attemptNum++) {
    try {
      const result = await props.func();
      return result;
    } catch (ex) {
      if (attemptNum + 1 < props.attempts) continue;
      props.onError?.(ex);
    }
  }
};
