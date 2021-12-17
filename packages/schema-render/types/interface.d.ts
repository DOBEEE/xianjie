import { FormStore } from '../src/useFields';
import Schema from '../src/Schema';
import Cache from '../src/Cache';
import FunctionContext from '../src/FunctionContext';
import { FC, RaxNode } from 'rax';

export interface ItemStore {
  value: any;
  checkStatus: boolean;
  rules: any[];
  errorText: string;
  warnText: string;
  status: 'hidden' | 'readOnly' | 'normal' | 'removed' | 'disabled';
  type: 'root' | 'componet' | 'array' | 'group';
  schema: Schema;
  setWarnText: (val: any) => any;
  setErrorText: (val: any) => any;
  setState: (val: any) => any;
  setV: (val: any) => any;
}
export interface Store {
  [index: string]: ItemStore;
}
export interface repeatIds {
  [index: string]: string[];
}
export interface SetItemByConfOptions {
  id: string;
  value?: any;
  conf: any;
  overwrite?: any;
}
export interface ComponentsMap {
  [key: string]: RaxNode;
}
export interface FormProps {
  schema: any[];
  initialValues?: any;
  fields: FormStore;
  componentsMap: ComponentsMap;
  formItem?: FC<any>;
  methods?: Method;
  jsFunctionContext?: JsFunctionContext;
  actions?: () => void;
}
export interface JsFunctionContext {
  utils?: any;
  services?: any;
}
export interface RootContext {
  methods?: Method;
  componentsMap: ComponentsMap;
  formItem?: FC<any>;
  fields: FormStore;
  cache: Cache;
  schema: Schema;
  functionContext: FunctionContext & JsFunctionContext;
}
export interface Method {
  [key: string]: (MethodProps) => void;
}
export interface MethodProps {
  path: string;
  schema: Schema;
  state: any;
  value: any;
  oldValue?: any;
  changeFrom?: string;
  changePath?: string;
}
export interface RepeatFormOptions {
  id: string;
  type: 'repeatForm';
  hidden?: boolean;
  readOnly?: boolean;
  title?: string;
  maxRepeatNum?: number;
  increase: boolean;
  canDelFirst: boolean;
  hideDefaultItem: boolean;
  onChange?: (options: any) => void;
  content: any[];
  rightBtnText?: string;
  confList?: Array<Record<string, unknown>>;
}
export interface RepeatFormItem {
  num: number;
  options: RepeatFormOptions;
  itemNum: number;
  content: any[];
}
export interface RepeatForm {
  [key: string]: RepeatFormItem;
}
