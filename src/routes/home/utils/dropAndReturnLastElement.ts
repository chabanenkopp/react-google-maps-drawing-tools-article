import * as R from "ramda";

export const dropAndReturnLastElement = <T>(elements: T[]): [T[], T] => {
  const lastElement = R.last(elements)!;
  const elementsWithoutLast = R.dropLast(1, elements);

  return [elementsWithoutLast, lastElement];
};
