export const range = (from: number, to: number) =>
  [...Array(to + 1 - from)].map((_, i) => i + from);
