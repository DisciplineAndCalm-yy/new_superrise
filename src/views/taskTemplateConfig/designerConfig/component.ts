import { EventEnum, ComponentTypeEnum } from '/@/plugins/epic-designer/';

export enum DeadlineTypeEnum {
  DATE_SELECT = '1',
  SUSTAIN = '0',
}

export const atomicComponent = {
  multipleInput: {
    componentType: ComponentTypeEnum.MULTIPLE_INPUT,
    defaultSchema: {
      label: '单行文本框',
      id: 'multiple-input',
      type: ComponentTypeEnum.MULTIPLE_INPUT,
      isShow: true,
      isRepeat: false,
      rules: [{ type: 'array', trigger: ['change'], required: false, message: '该项不能为空' }],
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必填',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '最大值',
          type: 'input',
          field: 'componentProps.maxLength',
          componentProps: {
            type: 'number',
          },
        },
        {
          label: '是否可重复',
          type: 'switch',
          field: 'isRepeat',
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
        {
          label: '',
          type: 'CustomDescOptionsEditor',
          layout: 'vertical',
          field: 'componentProps.schedulingDesc',
          componentProps: {
            min: 1,
            max: 12,
            currentSize: 1,
          },
        },
      ],
    },
  },
  multipleTextarea: {
    componentType: ComponentTypeEnum.MULTIPLE_TEXTAREA,
    defaultSchema: {
      label: '多行文本域',
      type: ComponentTypeEnum.MULTIPLE_TEXTAREA,
      id: 'multiple-textarea',
      isShow: true,
      isRepeat: false,
      rules: [{ type: 'array', trigger: ['change'], required: false, message: '多行文本域不能为空' }],
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必填',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '最大值',
          type: 'input',
          field: 'componentProps.maxLength',
          componentProps: {
            type: 'number',
          },
        },
        {
          label: '是否可重复',
          type: 'switch',
          field: 'isRepeat',
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
        {
          label: '',
          type: 'CustomDescOptionsEditor',
          layout: 'vertical',
          field: 'componentProps.schedulingDesc',
          componentProps: {
            min: 1,
            max: 12,
            currentSize: 1,
          },
        },
      ],
    },
  },
  radio: {
    componentType: ComponentTypeEnum.RADIO,
    defaultSchema: {
      label: '单选框',
      id: 'radio',
      isShow: true,
      type: ComponentTypeEnum.RADIO,
      componentProps: {
        style: 'horizontal',
        options: [
          {
            label: '选项1',
            value: '选项1',
          },
          {
            label: '选项2',
            value: '选项2',
          },
        ],
      },
      rules: [{ type: 'string', trigger: ['change'], required: false, message: '该项不能为空' }],
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必选',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '取值范围',
          type: 'EOptionsEditor',
          layout: 'vertical',
          componentProps: {
            isOnlyLabel: true,
          },
          field: 'componentProps.options',
        },
        {
          label: '展示样式',
          type: 'select',
          field: 'componentProps.style',
          componentProps: {
            options: [
              {
                label: '平铺',
                value: 'horizontal',
              },
              {
                label: '竖列',
                value: 'vertical',
              },
            ],
            mode: '',
            optionType: 'custom',
            placeholder: '请选择',
          },
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
      ],
    },
  },
  richTextEditor: {
    componentType: ComponentTypeEnum.RICH_TEXT_EDITOR,
    defaultSchema: {
      label: '富文本',
      id: 'richTextEditor',
      type: ComponentTypeEnum.RICH_TEXT_EDITOR,
      isShow: false,
      rules: [{ type: 'string', trigger: ['change'], required: false, message: '富文本不能为空' }],
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必填',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
      ],
    },
  },
  slider: {
    componentType: ComponentTypeEnum.SLIDER_CONFIG,
    defaultSchema: {
      label: '进度条',
      id: 'slider',
      isShow: true,
      type: ComponentTypeEnum.SLIDER_CONFIG,
      componentProps: {
        defaultValue: 0,
      },
      rules: [{ type: 'number', trigger: ['change'], required: false, message: '进度条不能为空' }],
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必填',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
      ],
    },
  },
  date: {
    componentType: ComponentTypeEnum.DATA_PICKER,
    defaultSchema: {
      label: '日期',
      id: 'date',
      isShow: true,
      type: ComponentTypeEnum.DATA_PICKER,
      componentProps: {
        type: 'month',
        valueFormat: 'YYYY-MM',
      },
      rules: [{ type: 'string', trigger: ['change'], required: false, message: '日期不能为空' }],
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必填',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '精确设置',
          type: 'select',
          field: 'componentProps.type',
          componentProps: {
            options: [
              {
                label: '年-月',
                value: 'month',
              },
              {
                label: '年-月-日',
                value: 'date',
              },
            ],
            mode: '',
            optionType: 'custom',
            placeholder: '请选择',
          },
          onChange: ({ value, values }) => {
            values.componentProps.valueFormat = value === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM';
          },
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
      ],
    },
  },
  attachments: {
    componentType: ComponentTypeEnum.UPLOAD,
    defaultSchema: {
      label: '附件',
      id: 'attachments',
      type: ComponentTypeEnum.UPLOAD,
      componentProps: {
        maxCount: 5,
        multiple: true,
        maxSize: 50,
        uploadRange: [],
        action: '/jeecgboot/sys/common/upload',
      },
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必选',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '上传范围',
          field: 'componentProps.uploadRange',
          layout: 'vertical',
          type: 'select',
          componentProps: {
            placeholder: '请选择',
            allowClear: true,
            mode: 'multiple',
            options: [
              {
                label: 'word文件（包含docx、doc）',
                value: '.doc,.docx',
              },
              {
                label: 'excel文件（包含xlsx、xls）',
                value: '.xls,.xlsx',
              },
              {
                label: '图片格式（PNG、JEPG、jpg）',
                value: '.png,.jpeg,.jpg',
              },
              {
                label: '视频格式（PNG、JEPG、jpg）',
                value: '.mp3,.mp4,.avi,.webm',
              },
              {
                label: '压缩包（rar、zip）',
                value: '.zip,.rar',
              },
            ],
            optionType: 'custom',
          },
        },
        {
          label: '最大限制(M)',
          type: 'input',
          field: 'componentProps.maxSize',
          componentProps: {
            type: 'number',
          },
        },
      ],
    },
  },
  checkBox: {
    componentType: ComponentTypeEnum.CHECK_BOX,
    defaultSchema: {
      label: '复选框',
      id: 'checkBox',
      isShow: true,
      type: ComponentTypeEnum.CHECK_BOX,
      componentProps: {
        style: 'horizontal',
        placeholder: '请选择复选框',
        options: [
          {
            label: '选项1',
            value: '选项1',
          },
          {
            label: '选项2',
            value: '选项2',
          },
        ],
      },
      rules: [{ type: 'array', trigger: ['change'], required: false, message: '复选框不能为空' }],
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必选',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '取值范围',
          type: 'EOptionsEditor',
          layout: 'vertical',
          componentProps: {
            isOnlyLabel: true,
          },
          field: 'componentProps.options',
        },
        {
          label: '展示样式',
          type: 'select',
          field: 'componentProps.style',
          componentProps: {
            options: [
              {
                label: '平铺',
                value: 'horizontal',
              },
              {
                label: '竖列',
                value: 'vertical',
              },
            ],
            mode: '',
            optionType: 'custom',
            placeholder: '请选择',
          },
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
      ],
    },
  },
  select: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '选择框',
      id: 'select',
      isShow: true,
      type: ComponentTypeEnum.SELECT,
      componentProps: {
        selectProps: {},
        treeSelectProps: {
          fieldNames: {
            children: 'children',
            label: 'title',
            value: 'value',
          },
          treeDefaultExpandAll: true,
          treeCheckable: true,
          allowClear: true,
          treeNodeFilterProp: 'title',
          filterTreeIds: [],
        },
        treeData: [],
        options: [],
        mode: '',
        placeholder: '请选择',
        optionType: 'department',
        componentType: 'select', // department , select, cooperate
      },
      rules: [{ type: 'string', trigger: ['change'], required: false, message: '选择框不能为空' }],
      on: {
        // 获取责任单位数据
        vnodeMountedCustom: [
          {
            args: undefined,
            componentId: null,
            methodName: 'setResponsibleOrgByComponentIdApi',
            type: 'custom',
          },
        ],
      },
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          show: ({ values }) => ['department', 'select'].includes(values.componentProps.componentType),
          field: 'label',
        },
        {
          label: '必选',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          show: ({ values }) => values.componentProps.componentType === 'select',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '可多选',
          type: 'switch',
          show: ({ values }) => values.componentProps.componentType === 'select',
          componentProps: {
            checkedValue: 'multiple',
            unCheckedValue: '',
          },
          field: 'componentProps.mode',
          onChange: ({ value, values }) => {
            values.rules[0].type = value === 'multiple' ? 'array' : 'string';
          },
        },
        // 两个取值范围类型, 一个给下拉使用, 一个给普通下拉使用
        // 普通下拉
        {
          label: '取值范围类型',
          type: 'radio',
          layout: 'vertical',
          componentProps: {
            options: [
              {
                label: '按部门',
                value: 'department',
              },
              {
                label: '自定义取值',
                value: 'custom',
              },
            ],
            placeholder: '请选择',
          },
          show: ({ values }) => values.componentProps.componentType === 'select',
          field: 'componentProps.optionType',
          onChange: ({ value, values }) => {
            if (value === 'department') {
              values.on = {
                vnodeMountedCustom: [
                  {
                    componentId: null,
                    methodName: 'setResponsibleOrgByComponentIdApi',
                    type: 'custom',
                  },
                ],
              };
            } else {
              values.on = {};
            }
          },
        },
        // 填报单位
        {
          label: '取值范围类型',
          type: 'radio',
          layout: 'vertical',
          componentProps: {
            options: [
              {
                label: '按部门',
                value: 'department',
              },
              {
                label: '自定义取值',
                disabled: true,
                value: 'custom',
              },
            ],
            placeholder: '请选择',
          },
          show: ({ values }) => ['department', 'cooperate'].includes(values.componentProps.componentType),
          field: 'componentProps.optionType',
          onChange: ({ value, values }) => {
            if (value === 'department') {
              values.on = {
                vnodeMountedCustom: [
                  {
                    componentId: null,
                    methodName: 'setResponsibleOrgByComponentIdApi',
                    type: 'custom',
                  },
                ],
              };
            } else {
              values.on = {};
            }
          },
        },
        {
          label: '',
          type: 'EOptionsEditor',
          layout: 'vertical',
          componentProps: {
            isOnlyLabel: true,
          },
          show: ({ values }) => values.componentProps.optionType === 'custom',
          field: 'componentProps.options',
        },
        {
          label: '',
          type: 'CustomOptionsDepartmentSelectEditor',
          layout: 'vertical',
          show: ({ values }) => values.componentProps.optionType === 'department',
          field: 'componentProps.treeSelectProps.filterTreeIds',
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
          show: ({ values }) => ['department', 'select'].includes(values.componentProps.componentType),
        },
      ],
    },
  },
  remarks: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '备注',
      id: 'remarks',
      type: ComponentTypeEnum.TEXTAREA,
      componentProps: {
        isShow: true,
      },
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必填',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
      ],
    },
  },
  deadlineType: {
    componentType: ComponentTypeEnum.DEADLINE_TYPE,
    defaultSchema: {
      label: '完成时限',
      id: 'deadlineType',
      type: 'deadlineType',
      isShow: true,
      componentProps: {
        type: 'month',
        valueFormat: 'YYYY-MM',
        checkText: '无时间限制(该任务长期有效)',
        checkedValue: '0',
        unCheckedValue: '1',
      },
      rules: [{ type: 'any', trigger: ['change'], required: false, message: '完成时限不能为空' }],
      on: {
        // 设置自定义通知的回调
        change: [
          {
            args: undefined,
            componentId: null,
            methodName: 'handleDeadlineTypeChange',
            type: 'custom',
          },
        ],
      },
    },
    config: {
      attribute: [
        {
          label: '字段名称',
          type: 'input',
          field: 'label',
        },
        {
          label: '必填',
          type: 'CustomRuleRequireEditor',
          field: 'rules',
          describe: '',
          componentProps: {
            disabled: true,
          },
          onChange: ({ value, values }) => {
            if (value && value.length) {
              values.isRequired = value[0].required;
            } else {
              values.isRequired = false;
            }
          },
        },
        {
          label: '精确设置',
          type: 'select',
          field: 'componentProps.type',
          componentProps: {
            selectProps: {},
            options: [
              {
                label: '年-月',
                value: 'month',
              },
              {
                label: '年-月-日',
                value: 'date',
              },
            ],
            mode: '',
            optionType: 'custom',
            placeholder: '请选择',
          },
          onChange: ({ value, values }) => {
            values.componentProps.valueFormat = value === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM';
          },
        },
        {
          label: '是否列表字段',
          type: 'switch',
          field: 'isShow',
        },
      ],
    },
  },
  notice: {
    componentType: ComponentTypeEnum.CUSTOM_NOTICE,
    defaultSchema: {
      label: '通知',
      id: 'customNotice',
      type: ComponentTypeEnum.CUSTOM_NOTICE,
      componentProps: {
        completionDeadline: '',
        noticeTimeOptions: [],
        noticeCycleOptions: [],
      },
      on: {
        [EventEnum.Mounted]: [
          {
            args: undefined,
            componentId: null,
            methodName: 'setNoticeData',
            type: 'custom',
          },
        ],
      },
    },
  },
};
