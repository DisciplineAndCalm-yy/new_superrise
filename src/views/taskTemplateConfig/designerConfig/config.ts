import { ref } from 'vue';
import { MethodModel } from '@coderlt/form-designer';
import { getAdLevelApi } from '/@/api/demo/thinkTank';
import {
  getDeadlineType,
  getEmergency,
  getIndicator,
  getSupNoticeDaysType,
  getSupNoticeWeekType,
  getResponsibleOrg,
} from '/@/api/taskTemplateConfig';
import { queryIdTree } from '/@/views/system/departUser/depart.user.api';

const responsibleOrgList = ref<{ label: string; value: string }[]>([]);
export const setResponsibleOrg = async () => {
  const res = await queryIdTree();

  responsibleOrgList.value = res.filter((i) => i.value !== '1776806892899328002');

  return responsibleOrgList.value;
};

// setResponsibleOrg();

export const superviseMethodsConfig: MethodModel[] = [
  {
    methodName: 'getSuperviseExpandField',
    async method() {
      console.log('测试动态数据扩展方法');
      const res = await getAdLevelApi();
      return res.map((i) => ({ label: i.title, value: i.value }));
    },
    describe: '这是一个测试函数描述',
  },
  {
    methodName: 'getDeadlineType',
    async method() {
      const res = await getDeadlineType();
      return res.map((i) => ({ label: i.dictName, value: i.dictCode }));
    },
    describe: '完成时限字典',
  },
  {
    methodName: 'getEmergency',
    async method() {
      const res = await getEmergency();
      return res.map((i) => ({ label: i.dictName, value: i.dictCode }));
    },
    describe: '紧急程度字典',
  },
  {
    methodName: 'getIndicator',
    async method() {
      const res = await getIndicator();
      return res.map((i) => ({ label: i.dictName, value: i.dictCode }));
    },
    describe: '指标查询字典',
  },
  {
    methodName: 'getSupNotice',
    async method() {
      const dayRes = await getSupNoticeDaysType();
      const Weekres = await getSupNoticeWeekType();
      return {
        weekType: Weekres,
        daysType: dayRes,
      };
    },
    describe: '通知字典',
  },
  {
    methodName: 'getResponsibleOrg',
    async method() {
      if (!responsibleOrgList.value.length) {
        await setResponsibleOrg();
      }
      return JSON.parse(JSON.stringify(responsibleOrgList.value));
    },
    describe: '责任单位',
  },
  {
    methodName: 'setResponsibleOrg',
    method() {
      setResponsibleOrg();
    },
    describe: '初始化加载责任单位',
  },
];

export const scriptCode = `const { defineExpose, find, getResponsibleOrg, setResponsibleOrg, getSuperviseExpandField, getDeadlineType, getEmergency, getIndicator, getSupNotice } = epic;
// 完成时限
async function getDeadlineTypeApi() {
  const data = await getDeadlineType()
  const deadlineTypeDetail = find('deadlineType')
  if (deadlineTypeDetail) {
    deadlineTypeDetail.setAttr('options', data)
  } else {
    console.error('未找到完成时限组件', 'deadlineType')
  }
}

// 紧急程度
async function getEmergencyApi() {
  const data = await getEmergency()
  const emergencyDetail = find('emergency')
  if (emergencyDetail) {
    emergencyDetail.setAttr('options', data)
  } else {
    console.error('未找到紧急程度组件', 'emergency')
  }
}

// 指标查询
async function getIndicatorApi() {
  const data = await getIndicator()
  const indicatorDetail = find('indicator')
  if (indicatorDetail) {
    indicatorDetail.setAttr('options', data)
  } else {
    console.error('未找到紧急程度组件', 'indicator')
  }
}

// 完成时限回调
function handleDeadlineTypeChange() {
  const deadlineTypeDetail = find('deadlineType')
  console.log('deadlineTypeDetail', deadlineTypeDetail)
  if (deadlineTypeDetail) {
    const { deadlineType } = deadlineTypeDetail.getValue()

    // 通知
    const detail = find('customNotice')
    if (detail) {
      detail.setAttr('completionDeadline', deadlineType)
    } else {
      console.error('未找到完成通知组件', 'customNotice')
    }
  } else {
    console.error('未找到完成时间组件', 'deadlineType')
  }
}

// 设置通知数据
async function setNoticeData() {
  const data = await getSupNotice()
  const detail = find('customNotice')
  if (detail) {
    detail.setAttr('noticeTimeOptions', data.daysType.map(i => ({ label: i.dictName, value: i.dictCode })))
    detail.setAttr('noticeCycleOptions', data.weekType.map(i => ({ label: i.dictName, value: i.dictCode })))
  }
}

// 责任单位
async function getResponsibleOrgApi() {
  const data = await getResponsibleOrg()
  const detail = find('responsibleDepart')
  if (detail) {
    detail.setAttr('treeData', data)
  }
}

// 给点组件id设置组件参数
async function setResponsibleOrgByComponentIdApi(componentId) {
  if (!componentId) {
    console.error('id不能为空')
  }
  const data = await getResponsibleOrg()
  const detail = find(componentId)
  if (detail) {
    detail.setAttr('treeData', data)

    const treeSelectProps = detail.getAttr('treeSelectProps')
    if (treeSelectProps.filterTreeIds.length === 0) {
      const getAllChildKeys = (node) => {
        let keys = [];
        if (node.children) {
          keys = node.children.flatMap((child) => [child.key, ...getAllChildKeys(child)]);
        }
        return keys;
      };

      const allKeys = data.reduce((acc, node) => {
        return acc.concat(getAllChildKeys(node));
      }, []);

      treeSelectProps.filterTreeIds = allKeys


      detail.setAttr('treeSelectProps', treeSelectProps)
    }
  }
}

// 责任单位回调
function handResponsibleDepartChange() {
  const responsibleDepartDetail = find('responsibleDepart')
  console.log('responsibleDepartDetail', responsibleDepartDetail)
  if (!responsibleDepartDetail) {
    return console.warn('responsibleDepartDetail 责任单位 未找到')
  }

  const leadDepartDetail = find('leadDepart')
  console.log('leadDepartDetail', leadDepartDetail)
  if (!leadDepartDetail) {
    return console.warn('responsibleDepartDetail 牵头单位 未找到')
  }

  // 责任单位值
  const responsibleDepartVal = responsibleDepartDetail.getValue()
  const leadDepartOptions = leadDepartDetail.getAttr('treeData')
  if (leadDepartOptions && leadDepartOptions.length) {
    leadDepartDetail.setAttr('treeData', leadDepartOptions.map(i => {
      const { children, ...param } = i

      const newChildren = children.map(item => ({
        ...item,
        disabled: responsibleDepartVal.includes(item.value)
      }))

      const isAllDisabled = newChildren.every(child => child.disabled)

      return {
        ...param,
        disabled: isAllDisabled,
        children: newChildren
      }
    }))
  }
}

// 牵头单位
async function getLeadDepartApi() {
  const data = await getResponsibleOrg()
  const detail = find('leadDepart')
  if (detail) {
    detail.setAttr('treeData', data)
  }
}

// 牵头单位回调
function handLeleadDepartChange() {
  const leadDepartDetail = find('leadDepart')
  console.log('leadDepartDetail', leadDepartDetail)
  if (!leadDepartDetail) {
    return console.warn('responsibleDepartDetail 牵头单位 未找到')
  }

  const responsibleDepartDetail = find('responsibleDepart')
  if (!responsibleDepartDetail) {
    return console.warn('responsibleDepartDetail 责任单位 未找到')
  }

  // 牵头单位值
  const leadDepartVal = leadDepartDetail.getValue()
  const responsibleOptions = responsibleDepartDetail.getAttr('treeData')
  if (responsibleOptions && responsibleOptions.length) {
    responsibleDepartDetail.setAttr('treeData', responsibleOptions.map(i => {
      const { children, ...param } = i

      const newChildren = children.map(item => ({
        ...item,
        disabled: leadDepartVal.includes(item.value),
      }))

      const isAllDisabled = newChildren.every(child => child.disabled)

      return {
        ...param,
        disabled: isAllDisabled,
        children: newChildren
      }
    }))
  }
}

// 填报单位
async function getFillDepartApi() {
  const data = await getResponsibleOrg()
  const detail = find('fillDepart')
  if (detail) {
    detail.setAttr('treeData', data)
  }
}

async function setCorrespondingIndicatorsData() {
  const data = await getSuperviseExpandField()
  const responsibleDepartDetail = find('responsibleDepart')
  if (responsibleDepartDetail) {
    find('responsibleDepart').setAttr('options', data)
  } else {
    console.error('未找责任单位组件', 'customNotice')
  }
}

// 通过defineExpose暴露的函数或者属性
defineExpose({
  getDeadlineTypeApi,
  getEmergencyApi,
  getIndicatorApi,
  getResponsibleOrgApi,
  setResponsibleOrgByComponentIdApi,
  getLeadDepartApi,
  getFillDepartApi,
  handLeleadDepartChange,
  handResponsibleDepartChange,
  setResponsibleOrg,
 setCorrespondingIndicatorsData,
 handleDeadlineTypeChange,
 setNoticeData
})`;
