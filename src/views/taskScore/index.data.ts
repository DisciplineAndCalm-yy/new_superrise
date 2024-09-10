import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getDepartList } from '/@/api/supervise/task'

export const columns: BasicColumn[] = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    align: 'center',
    key: '1',
    width: 100,
  },
  {
    title: '部门名称',
    dataIndex: 'departName',
    align: 'center',
    width: 300,
    key: '2',
  },
  {
    title: '任务总数',
    dataIndex: 'totalTaskNum',
    align: 'center',
    key: '3',
    width: 100,
    ellipsis: true,
  },
  {
    title: '已完成任务数',
    dataIndex: 'completeTaskNum',
    align: 'center',
    key: '4',
    width: 130,
    ellipsis: true,
  },
];

export const searchFilterSchema: FormSchema[] = [
  {
    label: '选择部门',
    field: 'selectDepName',
    component: 'ApiSelect',
    componentProps: {
      api: getDepartList,
      labelField: 'departName',
      valueField: 'id',
      mode:'multiple',
      maxTagCount: 1,
    },
    colProps: { span: 8 },
  },
  {
    label: '日期范围',
    field: 'time',
    component: 'RangePicker',
    componentProps: {
      picker: 'day',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 8 },
  },
  {
    label: '任务类型及权重设置',
    component: 'Input',
    field: 'taskTypes',
    slot: 'taskTypes',
    colProps: {sm: 22, md: 22},
  }
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '部门名称',
    field: 'departName',
    component: 'Input',
    colProps: { span: 6 },
  },
];