import toJSON from './to-json';
import toTSV from './to-tsv';

export default (events, options = {}) => {
  const { format = 'tsv' } = options;

  let convert;
  switch (format) {
    case 'json':
      convert = toJSON;
      break;
    case 'tsv':
      convert = toTSV;
      break;
    default:
      throw new Error(`Unknown output format ${format}`);
  }

  return convert(events, options);
};
