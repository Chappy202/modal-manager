/**
 * Safely stringify any value
 * @param value - The value to stringify
 * @returns A string representation of the value
 */
export const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '[Error: Unable to stringify value]';
  }
};

/**
 * Check if a value is a plain object
 * @param value - The value to check
 * @returns True if the value is a plain object
 */
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  // Handle Object.create(null)
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};

/**
 * Safely merge objects
 * @param target - The target object
 * @param source - The source object
 * @returns A new object with merged properties
 */
export const safeMerge = <T extends Record<string, unknown>>(
  target: unknown,
  source: unknown
): T => {
  const result: Record<string, unknown> = {};

  // Add target properties
  if (isPlainObject(target)) {
    Object.entries(target).forEach(([key, value]) => {
      result[key] = value;
    });
  }

  // Add source properties
  if (isPlainObject(source)) {
    Object.entries(source).forEach(([key, value]) => {
      result[key] = value;
    });
  }

  return result as T;
};

/**
 * Safely convert any value to a React-renderable string
 * @param value - The value to convert
 * @returns A string representation that can be safely rendered in React
 */
export const toDisplayString = (value: unknown): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (isPlainObject(value) || Array.isArray(value)) {
    return safeStringify(value);
  }
  return String(value);
};
