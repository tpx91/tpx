/**
 * This function replaces a specific object inside an array.
 * The object has to be defined by an unique ref attribute because object instances might not be the same.
 * The new object replaces the object with the same ref attribute value in the array.
 * @param items Array of objects containing the object to be replaced
 * @param item Object to replace a specific object of array
 * @param identifier attribute name of object to identify the object to replace
 * @returns Array containing the new element inserted by this function
 */
export function replaceArrayItem<T>(
  items: T[],
  item: T,
  identifier: string = 'ref'
): T[] {
  if (!items || items.length === 0) {
    return [item];
  } else {
    return [...items].map((element) =>
      element[identifier] === item[identifier] ? item : element
    );
  }
}
