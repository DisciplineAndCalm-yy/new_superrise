import { FormSchema } from '/@/components/Table';
import { getSupStatus, getTaskStateType } from '/@/api/supervise/index'
// import { getResponsibleOrg } from '/@/api/taskTemplateConfig'
import { queryIdTree } from '/@/views/system/departUser/depart.user.api';
import moment from 'moment';

// 公共查询条件
export const publicSearchFormSchema: FormSchema[] = [
  // {
  //   label: '任务状态',
  //   field: 'taskStateFilterType',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getTaskStateType,
  //     numberToString: true,
  //     labelField: 'dictName',
  //     valueField: 'dictCode',
  //     // allowClear: false,
  //   },
  // },
  {
    label: '流程状态',
    field: 'supStatus',
    component: 'ApiSelect',
    componentProps: {
      api: getSupStatus,
      numberToString: true,
      labelField: 'dictName',
      valueField: 'dictCode',
      // allowClear: false,
    },
  },

  {
    label: '完成时限',
    field: 'requireTime',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    }
  },
  {
    label: '发布日期',
    field: 'createTime',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    }
  },
  {
    label: '填报单位',
    field: 'fillDepart',
    component: 'ApiTreeSelect',
    componentProps: {
      //multiple: 多选；不填写为单选
      multiple: true,
      treeCheckable: true,
      // treeCheckStrictly: true,
      //请求api,返回结果{ result: { records: [{'id':'1',name:'scott'},{'id':'2',name:'小张'}] }}
      api: queryIdTree,
      exceptVal: "1776806892899328002",//排除选项，对应的字段为valueField，默认用value排除
      //标题字段
      labelField: 'title',
      //值字段
      valueField: 'value',
      maxTagCount: 1,
      //请求参数
      // params:{},
      //返回结果字段
      // resultField:'records'
    },
  },
  // {
  //   label: '填报月份',
  //   field: 'replyMonth',
  //   component: 'MonthPicker',
  //   componentProps: {
  //     valueFormat: 'YYYY-MM',
  //     disabledDate(current) {
  //       // 获取当前月份和年份
  //       const now = moment();
  //       const year = now.year();
  //       const month = now.month();
  //       // 如果当前日期在当前月份之后，则禁用
  //       return current.year() > year || (current.year() === year && current.month() > month);
  //     }
  //   }
  //   },
  // {
  //   label: '最新回复日期',
  //   field: 'replyTime',
  //   component: 'RangePicker',
  //   componentProps: {
  //     valueType: 'Date',
  //   }
  // },
  // {
  //   label: '填报状态',
  //   field: 'fillFlag',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       {value: '0', label: '未填报'},
  //       {value: '1', label: '已填报'},
  //     ]
  //   }
  // },
];

// 重点任务查询条件
export const taskSearchFormSchema: FormSchema[] = [
  {
    field: 'keyTask',
    component: 'Input',
    label: '重点任务',
    componentProps: {
      placeholder: '请输入',
    },
  }
];

/**
 * 获取最终查询条件
 * @param name {String} 模板名称
 * @param type {String} 类型：search/list
*/
export const getColumns = (name, type) => {
  console.log('name', name)
  const additionalKeys = ['taskState', 'progress', 'problem', 'nextStep', 'isFillOverdue', 'overdue', 'replyMonth', 'supStatus', 'releaseDepart', 'releaseTime']
  switch (name) {
    case '重点任务':
      return type == 'search' ? [...taskSearchFormSchema, ...publicSearchFormSchema] : additionalKeys
      break;

    case '创新示范':
      return type == 'search' ? [...taskSearchFormSchema, ...publicSearchFormSchema] : additionalKeys
      break;

    case '创新试点改革举措':
      return type == 'search' ? [...taskSearchFormSchema, ...publicSearchFormSchema] : additionalKeys
      break;

    default:
      return type == 'search' ? [...publicSearchFormSchema] : additionalKeys
      break;
  }
}


