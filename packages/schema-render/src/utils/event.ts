const PATH_MARK = '#';

const match = (realPath: string, pathPattern: string) => {
  if (realPath === pathPattern) {
    return true;
  }
  const realPaths = realPath.split(PATH_MARK);
  const patterns = pathPattern.split(PATH_MARK);
  if (realPaths[0] !== patterns[0]) {
    return false;
  }
  if (patterns[1] === '*') {
    return true;
  }
  if (patterns[1] === 'state*' && realPaths[1] !== 'value') {
    return true;
  }
  if (realPaths[1] !== patterns[1]) {
    return false;
  }
  return true;
};

// TODO: 如果每一个onChange中自带本身的path
export default class Events {
  private events: any;

  constructor() {
    this.events = {};
  }

  emit(key: string, params: any) {
    if (this.events[key] && this.events[key].size > 0) {
      this.events[key].forEach(async (item: any) => {
        if (item.once) {
          this.events[key].delete(item);
        }
        item.handler(params);
      });
    }
  }

  // a#value
  // a.b.c#state
  batchEmit(key: string, params: any) {
    // TODO: 遍历队列得到，或者重新构建索引派发更像rx
    Object.keys(this.events).forEach((i) => {
      const keys = i.split(',');
      const findIndex = keys.findIndex((k) => match(key, k));
      // TODO: 路径匹配
      if (findIndex > -1) {
        this.events[i].forEach(async (item: any) => {
          if (item.once) {
            this.events[i].delete(item);
          }
          item.handler(params);
        });
      }
    });
  }

  // path#value
  // path#*
  // path#state*
  // path#hidden
  register(key: string, cb: (val: any) => void) {
    const item = {
      once: false,
      handler: cb,
    };
    this.events[key] ? this.events[key].add(item) : (this.events[key] = new Set([item]));
    return () => {
      this.events[key].delete(item);
    };
  }

  once(key: string, cb: (val: any) => void) {
    const item = {
      once: true,
      handler: cb,
    };
    this.events[key] ? this.events[key].add(item) : (this.events[key] = new Set([item]));
  }
}
