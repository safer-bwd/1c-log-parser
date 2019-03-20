import {
  toString, toNumber, toDate, hexToDec
} from './converters';

const TransStatuses = {
  N: 'NotApplicable',
  U: 'Unfinished',
  R: 'RolledBack',
  C: 'Committed'
};

const EventLevels = {
  I: 'Information',
  E: 'Error',
  W: 'Warning',
  N: 'Note'
};

const fieldNames = {
  1: 'date',
  2: 'transactionStatus',
  3: 'transaction',
  4: 'user',
  5: 'computer',
  6: 'application',
  7: 'connection',
  8: 'event',
  9: 'level',
  10: 'comment',
  11: 'metadata',
  12: 'data',
  13: 'dataPresentation',
  14: 'server',
  15: 'port',
  16: 'syncPort',
  17: 'session',
  // TODO 18, 19
};

const convertKey = v => (v === '0' ? null : v);

const convertData = (v) => {
  const UNDEFINED_1C = '{"U"}';
  return (v === UNDEFINED_1C) ? '' : v;
};

const convertTransaction = (v) => {
  const [, dateHex, idHex] = v.match(/{([\da-f]+),([\da-f]+)}/i);
  const id = hexToDec(idHex);
  if (!id) {
    return null;
  }
  const startOffset = Number(new Date('0001-01-01T00:00:00Z'));
  const offset = hexToDec(dateHex) / 10;
  const date = new Date(startOffset + offset);
  return { id, date };
}

const fieldConverters = {
  date: toDate,
  transactionStatus: v => TransStatuses[v],
  transaction: convertTransaction,
  user: convertKey,
  computer: convertKey,
  application: convertKey,
  connection: toNumber,
  event: convertKey,
  level: v => EventLevels[v],
  comment: toString,
  metadata: convertKey,
  data: convertData, // TODO deep parse?
  dataPresentation: toString,
  server: convertKey,
  port: convertKey,
  syncPort: convertKey,
  session: toNumber
};

export default ({ fields }) => fields.reduce((acc, val, index) => {
  const name = fieldNames[index + 1];
  if (!name) {
    return acc;
  }
  const convert = fieldConverters[name];
  return { ...acc, [name]: convert(val) };
}, {});
