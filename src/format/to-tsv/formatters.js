import { escape } from '../../utils/helpers';

const standart = {
  string: v => escape(v),
  number: v => JSON.stringify(v),
  date: v => v.toISOString(),
  null: () => 'null'
};

const toDate = v => v.toISOString()
  .replace(/T/g, ' ')
  .replace(/\.\d{3}Z/, '');

const clickhouse = {
  ...standart,
  date: toDate,
  null: () => '\\N'
};

export default {
  standart,
  clickhouse
};
