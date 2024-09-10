import { type ComponentConfigModel } from '@coderlt/form-designer';

export const uploadConfig: ComponentConfigModel = {
  component: () => import('./upload.vue'),
  defaultSchema: {
    icon: 'epic-icon-upload',
    input: true,
    componentProps: {},
    rules: [{ required: false, message: '', type: 'array', trigger: ['change'] }],
  },
  config: {
    attribute: [
      {
        label: '字段名',
        type: 'input',
        field: 'field',
      },
      {
        label: '文字',
        type: 'input',
        field: 'label',
      },
      {
        label: '请求地址',
        type: 'input',
        field: 'componentProps.action',
      },
      {
        label: '多选',
        type: 'switch',
        field: 'componentProps.multiple',
      },
      {
        label: '允许上传最大数量',
        type: 'number',
        field: 'componentProps.maxCount',
        componentProps: {
          min: 0,
          placeholder: '请输入',
        },
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
        label: '表单校验',
        type: 'ERuleEditor',
        layout: 'vertical',
        field: 'rules',
        describe: '校验规则需要配合表单使用',
      },
    ],
  },
  bindModel: 'modelValue',
};
