import { createElement } from 'rax';
import {
  Button,
  Input,
  Form,
  Select,
  Card,
  NumberInput,
  TimePicker,
  DatePicker,
  Checkbox,
  Radio,
  Range,
  Switch,
  Upload,
  RangeInput,
  Size,
  TreeSelect,
  CascaderSelect,
} from 'meet';
import { SchemaRender, useFields } from 'afc-schema-render';

const HippoComponentsMap = {
  form: Form,
  input: Input,
  select: Select,
  // time: TimePicker,
  // date: DatePicker,
  // timeRange: TimePicker.RangePicker,
  // dateRange: DatePicker.RangePicker,
  // checkbox: Checkbox,
  // checkboxGroup: Checkbox.Group,
  // radioGroup: Radio.Group,
  // range: Range,
  // switch: Switch,
  // upload: Upload,
  // imageUpload: Upload.ImageUpload,
  // rangeInput: RangeInput,
  // size: Size,
  // textarea: Input.TextArea,
  // multiSelect: props => <Select {...props} mode="multiple" />,
  // treeSelect: TreeSelect,
  // cascade: CascaderSelect,
  // array: ArrayField,
  button: Button,
};

const Render = ({ schema }) => {
  const [fields] = useFields();
  return (
    <SchemaRender
      componentsMap={HippoComponentsMap}
      formItem={Form.Item}
      jsFunctionContext={{ utils: {}, services: {} }}
      methods={schema.methods}
      schema={schema.componentsTree}
      fields={fields}
      initialValues={schema.initialValues}
      actions={schema.actions}
    />
  );
};

// export const Submit = () => {
//   return <Form.Submit onClick={(e) => {
//     this.fields.submit();
//     onClick && onClick(e);
//   }} fullWidth type="primary" {...rest}></Form.Submit>;
// }

// export const Reset = ({ field, onClick, ...rest}) => {
//   return <Form.Reset fullWidth type="warning" model="outline" onClick={() => {
//     field.reset();
//     onClick && onClick(e);
//   }} {...rest}></Form.Reset>;
// }

export default Render;
