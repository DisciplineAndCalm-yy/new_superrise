import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '采集范围',
    dataIndex: 'monitorTypeName',
    width: 120,
  },
  {
    title: '采集状态',
    dataIndex: 'activateStatusText',
    width: 120,
  },
  {
    title: '校核状态',
    dataIndex: 'checkStatusText',
    width: 120,
  },
  {
    title: '发起部门',
    dataIndex: 'createDepart',
    width: 120,
  },
  {
    title: '发起时间',
    dataIndex: 'activateTime',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '任务名称',
    field: 'projectName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '采集状态',
    field: 'activateStatus',
    component: 'Select',
    componentProps: {
      options: [
        {value: '2', label: '进行中'},
        {value: '3', label: '已结束'},
      ]
    },
    colProps: { span: 6 },
  },
  {
    label: '校核状态',
    field: 'checkStatus',
    component: 'Select',
    componentProps: {
      options: [
        {value: '0', label: '关闭'},
        {value: '1', label: '开启'},
      ]
    },
    colProps: { span: 6 },
  },
  {
    label: '发起时间',
    field: 'date',
    component: 'RangePicker',
    componentProps: {
      picker: 'day',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 6 },
  },
]

export const columns2: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '采集范围',
    dataIndex: 'monitorTypeName',
    width: 120,
  },
  {
    title: '采集状态',
    dataIndex: 'activateStatusText',
    width: 120,
  },
  {
    title: '报送状态',
    dataIndex: 'projectSendStatusText',
    width: 120,
  },
  {
    title: '发起部门',
    dataIndex: 'createDepart',
    width: 120,
  },
  {
    title: '发起时间',
    dataIndex: 'activateTime',
    width: 120,
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    width: 120,
  },
];

export const searchFormSchema2: FormSchema[] = [
  {
    label: '任务名称',
    field: 'projectName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '采集状态',
    field: 'activateStatus',
    component: 'Select',
    componentProps: {
      options: [
        {value: '2', label: '进行中'},
        {value: '3', label: '已结束'},
      ]
    },
    colProps: { span: 6 },
  },
  {
    label: '报送状态',
    field: 'sendStatus',
    component: 'Select',
    componentProps: {
      options: [
        {value: '0', label: '未报送'},
        {value: '1', label: '已报送'},
      ]
    },
    colProps: { span: 6 },
  },
  {
    label: '发起时间',
    field: 'date',
    component: 'RangePicker',
    componentProps: {
      picker: 'day',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: { span: 6 },
  },
]