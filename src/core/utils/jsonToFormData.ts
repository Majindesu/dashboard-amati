/**
 * Converts a JSON object to FormData.
 *
 * @param json - The JSON object to be converted into FormData. The object can
 * include nested objects and arrays. Nested objects are flattened according
 * to the FormData encoding conventions, with keys indicating the path to each
 * value and arrays being treated with indices.
 * @returns A FormData object containing the keys and values from the input JSON.
 * Each key in the JSON object is represented in the FormData, with its corresponding
 * value. Nested objects and arrays are handled by appending square brackets to the key
 * names to indicate the structure in the FormData.
 */
export default function jsonToFormData(json: Record<string, any>): FormData {
    const formData = new FormData();
    Object.keys(json).forEach((key) => {
        const value = json[key];
        if (Array.isArray(value)) {
            // Handle array values by appending each item with an index
            value.forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
            });
        } else if (typeof value === "object" && value !== null) {
            // Handle nested objects by appending each sub-key
            Object.keys(value).forEach((subKey) => {
                formData.append(`${key}[${subKey}]`, value[subKey]);
            });
        } else {
            // Handle simple types (strings, numbers, etc.)
            formData.append(key, value);
        }
    });
    return formData;
}
