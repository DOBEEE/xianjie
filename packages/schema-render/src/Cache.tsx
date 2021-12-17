import { get } from './utils';

class Cache {
  values: any;

  constructor(values) {
    this.values = values;
  }

  getValue(path) {
    return get(this.values, path);
  }
}

export default Cache;
