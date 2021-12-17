export default {
  methods: {
    test1({value}) {
      console.log(333,value);
      // this.setValue('test2.test3', value);
    }
  },
  actions: function() {
    this.onValueChange(['test1'], (v) => {
      console.log('111', v);
    })
  },
  componentsTree: {
    children: [
      {
        name: 'test1',
        needContainer: true,
        componentName: 'input',
        componentNameProps: {

        },
        formItemProps: {
          label: '姓名'
        },
        events: {
          onChange: 'test1'
        }
      },
      {
        type: 'group',
        name: 'test2',
        children: [
          {
            name: 'test3',
            needContainer: true,
            componentName: 'input',
            componentNameProps: {

            },
            formItemProps: {
              label: '姓名'
            },
          }
        ]
      },
      {
        name: 'array1',
        type: 'array',
        componentName: 'array',
        componentNameProps: {

        },
        items: [
          {
            name: 'test1',
            componentName: 'input',
            needContainer: true,
            formItemProps: {
              label: '姓名1'
            },
          },
          {
            name: 'test2',
            componentName: 'input',
            needContainer: true,
            formItemProps: {
              label: '姓名2'
            },
          },
        ]
        // events: {
        //   onChange: 'test1'
        // }
      },
    ]
  }
}