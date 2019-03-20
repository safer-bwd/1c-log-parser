import { toString, toNumber } from './converters';

const types = {
  1: 'user',
  2: 'computer',
  3: 'application',
  4: 'event',
  5: 'metadata',
  6: 'server',
  7: 'port',
  8: 'syncPort'
};

const converters = {
  user: (name, id) => ({ id, name: toString(name) }),
  computer: toString,
  application: toString,
  event: toString,
  metadata: (name, id) => ({ id, name: toString(name) }),
  server: toString,
  port: toNumber,
  syncPort: toNumber
};

const TYPES_WITH_ID = ['user', 'metadata'];

export default ({ fields }) => {
  const typeId = fields[0];
  const type = types[typeId];
  if (!type) {
    return { type };
  }

  const convert = converters[type];
  let record;

  if (TYPES_WITH_ID.includes(type)) {
    const [, id, val, key] = fields;
    const value = convert(val, id);
    record = { type, key, value };
  } else {
    const [, val, key] = fields;
    const value = convert(val);
    record = { type, key, value };
  }

  return record;
};
