import { createElement, FC, useState, useEffect, useMemo, useContext } from 'rax';
import { useCheckCb, useSubmitCheckCb, useUpdateEffect } from '../utils/hooks';
import { isNone } from '../utils';
import { SchemaContext } from '../context';

const FieldComponent: FC<any> = (props) => {
  const {
    prefix = 'argo-',
    needContainer = false,
    schema,
    value,
    Component,
    checkSign,
    parent,
  } = props;
  const {
    cache,
    componentsMap,
    fields,
    formItem: FormItem,
    functionContext,
    methods,
  } = useContext(SchemaContext);
  const [, refresh] = useState({});
  const { path, type } = schema;
  const itemState = schema.getState();
  const [v, setV] = useState({ from: '', value });
  useUpdateEffect(() => {
    setV((v) => {
      if (JSON.stringify(v?.value) === JSON.stringify(fields.getValueByPath(path))) {
        return v;
      }
      return { from: 'parent', value };
    });
  }, [JSON.stringify(value)]);

  const [state, setState] = useState({
    ...itemState,
    readOnly: itemState.readOnly || parent?.readOnly,
  });

  const [errorText, setErrorText] = useState('');
  const [warnText, setWarnText] = useState('');
  useCheckCb(schema, path, type, state, setErrorText, setWarnText, v, parent);

  useSubmitCheckCb(path, fields, checkSign, setErrorText, setWarnText, state);

  useUpdateEffect(() => {
    const itemState = schema.getState();
    setState((state) => ({
      ...state,
      ...itemState,
      readOnly: itemState.readOnly || parent?.readOnly,
    }));
  }, [schema, parent?.readOnly]);
  useUpdateEffect(() => {
    fields.updateItem(path, state);
  }, [state]);
  useMemo(() => {
    fields.setItemSetSelf(path, setState, setV, setErrorText, setWarnText);
  }, []);

  const { onClick, onFocus, onBlur } = state.events || {};
  const readOnly = fields.status === 'readOnly' || state.readOnly;

  if (state.removed || state.hidden || (readOnly && isNone(v.value) && !state.noDataShow)) {
    return null;
  }
  if (type === 'array') {
    // values变更时，需要动态增删items
    fields.setArrayFuns({
      add: () => {
        schema.createArrayChildren();
        fields.initStoreBySchema(schema);
        refresh({});
      },
      del: (idx) => {
        schema.delArrayChildren(idx);
        const oldValue = fields.getValueByPath(path);
        if (oldValue) {
          oldValue.splice(idx, 1);
        }
        fields.initStoreBySchema(schema);
        setV({ value: oldValue, from: 'user' });
      },
    });
  }

  const renderComponent = () => {
    return (
      <Component
        key={path}
        {...(state.componentProps || {})}
        fields={fields}
        lastValue={cache.getValue(path)}
        onClick={(e: any) =>
          onClick &&
          methods[onClick] &&
          methods[onClick].call(
            functionContext,
            {
              path,
              value: v.value,
              state,
              schema,
            },
            e
          )
        }
        onFocus={(e: any) =>
          onFocus &&
          methods[onFocus] &&
          methods[onFocus].call(
            functionContext,
            {
              path,
              value: v.value,
              state,
              schema,
            },
            e
          )
        }
        onBlur={(e: any) =>
          onBlur &&
          methods[onBlur] &&
          methods[onBlur].call(
            functionContext,
            {
              path,
              value: v.value,
              state,
              schema,
            },
            e
          )
        }
        readOnly={readOnly}
        value={v.value}
        onChange={(val) => {
          setV({ from: 'user', value: val });
        }}
      >
        {schema.children && schema.children.length > 0
          ? schema.children.map((itemSchema) => (
              <FieldComponent
                key={itemSchema.path}
                parent={{ path, type, ...state }}
                schema={itemSchema}
                checkSign={checkSign}
                needContainer={itemSchema.needContainer}
                value={fields?.getValueByPath(itemSchema.path)}
                Component={componentsMap?.[itemSchema.componentName] || 'div'}
              />
            ))
          : null}
      </Component>
    );
  };
  return (
    <div className={prefix + path.replace(/\./g, '-')}>
      {needContainer ? (
        <FormItem
          key={path}
          {...(state.formItemProps || {})}
          required={!readOnly && state.required}
          readOnly={readOnly}
          disabled={state.disabled}
          errorText={errorText}
          warnText={warnText}
          onClick={
            onClick && methods[onClick]
              ? (e: any) =>
                  methods[onClick].call(
                    functionContext,
                    {
                      path,
                      value: v.value,
                      state,
                      schema,
                    },
                    e
                  )
              : ''
          }
        >
          {renderComponent()}
        </FormItem>
      ) : (
        renderComponent()
      )}
    </div>
  );
};
export default FieldComponent;
