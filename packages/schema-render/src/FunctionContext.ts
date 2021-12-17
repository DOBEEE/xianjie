export default class FunctionContext {
  fields: any;

  constructor(fields, jsFunctionContext = {}) {
    Object.assign(this, jsFunctionContext);
    this.fields = fields;
  }

  // 设置某表单项的值
  setValue(path: string, data: any) {
    const _path = this.formatPath(path);
    this.fields.setItemValueField({ from: 'link', id: _path, value: data });
  }

  // 设置某表单项的conf
  setConf(path: string, options: any) {
    const _path = this.formatPath(path);
    this.fields.setItemStateField(_path, options);
  }

  // 检测某表单项
  checkItem(path: string) {
    const _path = this.formatPath(path);
    const checkRes = this.fields.startCheckItem(_path);
    const fieldItem = this.fields.getItem(_path);
    fieldItem.setWarnText(fieldItem.warnText);
    fieldItem.setErrorText(fieldItem.errorText);

    return checkRes;
  }

  /**
   *
   * @param fields
   * @param callback
   */
  public onValueChange = (fields, callback) => {
    this.fields.onValueChange(fields, (params) => callback.call(this, params));
  };

  /**
   *
   * @param fields
   * @param callback
   */
  public onStateChange = (fields, callback) => {
    this.fields.onStateChange(fields, (params) => callback.call(this, params));
  };

  /**
   *
   * @param fields
   * @param callback
   * onFieldChange(['a.b.c', 'a.b.c#value', 'a.b.c#hidden'], () => {})
   */
  public onFieldChange = (fields, callback) => {
    this.fields.onFieldChange(fields, (params) => callback.call(this, params));
  };

  private formatPath(path) {
    const _pathArr = path.split('.');
    let res = path;
    if (_pathArr[0] !== 'root') {
      res = 'root.' + path;
    }
    return res;
  }
}
