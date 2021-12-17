/* eslint-disable react-hooks/exhaustive-deps */
import { createElement, FC, useState, useEffect, useRef, useMemo, Fragment } from 'rax';
// import FormItem from './FormItem';
import FormContent from './FormContent';

import SchemaField from './Schema';
import Cache from './Cache';
import confirm from '@uni/confirm';
import { FormProps } from '../types/interface';
import { useUpdateEffect } from './utils/hooks';
import FunctionContext from './FunctionContext';
import { SchemaContext } from './context';

const Index: FC<FormProps> = function (props) {
  const {
    initialValues = {},
    fields,
    componentsMap = {},
    formItem,
    methods,
    jsFunctionContext,
    actions,
  } = props;

  const [schema, setSchema] = useState(new SchemaField({ schema: props.schema }));
  const [checkSign, setCheckSign] = useState(0);

  const commonOptions = useRef({
    methods,
    componentsMap,
    formItem,
    functionContext: new FunctionContext(fields, jsFunctionContext),
    fields,
    // 从历史记录里取值
    cache: new Cache(fields.getAssociationValue()),
    schema,
  });

  useMemo(() => {
    fields.setCheckFun(setCheckSign);
    // fields.setConfListCacheFun((schema, values) => {
    //   const _schema = new SchemaField({ schema: schema });
    //   setSchema(_schema);
    //   fields.initStoreBySchema(_schema, values || initialValues);
    // });
    fields.initStoreBySchema(schema, initialValues);
    actions && actions.call(commonOptions.current.functionContext);
  }, []);

  useUpdateEffect(() => {
    const schema = new SchemaField({ schema: props.schema });
    commonOptions.current.schema = schema;
    setSchema(schema);
    fields.initStoreBySchema(schema, initialValues);
  }, [props.schema]);

  useEffect(() => {
    const data = fields.getDraftValue();
    if (fields.status !== 'readOnly' && data) {
      schema.draft &&
        confirm({
          title: '提示',
          content: '您有已编辑的订单未提交，是否继续编辑上次未提交的信息',
          success(res) {
            if (res?.confirm) {
              const data = fields.getDraftValue();
              fields.setValues(data, 'draft');
            } else if (res?.cancel) {
              fields.clearDraftValue();
            }
          },
        });
    }
  }, []);
  return (
    <Fragment>
      <SchemaContext.Provider value={commonOptions.current}>
        {schema.children.length > 0 ? (
          <FormContent x-if={schema.children.length > 0} checkSign={checkSign} />
        ) : null}
      </SchemaContext.Provider>
    </Fragment>
  );
};
export default Index;
