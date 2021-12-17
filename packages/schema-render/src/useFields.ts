import { createElement, FC, useRef, useState, useEffect } from 'rax';
import { isNone, get, set, pageScrollTo } from './utils';
import Event from './utils/event';
import { getCurrentPages } from '@uni/application';
import storage from '@uni/storage';
import { Store } from '../types/interface';

interface ArrayOperations {
  add: () => void;
  del: () => void;
}
export class FormStore {
  public status: string;

  public arrayOperations: ArrayOperations;

  public formId: string;

  public forceRootUpdate: () => void;

  private changeEvts = new Event();

  private store: Store = {};

  private setConfListCache: (conf: any, values: any) => void;

  private values: Record<string, unknown>;

  private startCheck: any;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor({ forceRootUpdate, formId }) {
    // this.confList = confList;
    this.formId = formId;
    this.forceRootUpdate = forceRootUpdate;
    this.values = {};
  }

  public reset = () => {
    this.setValues({});
  };

  public setFormStatus = (status) => {
    this.status = status;
  };

  // 历史记录功能获取
  public getAssociationValue = () => {
    const data = storage.getStorageSync({ key: this.formId }).data;
    return data;
  };

  // 历史记录功能设置
  public setAssociationValue = (data) => {
    storage.setStorage({ key: this.formId, data });
  };

  // 草稿功能获取
  public getDraftValue = () => {
    const data = storage.getStorageSync({ key: `${this.formId}_draft` }).data;
    return data;
  };

  // 草稿功能设置
  public updateDraftValue = () => {
    const oldData = this.getDraftValue() || {};
    storage.setStorage({ key: `${this.formId}_draft`, data: { ...oldData, ...this.values } });
  };

  // 草稿功能清除
  public clearDraftValue = () => {
    storage.setStorage({ key: `${this.formId}_draft`, data: '' });
  };

  public getValues = () => {
    return this.values;
  };

  public startCheckItem = (id: string) => {
    if (!this.store[id]) {
      return;
    }
    if (this.store[id].rules && this.store[id].rules.length > 0) {
      this.store[id].rules.some((rule: any) => {
        if (rule.onlyCheckOnSubmit) {
          return false;
        }
        if (!rule.handle(this.store[id].value, this.store[id].schema, this)) {
          let mes = rule.message;
          if (typeof rule.message === 'function') {
            mes = rule.message(this.store[id].value, this.store[id].schema, this);
          }
          if (rule.type === 'warn') {
            this.store[id].warnText = mes;
            return true;
          }
          this.store[id].checkStatus = false;
          this.store[id].errorText = mes;
          return true;
        } else {
          if (rule.type === 'warn') {
            this.store[id].warnText = '';
            return true;
          }
          this.store[id].checkStatus = true;
          this.store[id].errorText = '';
          return false;
        }
      });
    }
  };

  public startCheckAll = () => {
    Object.entries(this.store).forEach(([key, value]) => {
      if (value.status !== 'normal') {
        return;
      }
      this.startCheckItem(key);
    });
  };

  public getAllCheckRes = () => {
    let res = true;
    Object.entries(this.store).forEach(([key, value]) => {
      if (value.status !== 'normal') {
        return;
      }
      if (!value.checkStatus) {
        res = false;
      }
    });
    return res;
  };

  public getItems = () => {
    return this.store;
  };

  public getItem = (path: string) => {
    return this.store[path];
  };

  public setItemSetSelf = (
    id: string,
    setSelf: any,
    setV: any,
    setErrorText: any,
    setWarnText: any
  ) => {
    // const prevStore = this.store;
    if (this.store[id]) {
      this.store[id].setState = setSelf;
      this.store[id].setV = setV;
      this.store[id].setErrorText = setErrorText;
      this.store[id].setWarnText = setWarnText;
    }
  };

  public getValueByPath = (path) => {
    const _path = path
      .split('.')
      .filter((i) => i !== 'root')
      .join('.');
    return _path ? get(this.values, _path) : this.values;
  };

  public delItem = (path) => {
    if (!this.store[path]) return;
    delete this.store[path];
    // unset(this.values, path);
  };

  // 根据 schema 初始化 formStore
  public initStoreBySchema = (schema, data?) => {
    if (schema.type === 'root') {
      this.values = data;
      this.setFormStatus(schema.readOnly ? 'readOnly' : 'edit');
    } else if (schema.type === 'array') {
      const value = this.getValueByPath(schema.path);
      if (value && value.length > schema?.children?.length) {
        for (let index = 0; index < value.length - schema?.children?.length; index++) {
          schema.createArrayChildren();
        }
      }
    }
    this.initItem({
      path: schema.path,
      value: this.getValueByPath(schema.path),
      schema,
    });
    schema.children &&
      schema.children.length > 0 &&
      schema.children.forEach((item) => this.initStoreBySchema(item, data));
  };

  public setItemStatus = (id, status) => {
    if (!this.store[id]) {
      return;
    }
    this.store[id].status = status;
  };

  public getStatusByConf = (conf) => {
    if (conf.removed) {
      return 'removed';
    } else if (conf.hidden) {
      return 'hidden';
    } else if (conf.disabled) {
      return 'disabled';
    } else if (this.status === 'readOnly' || conf.readOnly) {
      return 'readOnly';
    } else {
      return 'normal';
    }
  };

  public setArrayFuns = (options) => {
    this.arrayOperations = options;
  };

  // 只在初始化的时候用
  // 根据表单项 schema 生成对应的 formStore
  public initItem = ({ path, value, schema }): any => {
    let res;
    if (this.store[path]) {
      res = {
        ...this.store[path],
        rules: [...this.store[path].rules, ...(schema.rules || [])],
      };
      if (!this.store[path].status) {
        // 对于setConf触发的conf改变，需要覆盖原有状态
        res.status = this.getStatusByConf(schema);
      }
    } else {
      res = {
        value,
        checkStatus: true,
        rules: schema.rules || [],
        errorText: '',
        status: this.getStatusByConf(schema),
        type: schema.type,
        schema,
      };
    }
    this.store[path] = res;
  };

  public updateItem = (path, options): any => {
    if (!this.store[path]) return;
    this.store[path] = {
      ...this.store[path],
      rules: [...this.store[path].rules, ...(options.rules || [])],
      status: this.getStatusByConf(options),
    };
  };

  public setItemStateField = (path, options) => {
    if (this.store[path]) {
      this.store[path].setState((s) => {
        let newV = options;
        if (typeof options === 'function') {
          newV = options(s);
        }
        this.updateItem(path, newV);
        return {
          ...s,
          ...newV,
          componentProps: { ...(s.componentProps || {}), ...(newV.componentProps || {}) },
        };
      });
      // 触发 actions
      Object.keys(options).forEach((key) => {
        this.changeEvts.batchEmit(`${path}#${key}`, {
          value: options[key],
          from: `${path}#${key}`,
        });
      });
    }
  };

  public setItemValue = ({ id, value }) => {
    const _path = id
      .split('.')
      .filter((i) => i !== 'root')
      .join('.');
    set(this.values, _path, value);
    if (this.store[id]) {
      this.store[id].value = value;
      if (this.store[id].type === 'array') {
        this.store[id].schema.initChildrenByValue(value);
      }
      this.changeEvts.batchEmit(`${id}#value`, { value, from: `${id}#value` });
    }
  };

  public setItemValueField = ({ id, value, from }) => {
    if (this.store[id]) {
      this.store[id].setV((v) => {
        const newV = { from, value };
        if (typeof value === 'function') {
          newV.value = value(v?.value);
        }
        return newV;
      });
    }
  };

  public getItemCheck = (id) => {
    return this.store[id].checkStatus;
  };

  public setItemCheck = (id, value) => {
    if (this.store[id]) {
      this.store[id].checkStatus = value;
    }
  };

  public setSchema = (schema, values) => {
    values && (this.values = values);
    this.setConfListCache(schema, this.values);
  };

  public setConfListCacheFun = (fn) => {
    this.setConfListCache = fn;
  };

  public submit = ({ autoLocateErr }) => {
    // 自动定位到错误第一项
    autoLocateErr &&
      Object.entries(this.getItems()).some(([key, value]) => {
        if (!value.checkStatus) {
          pageScrollTo({
            selector: `.agro-${key.replace(/\./g, '-')}`,
          });
          return true;
        }
        return false;
      });
    // 自动缓存数据，用作下次联想提示
    if (this.getAllCheckRes()) {
      // 草稿清除
      // formInstance.clearDraftValue();
      const data = this.values;
      this.setAssociationValue(data);
    }
  };

  public setCheckFun = (fn) => {
    this.startCheck = () => fn((i) => i + 1);
  };

  public setValues = (values, from = '') => {
    // 此处不设置this.values 让hooks里去设置
    let _values = this.values;
    if (typeof values === 'function') {
      _values = { ..._values, ...values(this.values) };
    } else {
      _values = { ..._values, ...values };
    }

    this.setItemValueField({ id: 'root', value: _values, from });
  };

  /**
   *
   * @param fields
   * @param callback
   */
  public onValueChange = (fields: string[], callback) => {
    const key = fields
      .map((i) => {
        if (i !== '*' && i.split('.')[0] !== 'root') {
          return `root.${i}#value`;
        }
        return `${i}#value`;
      })
      .join(',');
    this.changeEvts.register(key, (value) => {
      const { from } = value;
      const _from = from.split('#')[0];
      if (_from === 'root') {
        callback && callback({ ...value, from: _from });
      } else {
        callback && callback({ ...value, from: _from.split('.').slice(1).join('.') });
      }
    });
  };

  /**
   *
   * @param fields
   * @param callback
   */
  public onStateChange = (fields, callback) => {
    const stateKeys = fields
      .map((i) => {
        let path = i;
        if (i !== '*' && i.split('.')[0] !== 'root') {
          path = `root.${i}`;
        }
        if (this.store[path]) {
          return `${path}#state*`;
        }
        return `${path}`;
      })
      .join(',');
    this.changeEvts.register(stateKeys, (value) => {
      const { from } = value;
      const _from = from.split('#')[0];
      const _fromInfo = from.split('#')[1];
      if (_from === 'root') {
        callback && callback(value);
      } else {
        callback && callback({ ...value, from: _from.split('.').slice(1).join('.') + _fromInfo });
      }
    });
  };

  /**
   *
   * @param fields
   * @param callback
   */
  public onFieldChange = (fields, callback) => {
    const stateKeys = fields
      .map((i) => {
        let path = i;
        if (i !== '*' && i.split('.')[0] !== 'root') {
          path = `root.${i}`;
        }
        if (this.store[path]) {
          return `${path}#*`;
        }
        return `${path}`;
      })
      .join(',');
    this.changeEvts.register(stateKeys, (value) => {
      const { from } = value;
      const _from = from.split('#')[0];
      const _fromInfo = from.split('#')[1];
      if (_from === 'root') {
        callback && callback(value);
      } else {
        callback && callback({ ...value, from: _from.split('.').slice(1).join('.') + _fromInfo });
      }
    });
  };
}

const useFields = (formId?: string): [FormStore] => {
  const [, forceUpdate] = useState({});
  const forceRootUpdate = () => {
    forceUpdate({});
  };
  let id = formId;
  if (!formId) {
    const pageInfo = getCurrentPages();
    id = `_agro_form_${pageInfo[pageInfo.length - 1].pageId}`;
  }
  const ref = useRef<FormStore>(new FormStore({ forceRootUpdate, formId: id }));

  return [ref.current];
};

export default useFields;
