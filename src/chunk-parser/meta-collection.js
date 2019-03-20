import _keys from 'lodash/keys';
import _has from 'lodash/has';

const types = {
  user: 'user',
  application: 'application',
  computer: 'computer',
  event: 'event',
  metadata: 'metadata',
  server: 'server',
  port: 'port',
  syncPort: 'syncPort'
};

class MetaCollection {
  constructor() {
    const keys = _keys(MetaCollection.TYPES());
    this.collection = keys.reduce((acc, type) => (
      { ...acc, [type]: {} }), {});
  }

  hasType(type) {
    return _has(this.collection, type);
  }

  add(type, key, value) {
    if (!this.hasType(type)) {
      throw new Error(`Unknown meta type ${type}`);
    }

    this.collection[type][key] = value;
  }

  has(type, key) {
    if (!this.hasType(type)) {
      throw new Error(`Unknown meta type ${type}`);
    }

    return _has(this.collection[type], key);
  }

  get(type, key) {
    if (!this.has(type, key)) {
      throw new Error(`Failed to find ${type} with key ${key}`);
    }
    return this.collection[type][key];
  }

  static TYPES() {
    return types;
  }
}

export default MetaCollection;
