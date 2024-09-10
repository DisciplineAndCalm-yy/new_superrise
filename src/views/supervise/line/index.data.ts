import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getClueType, getClueStatus, getRectificationType } from '/@/api/supervise/index'
export const citeTypeOptions = [{ label: '工作任务', value: '工作任务' }];

//是否发改委角色
export const is_city_fgw_role = JSON.parse(localStorage.getItem('roles')).includes('city_fgw')
console.log('is_city_fgw_role', is_city_fgw_role)
export const columns: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'clueNumber',
    width: 150
  },
  {
    title: '问题线索类别',
    dataIndex: 'clueTypeDesc',
    width: 150
  },
  {
    title: '问题线索归属',
    dataIndex: 'clueAffiliation',
    width: 150
  },
  {
    title: '问题线索概要',
    dataIndex: 'clueSummary',
    width: 150
  },
  {
    title: '问题线索主要情况',
    dataIndex: 'clueMainConditions',
    width: 150
  },
  {
    title: '整改责任单位',
    dataIndex: 'responsibleDepart',
    width: 150
  },
  {
    title: '整改时限',
    dataIndex: 'disposeTime',
    width: 150
  },
  {
    title: '整改进展情况（月）',
    dataIndex: 'disposeCondition',
    width: 150
  },
  {
    title: '存在问题',
    dataIndex: 'problem',
    width: 150
  },
  {
    title: '下步措施',
    dataIndex: 'nextStep',
    width: 150
  },
  {
    title: '整改完成情况',
    dataIndex: 'rectificationTypeDesc',
    width: 150
  },
  {
    title: '牵头单位',
    dataIndex: 'leadDepart',
    width: 150
  },
  {
    title: '任务状态',
    dataIndex: 'clueStatusDesc',
    width: 150
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '编号',
    field: 'clueNumber',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '问题线索类别',
    field: 'clueType',
    component: 'ApiSelect',
    componentProps: {
      api: getClueType,
      numberToString: true,
      labelField: 'dictName',
      valueField: 'dictCode',
      // allowClear: false,
    },
  },
  {
    label: '整改完成情况',
    field: 'rectificationType',
    component: 'ApiSelect',
    componentProps: {
      api: getRectificationType,
      numberToString: true,
      labelField: 'dictName',
      valueField: 'dictCode',
      // allowClear: false,
    },
  },
  {
    label: '任务状态',
    field: 'clueStatus',
    component: 'ApiSelect',
    componentProps: {
      api: getClueStatus,
      exceptVal: is_city_fgw_role ? '0' : '',//排除选项，对应的字段为valueField，默认用value排除
      numberToString: true,
      labelField: 'dictName',
      valueField: 'dictCode',
      // allowClear: false,
    },
  },
];

// 模板详情
export interface TemplateDetail {
  citeType: string;
  schemasJson: any;
  templateId: string;
  templateName: string;
}

export type BaseInfo = Pick<TemplateDetail, 'citeType' | 'templateName'>;
