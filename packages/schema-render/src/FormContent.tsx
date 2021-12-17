import { createElement, FC, useContext } from 'rax';
import View from 'rax-view';
import FormItemField from './FormItemField';
import { SchemaContext } from './context';

const Index: FC<any> = function (props) {
  const { componentsMap, fields, schema } = useContext(SchemaContext);
  const Component = componentsMap?.[schema.componentName] || View;
  return (
    <FormItemField
      {...props}
      schema={schema}
      needContainer={false}
      value={fields?.getValueByPath(schema.path)}
      Component={Component}
    />
  );
};
export default Index;
