export const isString = v => typeof v === 'string';
export const isNumber = v => typeof v === 'number';
export const isBoolean = v => typeof v === 'boolean';
export const isDate = v => v instanceof Date;
export const isNull = v => v === null;
export const isUndefined = v => typeof v === 'undefined';
export const isObject = v => !isNull(v) && typeof v === 'object';
export const isArray = v => Array.isArray(v);
export const keys = obj => Object.keys(obj);

export const escape = str => str
  .replace(/\\/g, '\\\\')
  .replace(/\0/g, '')
  .replace(/\f/g, '\\n')
  .replace(/\n/g, '\\n')
  .replace(/\t/g, '\\t')
  .replace(/\r/g, '')
  .replace(/\v/g, '\\n');
