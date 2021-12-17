import { isNone, get } from './utils';

class Schema {
  type: string;

  path: string;

  componentName: string;

  children: any[];

  schema: any;

  items: any;

  required: any;

  rules: any[];

  draft: boolean;

  requiredMessage: string;

  constructor({ schema, parent = null }) {
    this.type = 'component';
    Object.assign(this, schema);
    this.path = '';
    this.schema = schema;
    this.children = [];
    if (!parent) {
      this.type = 'root';
      this.path = 'root';
    } else {
      this.path = parent.path + '.' + schema.name;
      parent.addChild(this);
    }
    this.initChildren();
    this.initRules();
  }

  isNormalNode() {
    return this.type === 'component';
  }

  getState() {
    const { type, path, children, schema, initChildren, addChild, createArrayChildren, ...state } =
      this;
    return state;
  }

  initChildren() {
    if (
      (this.type === 'root' || this.type === 'group') &&
      this.schema.children &&
      this.schema.children.length > 0
    ) {
      this.schema.children.forEach((item) => {
        new Schema({ schema: item, parent: this });
      });
    }
  }

  initRules() {
    if (this.required && this.type !== 'group' && this.type !== 'array' && this.type !== 'root') {
      this.rules = [
        {
          message: this.requiredMessage || '这里不能为空',
          handle: (value) => {
            return !isNone(value);
          },
        },
        ...this.rules,
      ];
    }
  }

  addChild(child) {
    this.children.push(child);
  }

  initChildrenByValue(value) {
    if (this.type !== 'array') {
      return;
    }
    if (value.length > this.children.length) {
      for (let index = 0; index < value.length - this?.children?.length; index++) {
        this.createArrayChildren();
      }
    }
  }

  createArrayChildren() {
    new Schema({
      schema: {
        name: this.children.length,
        type: 'group',
        children: this.items,
      },
      parent: this,
    });
  }

  delArrayChildren() {
    this.children.splice(this.children.length - 1, 1);
  }
}

export default Schema;
