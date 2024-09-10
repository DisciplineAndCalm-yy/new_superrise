import { type ComponentConfigModel } from '@coderlt/form-designer';
export const checkBoxConfig = {
  component: () => import('./checkbox.vue'),
  defaultSchema: {
    label: '多选框',
    type: 'checkbox',
    icon: 'epic-icon-duoxuan1',
    field: 'checkbox',
    input: true,
    componentProps: {
      placeholder: '请选择',
    },
  },
  config: {
    attribute: [
      {
        label: '字段名',
        type: 'input',
        field: 'field',
      },
      {
        label: '默认值',
        type: 'checkbox',
        field: 'componentProps.defaultValue',
      },
      {
        label: '文字',
        type: 'input',
        field: 'label',
      },
      {
        label: '尺寸',
        type: 'select',
        componentProps: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            {
              label: 'large',
              value: 'large',
            },
            {
              label: 'middle',
              value: 'middle',
            },
            {
              label: 'small',
              value: 'small',
            },
          ],
        },
        field: 'componentProps.size',
      },
      {
        label: '禁用',
        type: 'switch',
        field: 'componentProps.disabled',
      },
      {
        label: '隐藏',
        type: 'switch',
        field: 'componentProps.hidden',
      },
      {
        label: '选项管理',
        type: 'EOptionsEditor',
        layout: 'vertical',
        field: 'componentProps.options',
      },
      {
        label: '表单校验',
        type: 'ERuleEditor',
        layout: 'vertical',
        field: 'rules',
        describe: '校验规则需要配合表单使用',
      },
    ],
    event: [
      {
        type: 'change',
        describe: '值变化时',
      },
    ],
  },
  bindModel: 'value',
} as ComponentConfigModel;
