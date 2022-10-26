interface Id {
  id: number;
}

interface Props<T> {
  id: number;
  elements: T[];
}

export const dropAndReturnElementById = <T extends Id>({
  id,
  elements,
}: Props<T>): [T[], T] => {
  const currentElement = elements.find(
    ({ id: elementId }: { id: number }) => elementId === id
  )!;

  const elementsWithoutCurrent = elements.filter(
    ({ id: elementId }: { id: number }) => id !== elementId
  );

  return [elementsWithoutCurrent, currentElement];
};
