import { PluginManager } from '@coderlt/form-designer';
import { setupComponentManager, setupPublicMethods, setupSchemaGroup } from '/@/plugins/epic-designer';
import { scriptCode, superviseMethodsConfig } from './config';
import { superviseCooperateFormConfig, superviseExtendFormConfig, superviseFormConfig, superviseNormalFormConfig } from './supervise';

export { DeadlineTypeEnum } from './component';

export const defaultSchema = {
  schemas: [
    {
      type: 'page',
      id: 'root',
      label: '页面',
      children: [
        {
          label: '表单',
          isUnique: true,
          id: 'union-form',
          type: 'form',
          icon: 'epic-icon-daibanshixiang',
          labelWidth: 100,
          name: 'default',
          hideCopy: true,
          hideDel: true,
          componentProps: {
            layout: 'horizontal',
            labelWidth: 100,
            labelLayout: 'fixe',
            labelCol: {
              span: 5,
            },
            wrapperCol: {
              span: 19,
            },
            hideRequiredMark: false,
            colon: true,
            labelAlign: 'right',
            size: 'middle',
          },
          // on: {
          //   vnodeMounted: [
          //     {
          //       componentId: null,
          //       methodName: 'setResponsibleOrg',
          //       type: 'custom',
          //     },
          //   ],
          // },
          children: [],
        },
      ],
      componentProps: {
        style: {
          padding: '16px',
        },
      },
    },
  ],
  script: scriptCode,
};

export const customSchema = {
  schemas: [
    {
      type: 'page',
      id: 'root',
      label: '页面',
      children: [
        {
          label: '表单',
          isUnique: true,
          id: 'union-form',
          type: 'form',
          icon: 'epic-icon-daibanshixiang',
          labelWidth: 100,
          name: 'default',
          hideCopy: true,
          hideDel: true,
          componentProps: {
            layout: 'horizontal',
            labelWidth: '310',
            labelLayout: 'fixed',
            labelCol: {
              span: 5,
            },
            wrapperCol: {
              span: 19,
            },
            hideRequiredMark: false,
            colon: true,
            labelAlign: 'right',
            size: 'middle',
          },
          children: [
            {
              icon: 'epic-icon-xiala',
              input: true,
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
                mode: 'multiple',
                placeholder: '请选择',
                optionType: 'department',
                componentType: 'department', // department , select, cooperate
              },
              rules: [{ type: 'array', trigger: ['change'], required: true, message: '该项不能为空' }],
              label: '填报单位',
              id: 'responsibleDepart',
              type: 'select-supervise',
              fieldType: 'select',
              on: {
                vnodeMountedCustom: [
                  {
                    componentId: null,
                    methodName: 'setResponsibleOrgByComponentIdApi',
                    type: 'custom',
                  },
                ],
              },
              isUnique: true,
              hideDel: true,
              hideCopy: true,
              forbid: true,
              isRequired: true,
              isShow: true,
              field: 'responsibleDepart',
            },
            {
              icon: 'epic-icon-zhage',
              childImmovable: true,
              rules: [
                {
                  type: 'string',
                  trigger: ['change'],
                  required: true,
                  message: '该项不能为空',
                },
              ],
              label: '完成时限',
              id: 'deadlineType',
              type: 'deadlineType-supervise',
              fieldType: 'deadlineType',
              isShow: true,
              componentProps: {
                type: 'month',
                valueFormat: 'YYYY-MM',
                checkText: '无时间限制(该任务长期有效)',
                checkedValue: '0',
                unCheckedValue: '1',
              },
              on: {
                change: [
                  {
                    componentId: null,
                    methodName: 'handleDeadlineTypeChange',
                    type: 'custom',
                  },
                ],
              },
              isUnique: true,
              hideDel: true,
              hideCopy: true,
              forbid: true,
              isRequired: true,
              field: 'deadlineType',
            },
          ],
        },
      ],
      componentProps: {
        style: {
          padding: '16px',
        },
      },
    },
  ],
  script: scriptCode,
};

export const customExpandSchema = {
  schemas: [
    {
      type: 'page',
      id: 'root',
      label: '页面',
      children: [
        {
          label: '表单',
          isUnique: true,
          id: 'union-form',
          type: 'form',
          icon: 'epic-icon-daibanshixiang',
          labelWidth: 100,
          name: 'default',
          hideCopy: true,
          hideDel: true,
          componentProps: {
            layout: 'horizontal',
            labelWidth: '180',
            labelLayout: 'fixed',
            labelCol: {
              span: 5,
            },
            wrapperCol: {
              span: 19,
            },
            hideRequiredMark: false,
            colon: true,
            labelAlign: 'right',
            size: 'middle',
          },
          children: [
            {
              label: '进度条',
              type: 'slider-extend',
              fieldType: 'slider',
              icon: 'epic-icon-menu',
              input: true,
              componentProps: {
                defaultValue: 0,
              },
              rules: [
                {
                  type: 'number',
                  trigger: ['change'],
                  required: true,
                  message: '该项不能为空',
                },
              ],
              id: 'slider_7sbilgkt',
              isShow: false,
              hideDel: false,
              hideCopy: true,
              forbid: false,
              isRequired: true,
              isDetailField: true,
              field: 'slider_7sbilgkt',
            },
            {
              icon: 'epic-icon-edit',
              input: true,
              componentProps: {
                isShow: true,
              },
              rules: [
                {
                  type: 'string',
                  trigger: ['change'],
                  required: true,
                  message: '该项不能为空',
                },
              ],
              label: '备注',
              id: 'remarks',
              type: 'textarea-extend',
              fieldType: 'textarea',
              isUnique: true,
              hideDel: true,
              hideCopy: true,
              isDetailField: true,
              forbid: false,
              isRequired: true,
              isShow: false,
              field: 'remarks',
            },
          ],
        },
      ],
      componentProps: {
        style: {
          padding: '16px',
        },
      },
    },
  ],
  script: scriptCode,
};

export const customCooperateSchema = {
  schemas: [
    {
      type: 'page',
      id: 'root',
      label: '页面',
      children: [
        {
          label: '表单',
          isUnique: true,
          id: 'union-form',
          type: 'form',
          icon: 'epic-icon-daibanshixiang',
          labelWidth: 100,
          name: 'default',
          hideCopy: true,
          hideDel: true,
          componentProps: {
            layout: 'horizontal',
            labelWidth: '100',
            labelLayout: 'fixed',
            labelCol: {
              span: 5,
            },
            wrapperCol: {
              span: 19,
            },
            hideRequiredMark: false,
            colon: true,
            labelAlign: 'right',
            size: 'middle',
          },
          children: [
            {
              icon: 'epic-icon-xiala',
              input: true,
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
                mode: 'multiple',
                placeholder: '请选择',
                optionType: 'department',
                componentType: 'cooperate', // department , select, cooperate
              },
              rules: [{ type: 'array', trigger: ['change'], required: true, message: '该项不能为空' }],
              label: '配合单位',
              id: 'cooperation',
              type: 'select-supervise',
              fieldType: 'select',
              on: {
                vnodeMountedCustom: [
                  {
                    componentId: null,
                    methodName: 'setResponsibleOrgByComponentIdApi',
                    type: 'custom',
                  },
                ],
              },
              isUnique: true,
              hideDel: true,
              hideCopy: true,
              forbid: true,
              isRequired: true,
              isShow: false,
              field: 'cooperation',
            },
          ],
        },
      ],
      componentProps: {
        style: {
          padding: '16px',
        },
      },
    },
  ],
  script: scriptCode,
};

export const customReplyRate = {
  replyFrequency: '0',
  replyRule: '',
  replyStartDate: '',
  replyEndDate: '',
  replies: 0,
};

export const defaultNoticeSchema = {
  icon: 'epic-icon-zhage',
  childImmovable: true,
  rules: [
    {
      type: 'string',
      trigger: ['change'],
      required: false,
      message: '通知不能为空',
    },
  ],
  label: '通知',
  id: 'customNotice',
  componentProps: {
    completionDeadline: '',
    noticeTimeOptions: [
      {
        label: '即时通知',
        value: '1',
      },
      {
        label: '提前',
        value: '2',
      },
    ],
    noticeCycleOptions: [
      {
        label: '只通知一次',
        value: '1',
      },
      {
        label: '每天通知',
        value: '2',
      },
    ],
  },
  on: {
    vnodeMounted: [
      {
        componentId: null,
        methodName: 'setNoticeData',
        type: 'custom',
      },
    ],
  },
  isUnique: true,
  hideCopy: true,
  hideDel: true,
  forbid: true,
  isRequired: true,
  type: 'customNotice',
  fieldType: 'customNotice',
  field: 'customNotice',
};

export const setupTaskTemplatePlugin = (pluginManager: PluginManager) => {
  setupComponentManager(pluginManager, superviseFormConfig, { mode: 'cover' });
  setupPublicMethods(pluginManager, superviseMethodsConfig);
  setupSchemaGroup(pluginManager, superviseNormalFormConfig.title, superviseNormalFormConfig.list);
  setupSchemaGroup(pluginManager, superviseExtendFormConfig.title, superviseExtendFormConfig.list);
  setupSchemaGroup(pluginManager, superviseCooperateFormConfig.title, superviseCooperateFormConfig.list);
};
