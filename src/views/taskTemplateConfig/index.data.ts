import { getSupCiteType } from '/@/api/taskTemplateConfig';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '台账名称',
    dataIndex: 'templateName',
    width: 120,
  },
  {
    title: '引用流程类型',
    dataIndex: 'citeType',
    width: 120,
  },
  {
    title: '编辑部门',
    dataIndex: 'departIdDesc',
    width: 120,
  },
  {
    title: '创建日期',
    dataIndex: 'createdTime',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'switchFlagDesc',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '台账名称',
    field: 'templateName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '引用流程类型',
    field: 'citeType',
    component: 'ApiSelect',
    componentProps: {
      api: getSupCiteType,
      labelField: 'dictName',
      valueField: 'dictCode',
      allowClear: false,
    },
    colProps: { span: 6 },
  },
];

// 模板详情
export interface TemplateDetail {
  citeType: string;
  oldCiteType?: string;
  schemasJson: string;
  templateId: string;
  templateName: string;
}

export interface SchemasJson {
  schemas: any;
  script: string;
}

export type BaseInfo = Pick<TemplateDetail, 'citeType' | 'templateName' | 'oldCiteType' | 'templateId'>;

export interface ExpandConfig {
  id: string;
  perms: string;
  name: string;
  title: string;
  rename: string;
  replyRate: ReplyRateData | string;
  schemas: any;
  isEdit?: boolean;
}

export interface ReplyRateData {
  replyFrequency: string;
  replyRule: string;
  replyStartDate: string;
  replyEndDate: string;
  replies: number;
}
