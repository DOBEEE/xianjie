# Agro-form
基于rax的跨端自动化表单工具


## 依赖

- [Rax](https://rax.js.org/) (v1.0.0+)

## 安装

```bash
tnpm i agro-form
```

## 快速开始
### 1.引入表单组件

```jsx
import { Form, useForm } from 'agro-form';
```

### 2.创建表单实例

表单数据操作方法都挂载在表单实例上
```jsx
const [form] = useForm();
```
常用的表单操作方法

|方法|参数|返回值|含义|
|:--|:--|:--|:--|
|getAllCheckRes| - | Boolean | 校验表单数据|
|getValues| - | Object |获取表单数据|
|setValues| Obeject | - | 设置&更新表单数据|
|setConfList| Array, Obeject? | - | 设置&更新表单的整体配置，第二个参数可以同步更新表单数据|

高级操作

|方法|参数|返回值|含义|
|:--|:--|:--|:--|
|getItems| - | Object |获取所有表单项|
|getItem| string | Object |根据id获取表单项|
|setItem| (string, Object) | - |设置或添加表单项|
|getItemValue| string | Object |获取表单项值|
|setItemValue| {id: string, value: any, setField: boolean} | - |设置表单项值|
|getItemCheck| string | boolean |获取表单项校验结果|
|setItemCheck| (string, boolean) | - |设置表单项校验结果|
|startCheckItem| string | boolean |触发表单项执行校验|
|startCheckAll| - | - |触发表单校验|
### 3.使用表单组件

```jsx
<Form
  form={form}
  readOnly={false}
  history={history}
  confList={formMap}
  formItemsMap={formItemsMap}
  initialValues={{}}
>
  // 此处模板将置于表单末尾，可用于提交表单 
  // 此处给button加上属性 formType="submit" 后
  // 用户点击时，会自动触发全部表单校验，可通过form.getAllCheckRes()查看结果
  <Button
    formType="submit"
    onClick={submitHandler}
    type="primary"
  >
    确认发布
  </Button>
</Form>
```
组件属性

|属性名|含义|
|:--|:--|
|form|表单实例|
|readOnly|是否只读|
|confList|表单项配置列表|
|formItemsMap|表单项组件映射|
|initialValues|表单初始数据|

### 4.配置confList
confList为一个对象数组，其中每个对象配置一个对应的表单项
confList 不受控，需要更新 confList 请用 form.setConfList(confList, {})

#### 常用通用表单项配置：
|配置|类型|含义|
|:--|:--|:--|
|type|string|表单项类型，如input，select等|
|valueId|string|表单项数据对象的键，一个表单中要求唯一|
|hidden|boolean|控制此表单项展示与否|
|readOnly|boolean|控制此表单项是否只读|
|alwaysCanClick|boolean|控制此表单项是否在只读状态下也可触发点击事件|
|noDataShow|boolean|默认情况只读状态下，如果表单项无数据会自动隐藏，可以设置此值为true来强制展示|
|label|string|表单项标题|
|required|boolean|是否必填 * |
|showArrow|boolean|是否显示右侧箭头|
|captionDesc|string|右侧描述文案|
|spacing|string|表单项间隔|
|rules|array|表单项校验规则|

#### rules格式示例：
```js
{
  rules: [
    {
      // type 有两个值，warn 和 error，默认是 error
      // 传 warn 时，handle校验为 false 时，message 将作为警告文案透出，但校验结果会返回为 true，不会拦截表单提交
      // 传 error 时，handle校验为 false 时，message 将作为错误文案透出，校验结果会返回为 false，会拦截表单提交
      type: 'warn',
      // 返回校验失败提示文案
      // 也可以直接传递string
      // message: '提示text',
      message: (value, conf, form) => {return '提示text'},
      // 具体的校验过程，返回校验结果，布尔值
      handle: (value, conf, form) => {return false}
    }
  ]
}
```

配置中的所有键值对和方法都会作为props传入表单项组件

#### 其他表单项配置举例
|配置|表单类型（组件）|含义|
|:--|:--|:--|
|inputType|input|input类型，text、number等|
|rows|input|行数|
|placeholder|input|占位字符|
|maxLength|input|输入最大长度|
|showMaxLength|input|是否显示最大长度|
|onChange|-|表单值改变时触发|
|onClick|-|表单项点击触发|
|getDataSource|select|获取表单源数据，选项列表|

onChange用法示例：
```js
{
  // value 为表单项的值
  // setConf 可以更新confList中其他表单项配置值，用于表单项联动，第一个参数为要修改的表单项valueId，第二个参数为修改的具体配置(除了valueId, type其它conf属性都可更新)
  // autoSet 为true代表自动填充数据（setValues）触发的onChange，为false代表用户输入时触发的onChange
  // setValue 可以更新其它表单的数据（包括自己）
  // form 为form实例，可以通过它来获取其它表单项的数据和状态
  onChange: ({ form, value, setConf, setValue, autoSet }) => {
    // 如下将valueId为earnestFee的表单项中，配置项hidden改为当前表单项值取反
    setConf('earnestFee', {
      hidden: !value,
    });
    // 如下 setConf 的第二个参数也可以接收一个function，参数为要修改项的当前配置，返回值为要更新的配置
    setConf('earnestFee', (conf) => ({hidden: !conf.hidden}));
    // 如下将 valueId 为earnestFee的表单项中，数据更新为 test
    setValue('earnestFee', 'test');
    // 如下 setValue 的第二个参数也可以接收一个function，参数为要修改项的当前数据，返回值为要更新的数据
    setValue('earnestFee', (v) => v == 1 ? 2 : 1);
  }
}
```

onClick 用法示例：
```js
{
  // value 为当前表单项的值
  // event 点击事件event对象
  // conf 当前表达项的配置
  // rest 从 Form 入口传递进来的用户自定义props
  // form 为form实例，可以通过它来获取其它表单项的数据和状态
  onClick: ({ form, value, event, conf, ...rest }) => {
    rest.history.push('/');
  }
}
```

confList示例：
```js
const getFormConf = (form, history) => {
  return [
    {
      type: 'upload',
      valueId: 'images',
      label: '商品视频/图片',
      required: true
    }, {
      type: 'input',
      valueId: 'itemTitle',
      label: '商品标题',
      required: true,
      inputType: 'text',
      placeholder: '请输入',
      maxLength: 30
    }, {
      spacing: '24rpx',
      type: 'select',
      valueId: 'cateIdList',
      label: '货品品种',
      required: true,
      inputType: 'text',
      showArrow: true,
      placeholder: '请选择',
      showMaxLength: false,
      getDataSource: async () => {
        const styleData = (data) => {
          function _run(d) {
            return d.map((item) => {
              return {
                label: item.catName,
                value: item.catId,
                children: item.catList && item.catList.length > 0 ? _run(item.catList) : [],
              };
            });
          }
          return _run(data);
        };
        let { data } = await services.getCategory({});
        if (!Array.isArray(data)) {
          data = [data];
        }
        return styleData(data);
      },
      onChange: () => {
      }
    }, {
      type: 'select',
      valueId: 'priceUnit',
      getDataSource: () => {
        return new Promise((resolve, reject) => {
          resolve(unit);
        });
      },
      label: '计量单位',
      required: true,
      inputType: 'text',
      showArrow: true,
      placeholder: '请选择',
      onChange: ({value, setConf}) => {
        const label = unit.filter(item => item.value === value[0])[0].label;
        setConf('initialBatch', {
          captionDesc: label,
          disabled: false
        });
        setConf('skus', {
          priceUnit: label
        });
      }
    }
  ]
}
```

### 5.配置formItemsMap
formItemsMap为不同类型（confList中的type，如input）的表单项指定具体实现的表单项组件

如下指定confList中type为`input`的表单项使用`TextField`组件渲染
```js
const formItemsMap = {
  upload: {
    component: UploadItem,
    unNeedContainer: false,
  },
  select: {
    component: SelectItem,
    unNeedContainer: true,
  },
  input: {
    component: TextField,
    unNeedContainer: false,
  }
}
```
unNeedContainer标识组件是否需要由通用表单项容器包裹，true为不需要，false为需要，默认为false。
**通用表单项容器拥有一般表单项行为，如label、必填检查、右侧箭头，错误提示，辅助文案等元素，样式如有需要，可以自行定制通用表单项容器，下边是它可以接收到的props**

```js
const {
    tapable, // 是否展示右箭头
    children, 
    label, // label文案
    required, // 是否必填
    onClick, // 点击事件
    readOnly, // 是否只读
    errorText, // 错误文案
    warnText, // 警告文案
    helpText, // 帮助文案
    spacing = 0, // 向下的间距
  } = props;
```

argo-form组件中目前内置默认表单项组件的类型有：tap、range，但样式可能与你的业务不符，推荐按照下面规范自定义表单项组件。

以上你就完成了一个基础表单~

## 方法
### form.setValues(values)
设置表单数据
#### 示例

```
form.setConfList({
  price: 1,
  imgUrl: ''
});
```

### form.getValues()
获取表单数据
#### 示例

```
const formV = form.getValues();
```

### form.setConfList(confList, values?);
更新表单配置，可传入第二个参数同步更新表单数据

#### 参数

| 属性   | 类型     | 默认值 | 必选 | 描述             |
| ------ | -------- | ------ | ---- | ---------------- |
| confList    | `Array` |  -  | √    | 表单的整体配置，需传入完整表单配置  |
| values    | `Object` |  {}  | x    | 表单的数据，不传时，对已经存在的表单数据不做更改  |
#### 示例

```
form.setValues([{
    type: 'upload',
    valueId: 'images',
    label: '商品视频/图片',
    required: true
  }], {
  price: 1,
  imgUrl: ''
});
```

### form.getAllCheckRes()
获取表单的整体校验结果
#### 示例

```
const res = form.getAllCheckRes(); // true/false
```

### form.getItem(valueId: string)
获取某一项表单的状态数据
#### 示例

```
const res = form.getItem('price');
```

### form.getItems()
获取所有表单项的状态数据
#### 示例

```
const res = form.getItems();
```

### form.getItemValue(valueId: string)
获取某一项表单的值
#### 示例

```
const res = form.getItemValue('price');
```

### form.startCheckAll()
主动校验整体表单的规则
#### 示例

```
form.startCheckAll(');
```

### form.startCheckItem(valueId: string)
主动校验某一项表单的规则
#### 示例

```
form.startCheckItem('price');
```

******

## 表单项组件开发
你可以指定任意一个自定义rax组件为表单项组件，但是注意以下两点：
自定义表单项必须接收value和onChange两个属性

1. props中必须接收value为表单项的值
2. 使用props中的onChange方法来改变该表单项的值

******

## Repeat表单
特殊的一种表单，可以重复添加一组子表单，使用方法类似普通表单，差异如下：

### confList
```js
[
  {
    id: 'skus', // id和valueId必须同时填写
    valueId: 'skus',
    type: 'repeatForm', // 表单项类型，固定值
    title: '规格',
    increase: true, // title后是否需要递增数字
    content: otherConfList || [], // 值为另一组普通表单配置,
    canDelFirst: false, // repeatForm 的第一项是否可以被删除，默认是false
    hideDefaultItem: false, // 是否默认隐藏 repeatForm 的第一项，默认是false
  }
]
```

### Form
新增按钮`formType="repeatForm"`，`repeatId`为confList中的id
```jsx
<Form
  form={form}
  readOnly={false}
  history={history}
  confList={formMap}
  formItemsMap={formItemsMap}
  initialValues={{}}
>
  <Button
    className="add-button"
    type="normal"
    formType="repeatForm"
    repeatId="skus"
  >
    +添加规格
  </Button>
  <View className="footer">
    <Button
      type="primary"
      formType="submit"
      onClick={submitHandler}
    >
      确定
    </Button>
  </View>
</Form>
```

### 表单数据

repeat表单数据结构会多一个层级： `{formValue}.{repeatId}[index]` 才是具体被复制的子表单数据

