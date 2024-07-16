export const anyObject: any = {};
export const fakePromise = (): Promise<unknown> => new Promise((res) => res({}));
export const promiseFromResult = <T>(result: T): Promise<T> => new Promise((res) => res(result));

export type ObjectWithPropsOfValue<T> = { [p: string]: T };
