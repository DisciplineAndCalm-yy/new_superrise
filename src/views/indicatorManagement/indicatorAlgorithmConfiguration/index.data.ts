import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { queryTemplateChooseList } from '/@/api/indicatorManagement/index'
import {  useRoute } from 'vue-router';
import { reactive } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '一级指标名称',
    dataIndex: 'indicatorName',
    width: 120,
  },
  {
    title: '二级指标个数',
    dataIndex: 'secondIndicatorNum',
    width: 120,
  },
  {
    title: '三级指标个数',
    dataIndex: 'thirdIndicatorNum',
    width: 120,
  },
  {
    title: '指标项个数',
    dataIndex: 'questionNum',
    width: 120,
  },
  {
    title: '配置一级指标权重',
    width: 150,
    dataIndex: 'indicatorWeight',
    // edit: true,
    // editComponent: 'InputNumber',
    // editValueMap: (value) => {
    //   if (value === 0) {
    //     return '0'
    //   } else {
    //     return value
    //   }
    // },
  },
];

export const columns2: BasicColumn[] = [
  {
    title: '二级指标名称',
    dataIndex: 'indicatorName',
    width: 120,
  },
  {
    title: '三级指标个数',
    dataIndex: 'thirdIndicatorNum',
    width: 120,
  },
  {
    title: '指标项个数',
    dataIndex: 'questionNum',
    width: 120,
  },
  {
    title: '二级指标权重',
    width: 150,
    dataIndex: 'indicatorWeight',
    // edit: true,
    // editComponent: 'InputNumber',
    // editValueMap: (value) => {
    //   if (value === 0) {
    //     return '0'
    //   } else {
    //     return value
    //   }
    // },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '选择指标体系',
    field: 'templateId',
    component: 'ApiSelect',
    slot: 'templateId',
    // componentProps: {
    //   api: queryTemplateChooseList,
    //   numberToString: true,
    //   labelField: 'name',
    //   valueField: 'id',
    //   allowClear: false,
    // },
    colProps: { span: 6 },
    ifShow: () => {
      const query = useRoute().query
      return !query.id
    }
  },
]

export const myState = reactive({
  templateId: undefined,
  setTemplateId(id) {
    this.templateId = id
  },
})