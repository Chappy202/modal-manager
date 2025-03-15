import { safeStringify, isPlainObject, safeMerge, toDisplayString } from './index';

describe('Utility Functions', () => {
  describe('safeStringify', () => {
    it('should stringify a simple object', () => {
      const obj = { name: 'Test', value: 123 };
      expect(safeStringify(obj)).toBe(JSON.stringify(obj, null, 2));
    });

    it('should stringify a nested object', () => {
      const obj = {
        name: 'Test',
        nested: {
          value: 123,
          array: [1, 2, 3]
        }
      };
      expect(safeStringify(obj)).toBe(JSON.stringify(obj, null, 2));
    });

    it('should handle circular references gracefully', () => {
      const obj: any = { name: 'Test' };
      obj.self = obj; // Create circular reference

      expect(safeStringify(obj)).toBe('[Error: Unable to stringify value]');
    });

    it('should handle non-object values', () => {
      expect(safeStringify('string')).toBe(JSON.stringify('string', null, 2));
      expect(safeStringify(123)).toBe(JSON.stringify(123, null, 2));
      expect(safeStringify(null)).toBe(JSON.stringify(null, null, 2));
      expect(safeStringify(undefined)).toBe(JSON.stringify(undefined, null, 2));
    });
  });

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    it('should return false for class instances', () => {
      class TestClass {}
      expect(isPlainObject(new TestClass())).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
    });
  });

  describe('safeMerge', () => {
    it('should merge two objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      expect(safeMerge(target, source)).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should handle non-object target', () => {
      const target = null;
      const source = { a: 1, b: 2 };

      expect(safeMerge(target, source)).toEqual({ a: 1, b: 2 });
    });

    it('should handle non-object source', () => {
      const target = { a: 1, b: 2 };
      const source = null;

      expect(safeMerge(target, source)).toEqual({ a: 1, b: 2 });
    });

    it('should handle both non-object inputs', () => {
      expect(safeMerge(null, null)).toEqual({});
      expect(safeMerge(undefined, undefined)).toEqual({});
      expect(safeMerge('string', 123)).toEqual({});
    });
  });

  describe('toDisplayString', () => {
    it('should convert primitive values to strings', () => {
      expect(toDisplayString('string')).toBe('string');
      expect(toDisplayString(123)).toBe('123');
      expect(toDisplayString(true)).toBe('true');
      expect(toDisplayString(null)).toBe('null');
      expect(toDisplayString(undefined)).toBe('undefined');
    });

    it('should stringify objects', () => {
      const obj = { name: 'Test' };
      expect(toDisplayString(obj)).toBe(safeStringify(obj));
    });

    it('should stringify arrays', () => {
      const arr = [1, 2, 3];
      expect(toDisplayString(arr)).toBe(safeStringify(arr));
    });

    it('should handle complex objects', () => {
      const complex = {
        name: 'Test',
        values: [1, 2, 3],
        nested: {
          a: 1,
          b: 2
        }
      };
      expect(toDisplayString(complex)).toBe(safeStringify(complex));
    });
  });
});
