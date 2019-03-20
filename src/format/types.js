import {
  isString,
  isNumber,
  isDate,
  isNull
} from '../utils/helpers';

export default [
  {
    check: isString,
    type: 'string'
  },
  {
    check: isNumber,
    type: 'number'
  },
  {
    check: isDate,
    type: 'date'
  },
  {
    check: isNull,
    type: 'null'
  },
  {
    check: true,
    type: null
  }
];
