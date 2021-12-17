import { createElement, FC, useState, useRef, useEffect, useMemo, useContext } from 'rax';
import { SchemaContext } from '../context';

export const useSubmitCheckCb = (valueId, fields, checkSign, setErrorText, setWarnText, conf) => {
  // const { fields, checkSign, readOnly } = props;
  const dataRef = useRef(checkSign);
  useEffect(() => {
    const readOnly = fields.status === 'readOnly' || conf.readOnly;
    if (
      conf.hidden ||
      conf.disabled ||
      conf.removed ||
      readOnly ||
      checkSign === 0 ||
      dataRef.current === checkSign
    ) {
      return;
    }
    dataRef.current = checkSign;
    setErrorText(fields.getItem(valueId)?.errorText);
    setWarnText(fields.getItem(valueId)?.warnText);
  }, [checkSign, fields, conf]);
};
export const useCheckCb = (schema, path, type, conf, setErrorText, setWarnText, val, parent) => {
  const { fields, functionContext, methods } = useContext(SchemaContext);
  const dataRef = useRef(val.value);

  const id = path;

  useEffect(() => {
    const v = val.value;
    const readOnly = fields.status === 'readOnly' || conf.readOnly;

    if (JSON.stringify(dataRef.current) === JSON.stringify(v)) {
      return;
    }

    const oldParentValue = parent ? fields.getValueByPath(parent.path) : '';
    fields.setItemValue({
      id,
      value: v,
    });

    // 草稿保存
    !readOnly && fields.updateDraftValue();

    if (val.noCheck) {
      // 只设置value，不触发onchange以及校验
      return;
    }
    conf?.events?.onChange &&
      methods[conf?.events?.onChange] &&
      methods[conf?.events?.onChange].call(functionContext, {
        path,
        schema,
        state: conf,
        value: v,
        oldValue: dataRef.current,
        changeFrom: val.from,
      });
    // 来自父级的change 不需要调用父级的change
    val.from !== 'parent' &&
      parent?.events?.onChange &&
      methods[parent?.events?.onChange] &&
      methods[parent?.events?.onChange].call({
        path,
        schema,
        state: conf,
        value: fields.getValueByPath(parent.path),
        oldValue: oldParentValue.current,
        changeFrom: val.from,
        changePath: path,
      });
    dataRef.current = v;
    if (readOnly || conf.hidden || conf.disabled || conf.removed || !fields.getItem(id)) {
      return;
    }

    fields.startCheckItem(id);
    setWarnText(fields.getItem(id)?.warnText);
    setErrorText(fields.getItem(id).errorText);
  }, [val, conf]);
};

export const useUpdateEffect = (cb: () => void, depend: any[]) => {
  const [sign, setSign] = useState(false);
  useEffect(() => {
    if (sign) {
      cb();
    } else {
      setSign(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depend);
};
export const useMountEffect = (cb: () => void) => {
  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
