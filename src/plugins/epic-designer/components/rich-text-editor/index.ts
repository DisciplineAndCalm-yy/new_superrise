import { type ComponentConfigModel } from '@coderlt/form-designer';

export const plugins = [
  'advlist anchor autolink autosave code codesample  directionality  fullscreen hr insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus  template  textpattern visualblocks visualchars wordcount',
];

export const toolbar =
  'fullscreen code preview | undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent lineheight|subscript superscript blockquote| numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons   | insertfile pageembed  link anchor  codesample insertdatetime hr| a11ycheck ltr rtl';

export const menubar = 'edit insert view format table';

export const richTextEditorConfig: ComponentConfigModel = {
  component: () => import('./richTextEditor.vue'),
  defaultSchema: {
    icon: 'epic-icon-danxuan-cuxiantiao',
    input: true,
    componentProps: {
      plugins,
      toolbar,
      menubar,
      width: 'auto',
      height: 400,
      showImageUpload: false,
    },
    rules: [{ type: 'string', trigger: ['change'], required: false, message: '' }],
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
        type: 'radio',
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
        label: 'option类型',
        type: 'select',
        componentProps: {
          options: [
            {
              label: 'default',
              value: 'default',
            },
            {
              label: 'button',
              value: 'button',
            },
          ],
        },
        field: 'componentProps.optionType',
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
};
