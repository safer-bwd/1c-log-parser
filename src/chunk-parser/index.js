import _isNull from 'lodash/isNull';
import _keys from 'lodash/keys';
import MetaCollection from './meta-collection';
import convertRecord from './convert-record';

const Token = {
  LBRACE: '{',
  RBRACE: '}',
  QUOTE: '"',
  COMMA: ',',
};

class ChunkParser {
  constructor() {
    this.source = '';
    this.position = 0;
    this.meta = new MetaCollection();
  }

  parse(chunk) {
    this.source += chunk;
    const events = [];

    while (true) {
      this.skipToRecord();

      const record = this.parseRecord();
      if (_isNull(record)) {
        break;
      }

      const { type, fields } = record;
      switch (type) {
        case 'meta':
          this.addMeta(fields);
          break;
        case 'event':
          events.push(this.insertMeta(fields));
          break;
        default:
          throw new Error(''); // TODO
      }

      this.skipSeparator();
    }

    this.source = this.source.slice(this.position);
    this.position = 0;

    return events;
  }

  parseRecord() {
    if (this.isSourceEnd()) {
      return null;
    }

    const startPos = this.position;
    const char = this.source[this.position];

    if (char !== Token.LBRACE) {
      throw new Error(''); // TODO
    }
    this.position += 1;

    const fieldVals = this.scanFields();
    if (_isNull(fieldVals)) {
      this.position = startPos;
      return null;
    }

    const record = {
      fields: fieldVals
    };
    return convertRecord(record);
  }

  scanFields() {
    const fieldVals = [];

    let endFound = false;
    const isFieldsEnd = () => (
      this.source[this.position] === Token.RBRACE);

    while (true) {
      this.skipWhiteSpace();

      const fieldVal = this.scanField();
      if (_isNull(fieldVal)) {
        break;
      }

      fieldVals.push(fieldVal);

      if (isFieldsEnd()) {
        endFound = true;
        this.position += 1;
        break;
      } else {
        this.skipSeparator();
      }
    }

    return endFound ? fieldVals : null;
  }

  scanField() {
    let insideString = false;
    let braceDepth = 0;
    let endFound = false;
    const isFieldEnd = ch => !insideString && braceDepth === 0
      && (ch === Token.COMMA || ch === Token.RBRACE);

    let val = '';
    while (true) {
      if (this.isSourceEnd()) {
        break;
      }

      const char = this.source[this.position];
      if (isFieldEnd(char)) {
        endFound = true;
        break;
      }

      switch (char) {
        case Token.QUOTE:
          insideString = !insideString;
          break;
        case Token.LBRACE:
          if (!insideString) {
            braceDepth += 1;
          }
          break;
        case Token.RBRACE:
          if (!insideString) {
            braceDepth -= 1;
          }
          break;
        default:
          break;
      }

      val += char;
      this.position += 1;
    }

    return endFound ? val.trim() : null;
  }

  isSourceEnd() {
    return this.source.length === this.position;
  }

  skipToRecord() {
    this.skipTitle();
    this.skipGroupTitle();
    this.skipWhiteSpace();
  }

  skipTitle() {
    const pattern = /\s*1CV8LOG\(ver 2\.\d+\)\s+[0-9a-f-]{36}/i;
    this.skipByPattern(pattern);
  }

  skipGroupTitle() {
    const pattern = /\s*{"DatesMap",\s*{\d{14},\d+}\s*}/i;
    this.skipByPattern(pattern);
  }

  skipWhiteSpace() {
    const pattern = /\s*/;
    this.skipByPattern(pattern);
  }

  skipSeparator() {
    const pattern = /\s*,/;
    this.skipByPattern(pattern);
  }

  skipByPattern(pattern) {
    const regexp = new RegExp(pattern, 'y');
    regexp.lastIndex = this.position;

    const result = this.source.match(regexp);
    if (!result) {
      return;
    }

    this.position = regexp.lastIndex;
  }

  addMeta({ type, key, value }) {
    if (!type) {
      return; // TODO unknown type
    }
    this.meta.add(type, key, value);
  }

  insertMeta(fields) {
    const names = _keys(fields);
    return names.reduce((acc, name) => {
      let newAcc;
      if (this.meta.hasType(name)) {
        const key = fields[name];
        const val = _isNull(key) ? key : this.meta.get(name, key);
        newAcc = { ...acc, [name]: val };
      } else {
        newAcc = { ...acc, [name]: fields[name] };
      }
      return newAcc;
    }, {});
  }
}
export default ChunkParser;
