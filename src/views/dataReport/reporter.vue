<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <!-- <a-button type="primary" v-if="!query.id" >导出</a-button> -->
    </template>
    <template #form-templateId="{ model, field }">
      <a-select v-model:value="model[field]" :allowClear="false">
        <a-select-option :value="item.id" v-for="item in templateList" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </template>
    <template v-slot:bodyCell="{ column, record }">
      <template v-if="column.key === 'activateStatusText'">
        <a-tag :color="setColor('activateStatus', record.activateStatus)">{{ record.activateStatusText }}</a-tag>
        <!-- <a-button size="small" :style="{'background': setColor('activateStatus', record.activateStatus), 'color':'white'}">{{ record.projectStatusText }}</a-button> -->
      </template>
      <template v-if="column.key === 'projectSendStatusText'">
        <a-tag :color="setColor('projectSendStatus', record.projectSendStatus)" >{{ record.projectSendStatusText || '--'}}</a-tag>
      </template>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <!-- <TableAction :actions="getTableAction(record)">
        
      </TableAction> -->
      <!-- <a-space> -->
        <a-button size="small" type="link" v-if="record.activateStatus == '3'" @click="handleShow(record)">查看</a-button>
        <a-button size="small" type="link" v-if="record.activateStatus == '2' && record.submitTime" @click="handleEdit(record)">修改</a-button>
        <a-button size="small" type="link" v-if="record.activateStatus == '2' && !record.submitTime" @click="handleReport(record)">报送</a-button>
        <a-button size="small" type="link" v-if="record.activateStatus == '2'" @click="handleOneReport(record)">一键报送</a-button>
        <a-button size="small" type="link" @click="handleExport(record)">导出</a-button>
        <j-upload-button size="small" type="link" v-if="record.activateStatus == '2'" @click="handleImport($event, record)">导入</j-upload-button>
      <!-- </a-space> -->
    </template>
  </BasicTable>
  <oneClickSubmitModal @register="registerModal" @success="reload"></oneClickSubmitModal>                              
</template>

<script lang="ts" setup>
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns2, searchFormSchema2 } from './index.data';
import { useRouter, useRoute } from 'vue-router';
import { sendFillAnswerList, exportSendAnswer, importSendAnswer } from '/@/api/dataReport/index'
import { reactive, computed, nextTick, ref  } from 'vue';
import oneClickSubmitModal from './components/oneClickSubmitModal.vue'
import { exportMethod } from '/@/utils/file/download';
import {setColor} from '/@/utils/perry'


const router = useRouter()
const route = useRoute()
const query = route.query
const templateList = ref([])  // 指标体系列表
const emit = defineEmits(['nextStep'])
// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    title: '数据报送',
    // dataSource: [{}],
    immediate: true,
    api: sendFillAnswerList,
    columns: columns2,
    size: 'small',
    scroll: { x: 1300 },
    useSearchForm: !query.id,
    formConfig: {
      // labelWidth: 150,
      schemas: searchFormSchema2,
      showAdvancedButton: false,
      fieldMapToTime: [
        ['date', ['startDate', 'endDate'], 'YYYY-MM-DD']
      ]
      // resetFunc: async () => {
      //   return new Promise( () => {
      //     // if (!query.id) {
      //       let list = templateList.value
      //       getForm().setFieldsValue({templateId: list[0].id})
      //     // } else {

      //     // }
      //     return reload()
      //   })
      // },
    },
    actionColumn: {
      width: 200,
      fixed: 'right',
    },
    rowKey: 'auditId',
    rowSelection: {
      preserveSelectedRowKeys: false,
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      console.log('请求前参数处理')
      if (query.id) {
        params.projectId = query.id
      }
    },
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, setColumns, getForm, getDataSource }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;
const [registerModal, {openModal}] = useModal()

/**
 * 初始化表格数据
 */
async function initData() {

}
initData()

/**
 * 跳转到预览
 */
function toPreview() {
  let params = getForm().getFieldsValue()
  router.push({
    path: '/indicatorManagement/indicatorAlgorithmConfiguration/preview',
    query: {
      templateId: params.templateId
    }
  })
}

/**
 * 操作栏
 */
 function getTableAction(record): ActionItem[] {
  return [
    {
      label: '查看',
      onClick: () => {
        router.push({
          path: '/dataReport/reporterDetail',
          query: {
            id: record.id,
            readonly: 1,
          }
        })
      },
      ifShow: () => {
        return record.activateStatus == '3'
      },
    },
    {
      label: '修改',
      onClick: () => {
        router.push({
          path: '/dataReport/reporterDetail',
          query: {
            id: record.id
          }
        })
      },
      ifShow: () => {
        return record.activateStatus == '2' && record.submitTime
      },
    },
    {
      label: '报送',
      color: 'warning',
      onClick: () => {
        router.push({
          path: '/dataReport/reporterDetail',
          query: {
            id: record.id
          }
        })
      },
      ifShow: () => {
        return record.activateStatus == '2' && !record.submitTime
      },
    },
    {
      label: '一键报送',
      onClick: () => {
        openModal(true, record)
      },
      ifShow: () => {
        return record.activateStatus == '2'
      },
    },
    {
      label: '导入',
      ifShow: () => {
        return record.activateStatus == '2'
      },
    },
    {
      label: '导出',
      onClick: () => {
        exportMethod(exportSendAnswer, `${record.name}.xlsx`, { id: record.id });
      },
    },
  ];
}
// 查看
function handleShow(record) {
  router.push({
    path: '/dataReport/reporterDetail',
    query: {
      id: record.id,
      readonly: 1,
    }
  })
}
// 修改
function handleEdit(record) {
  router.push({
    path: '/dataReport/reporterDetail',
    query: {
      id: record.id
    }
  })
}
// 报送
function handleReport(record) {
  router.push({
    path: '/dataReport/reporterDetail',
    query: {
      id: record.id
    }
  })
}
// 一键报送
function handleOneReport(record) {
  openModal(true, record)
}
// 导入
function handleImport(file, record) {
  console.log('file', file)
  console.log('record', record)
  importSendAnswer(file.file, {id: record.id})
}
// 导出
function handleExport(record) {
  exportMethod(exportSendAnswer, `${record.name}.xlsx`, { id: record.id });
}
</script>

<style lang="less" scoped>
.tips {
  margin: 10px;
  color: red;
}
.weight {
  max-width: 200px;
}
</style>