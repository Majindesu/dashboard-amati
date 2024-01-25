/**
 * Maps each key of an object to the first value in its corresponding array.
 *
 * @template T The object type, where each key has an array of strings as its value.
 * @param someObject The object to be transformed.
 * @returns An object with the same keys, but each key maps to the first string in the original array.
 */
const mapObjectToFirstValue = <T extends { [key: string]: string[] }>(
	someObject: T
): { [K in keyof T]: string } =>
	Object.entries(someObject).reduce((prev, [k, v]) => {
		prev[k as keyof T] = v[0];
		return prev;
	}, {} as { [K in keyof T]: string });

export default mapObjectToFirstValue;
