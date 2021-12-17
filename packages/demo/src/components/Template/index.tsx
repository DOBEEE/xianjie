import { createElement } from 'rax';
import { Button, Input, Form, Select, TimePicker, DatePicker, Checkbox, Radio, Range, Switch, Upload, CascaderSelect } from 'meet';
import { SchemaRender, useFields } from '../../../../schema-render/src/index';
import View from 'rax-view';
import Children from 'rax-children';

const Array = ({fields, children}) => {
  return <View>{
    Children.map(children, (child: Rax.RaxChild, idx: number) => {
      return <View key={idx}>
        <View class="header" style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>{idx}</View>
          <Button type="primary" onClick={() => fields.arrayOperations.del(idx)}>delete</Button>
        </View>
        
        <View>{child}</View>
      </View>
    })
    } <Button type="primary" onClick={() => fields.arrayOperations.add()}>add</Button></View>
}
const HippoComponentsMap = {
  form: Form,
  input: Input,
  select: Select,
  array: Array,
  time: TimePicker,
  date: DatePicker,
  dateRange: DatePicker.RangePicker,
  checkbox: Checkbox,
  checkboxGroup: Checkbox.Group,
  radioGroup: Radio.Group,
  range: Range,
  switch: Switch,
  upload: Upload,
  cascade: CascaderSelect,
  button: Button,
};

const Render = ({schema}) => {
  const [fields] = useFields();
  return (
    <SchemaRender 
      componentsMap={HippoComponentsMap} 
      formItem={Form.Item}
      jsFunctionContext={{utils: {}, services: {}}}
      methods={schema.methods}
      schema={schema.componentsTree}
      fields={fields}
      initialValues={schema.initialValues}
      actions={schema.actions}
    />
  );
};

export default Render;
