import types from '../types';
import formatters from './formatters';

export default (val, options = {}) => {
  const { type } = types.find(t => t.check(val));
  const { formatter = 'clickhouse' } = options;
  const format = formatters[formatter][type];
  return format(val);
};
