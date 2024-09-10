<template>
  <a-card>
    <BasicForm @register="registerForm" @submit="getDepartDetail">
      <template #taskTypes="{model, field}">
        <div class="task-type">
          <div
            class="task-item"
            v-for="task in taskTypes"
            :key="task.templateId"
          >
            <a-checkbox v-model:checked="task.isChecked">
              {{ task.templateName }}
            </a-checkbox>
            <a-input-number
              :min="0"
              :max="100"
              v-model:value="task.value"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
            />
          </div>
        </div>
      </template>
    </BasicForm>
  </a-card>
  <BasicTable @register="registerTable" :rowSelection="rowSelection" :loading="loading">
    <template #toolbar>
      <a-button type="primary" :disabled="!scoreSetId" :loading="exportLoading" @click="handleExport">导出</a-button>
    </template>
  </BasicTable>
</template>

<script lang="ts" setup name="taskScore">
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { BasicForm, useForm } from '/@/components/Form';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema, searchFilterSchema } from './index.data';
import { useRouter, useRoute } from 'vue-router';
import { useMessage } from '/@/hooks/web/useMessage'
import { ref, reactive, onMounted } from 'vue'
import { confirmCalc, beforehandRetain, exportResultsScore, listTemplateTask } from '/@/api/supervise/task'
import { exportMethod } from '/@/utils/file/download';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const query = route.query;

const taskTypes = ref([]);
const taskTypeList = ref([])  // 任务类型
const loading = ref(false)  // 列表loading
const scoreSetId = ref('')
const exportLoading = ref(false)
//表单
const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({
  schemas: searchFilterSchema,
  labelWidth: 150,
  baseColProps: { span: 6 },
  actionColOptions: { span: 24 },
  autoSubmitOnEnter: true,
  submitButtonOptions: { text: '确认计算', preIcon: '' },
  // fieldMapToTime: [//将表单内时间区域的值映射成 2 个字段
  //   ['time', ['startTime', 'endTime'], 'YYYY-MM-DD'],
  // ],
  resetFunc: resetForm
  // submitFunc: handleSubmit,
});

// 列表页面公共参数、方法
const { tableContext } = useListPage({
    tableProps: {
      // title: '督办模板',
      dataSource: [],
      // api: getTemplateList,
      columns: columns,
      immediate: false,
      size: 'small',
      scroll: { x: 1300 },
      useSearchForm: true,
      formConfig: {
        labelWidth: 100,
        schemas: searchFormSchema,
        showAdvancedButton: false,
        submitFunc: handleDimSearch
      },
      showActionColumn: false,
      rowKey: 'scoreResId',
      rowSelection: {
        preserveSelectedRowKeys: false,
      },
    },
  });

const [registerTable, { reload, setColumns, setTableData, getForm, getSelectRowKeys }, { rowSelection }] = tableContext;

const { createMessage } = useMessage();

// 确认计算
async function getDepartDetail(values) {
  console.log('确认计算', values)
  const filedsValue = await getFieldsValue()
  console.log('确认计算-----', filedsValue)
  const params = {
    taskWeightList: [],
    departIds: values.selectDepName,
    startTime: null,
    endTime: null
  }
  console.log('tasktypes', taskTypes.value)
  const isSelectedTask = taskTypes.value.filter(i => i.isChecked)
  if (isSelectedTask.map(i => i.value).reduce((prov, next) => prov + next, 0) !== 100) {
    return createMessage.warning('各任务类型的权重相加之和要求为100%')
  } else {
    params.taskWeightList = isSelectedTask.map(i => ({
      templateId: i.templateId,
      weightValue: i.value
    }))
  }
  if(filedsValue.time && filedsValue.time.split(',')) {
    let timeArr = filedsValue.time.split(',')
    console.log('timearr', timeArr)
    params.startTime = dayjs(timeArr[0]).format('YYYY-MM-DD')
    params.endTime = dayjs(timeArr[1]).format('YYYY-MM-DD')
  }
  loading.value = true
  let result =  await confirmCalc(params)
  if (result && result.length) {
    generateColumn(result[0].departTaskResVOList || [])
    formatTable(result || [])
    scoreSetId.value = result[0].scoreSetId
  } else {
    generateColumn([])
    formatTable([])
  }
  loading.value = false
  console.log('resultettt', result)
}

// 查询上次的计算配置及列表结果 
async function handleDimSearch(isFirst = false) {
  loading.value = true
  console.log('isfierts', isFirst)
  const values = getForm().getFieldsValue()
  console.log('values', values)
  const result = await beforehandRetain(values).catch(() => {
    loading.value = false
  })
  isFirst && formatSearch(result || {})
  const { scoreCalcResVOList } = result || {}
  if (scoreCalcResVOList && scoreCalcResVOList.length) {
    generateColumn(scoreCalcResVOList[0].departTaskResVOList || [])

    formatTable(scoreCalcResVOList || [])

    scoreSetId.value = result.scoreSetId
  } else {
    generateColumn([])
    formatTable([])
  }
  loading.value = false
  console.log()
}
function formatSearch(data) {
  const { sysDepartVOList, startTime, endTime, taskWeightList } = data

  if (sysDepartVOList) {
    console.log('sysDepartVOList',sysDepartVOList)
    setFieldsValue({selectDepName: sysDepartVOList.map(i => i.id)})
  }

  if (startTime && endTime) {
    console.log('starttime---endtime', startTime, endTime)
    console.log('starttime---endtime', dayjs(startTime), dayjs(endTime))
    // setFieldsValue({time: `${ startTime},${endTime}`})
    setFieldsValue({time: [startTime, endTime]})
  }

  if (taskWeightList) {
    console.log('data.taskviw', taskWeightList)
    taskTypeList.value = taskWeightList
  }
}
// 生成表头
function generateColumn(columnData) {
  let newColumns = [...columns]
  columnData.forEach((item, index) => {
    newColumns.push(
      {
        title: item.templateName,
        children: [
          {
            title: '时限内完成',
            dataIndex: `${item.superviseTaskId}-complete`,
            align: 'center',
            key: `${item.superviseTaskId}-complete`,
            width: 100,
          },
          {
            title: '超期完成',
            dataIndex: `${item.superviseTaskId}-overdue-complete`,
            align: 'center',
            key: `${item.superviseTaskId}-overdue-complete`,
            width: 100,
          },
          {
            title: '其他',
            dataIndex: `${item.superviseTaskId}-keep-follow-count`,
            align: 'center',
            key: `${item.superviseTaskId}-keep-follow-count`,
            width: 150,
          },
          {
            title: '得分',
            dataIndex: `${item.superviseTaskId}-score`,
            align: 'center',
            key: `${item.superviseTaskId}-score`,
            width: 100,
          },
        ]
      }
    )
  })
  newColumns.push({
    title: '总分',
    dataIndex: 'score',
    align: 'center',
    width: 160,
    sorter: (a, b) => a.score - b.score,
    key: 'score',
  })
  setColumns(newColumns)
}

// 格式化table column字段属性
function formatTable(data) {
  let tabledata = data.map(i => {
    const column = {
      ...i,
    }

    if (i.departTaskResVOList && i.departTaskResVOList.length) {
      i.departTaskResVOList.forEach(({ superviseTaskId, effectivityCompleteTaskNum, overdueCompleteTaskNum, score, keepFollowCompleteTaskNum }) => {
        column[`${superviseTaskId}-complete`] = effectivityCompleteTaskNum
        column[`${superviseTaskId}-overdue-complete`] = overdueCompleteTaskNum
        column[`${superviseTaskId}-score`] = score
        column[`${superviseTaskId}-keep-follow-count`] = keepFollowCompleteTaskNum
      })
    }

    return column
  }) || []
  setTableData(tabledata)
}

// 重置计算
function resetForm() {
  taskTypes.value.forEach(task => {
    task.isChecked = false
    task.value = 0
  })
}
function getTaskType() {
  listTemplateTask().then((res) => {
    console.log('taskwithlist', taskTypeList.value)
    if (res && res.length) {
      const taskList = res.map(i => ({ templateId: i.templateId, templateName: i.templateName }))
      taskList.forEach(task => {
        const detail = taskTypeList.value.find(i => i.templateId === task.templateId)
        task.isChecked = detail ? true : false,
        task.value = detail && detail.weightValue || 0
      })
      taskTypes.value = taskList
    } else {
      taskTypes.value = []
    }
  })
}

function handleExport() {
  // exportLoading.value = true
  console.log('getSelectRowKeys', getSelectRowKeys())
  const scoreResIds = (getSelectRowKeys() || []).join(',')
  if (scoreSetId.value) {
    exportMethod(exportResultsScore, `督办任务评分.xlsx`, { scoreSetId: scoreSetId.value, scoreResIds});
  }
}

async function init() {
  await handleDimSearch(true)
  await getTaskType()
}
onMounted(() => {
  init()
})

</script>

<style lang="less" scoped>
.task-type {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  .task-item {
    margin: 0 20px 10px 0;
  }
}
</style>