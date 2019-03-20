import isMeta from './is-meta';
import isEvent from './is-event';
import convertMeta from './convert-meta';
import convertEvent from './convert-event';

const getType = (record) => {
  let type;
  if (isMeta(record)) {
    type = 'meta';
  } else if (isEvent(record)) {
    type = 'event';
  }

  return type;
};

export default (record) => {
  let convert;

  const type = getType(record);
  switch (type) {
    case 'meta':
      convert = convertMeta;
      break;
    case 'event':
      convert = convertEvent;
      break;
    default:
      break;
  }

  return {
    type,
    fields: convert(record)
  };
};
