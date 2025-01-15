/**
  * Clear an object setting all by default values
  * @param obj: T
  * @returns T
*/
export const clearObject = <T extends object>(obj: T): T => {
  const keys = Object.keys(obj) as Array<keyof T>;
  for (const key of keys) {
    if (typeof obj[key] === 'string') {
      obj[key] = '' as any;
    } else if (typeof obj[key] === 'number') {
      obj[key] = 0 as any;
    }
  }
  return obj;
}