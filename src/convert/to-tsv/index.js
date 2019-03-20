import getters from '../getters';
import format from '../../format/to-tsv';
import { keys } from '../../utils/helpers';


const convertTitle = names => names.reduce((acc, name) => (
  (acc === '') ? name : `${acc}\t${name}`), '');


export default (events, options = {}) => {
  if (events.length === 0) {
    return '';
  }

  const fieldNames = options.fields || keys(getters);
  if (fieldNames.length === 0) {
    return '';
  }

  const { formatVariant = 'TSV' } = options;

  let title = '';
  if (formatVariant === 'TSVWithNames') {
    title = convertTitle(fieldNames);
  }

  return events.reduce((text, record) => {
    const line = fieldNames.reduce((acc, name) => {
      const get = getters[name];
      const val = get(record);
      return (acc === '') ? format(val)
        : `${acc}\t${format(val)}`;
    }, '');

    return (text === '') ? line : `${text}\n${line}`;
  }, title);
};
