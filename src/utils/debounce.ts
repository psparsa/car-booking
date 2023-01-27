/* eslint-disable fp/no-rest-parameters */
const timeout = { fun: 0 };
export const debounce = <T extends (...args: unknown[]) => unknown>(
  cb: T,
  ms: number
): ((...args: Parameters<T>) => void) => {
  return (...args: [...Parameters<T>]): void => {
    clearTimeout(timeout.fun);
    Reflect.set(
      timeout,
      'fun',
      window.setTimeout(() => cb(...args), ms)
    );
  };
};
