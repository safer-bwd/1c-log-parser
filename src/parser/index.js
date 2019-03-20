import Parser from '../chunk-parser';

export default {
  parse(text) {
    const parser = new Parser();
    const parsed = parser.parse(text);
    if (parser.isSourceEnd()) { // TODO bad name
      throw new Error(''); // TODO
    }
    return parsed;
  }
};
