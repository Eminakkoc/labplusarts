import type { DataTableValue } from '../components/DataTable';

export type PrimitiveType = 'string' | 'number' | 'boolean' | 'null' | 'undefined';

export function convertStringToPrimitive(
  value: string,
  toType: DataTableValue,
): string | number | boolean | null | undefined {
  // Map typeof result to PrimitiveType
  let type: 'string' | 'number' | 'boolean' | 'null' | 'undefined';
  const rawType = typeof toType;
  if (
    rawType === 'string' ||
    rawType === 'number' ||
    rawType === 'boolean' ||
    rawType === 'undefined'
  ) {
    type = rawType;
  } else if (toType === null) {
    type = 'null';
  } else {
    type = 'string';
  }

  switch (type) {
    case 'string':
      return value;
    case 'number': {
      const num = Number(value);
      return isNaN(num) ? value : num;
    }
    case 'boolean':
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
      return value;
    case 'null':
      return value === 'null' ? null : value;
    case 'undefined':
      return value === 'undefined' ? undefined : value;
    default:
      return value;
  }
}
