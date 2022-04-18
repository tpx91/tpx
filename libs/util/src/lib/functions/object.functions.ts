/**
 * Checks if object is null or undefined
 * @param object object nullOrUndefined-check
 * @returns true of object is null or undefined
 */
export function isNullOrUndefined(object: any): boolean {
  return object === null || object === undefined;
}

/**
 * checks if value is an object
 * @param val value to check
 * @returns true if val is an object
 */
export function isObject(val) {
  return val === Object(val);
}
