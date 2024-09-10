<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #tableTitle class="btnContainer">
      <a-button type="primary" @click="router.push({ path: '/supervise/line/lineAdd' })" v-if="hasPermission('supervise:lineAdd')">新建线索</a-button>
      <a-space>
        <a-button v-if="hasPermission('supervise-line:refuse')" type="primary" ghost
          :disabled="selectedRows.length == 0" @click="handleRefuse()">批量退回</a-button>
        <a-button v-if="hasPermission('supervise-line:templateExport')" type="primary" ghost
          @click="download(1)">模板下载</a-button>
        <j-upload-button v-if="hasPermission('supervise-line:templateExport')" size="small" type="primary" ghost
          @click="handleImport($event, 1)">批量导入</j-upload-button>
        <a-button v-if="hasPermission('supervise-line:export')" type="primary" :disabled="selectedRows.length == 0"
          @click="chooseExportKeys()">导出</a-button>

      </a-space>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'switchFlagDesc'">
        <a-switch v-model:checked="record.switchFlag" checkedValue="1" unCheckedValue="0"
          @click="(val) => handleSwitch(val, record)" />
      </template>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <!-- 导出弹窗 -->
  <exportKeysModal @register="registerExportKeysModal" @toDownLoad="exportKeysDownLoad"></exportKeysModal>
</template>

<script lang="ts" setup name="taskTemplateConfigIndex">
import { ref, watch, onMounted } from 'vue'
import { templateDownload, cluesDataImport, dataExportKeys, listSubmit } from '/@/api/supervise/index'
import exportKeysModal from '../components/exportKeysModal.vue';
import { usePermission } from '/@/hooks/web/usePermission';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema } from './index.data';
import { useRouter, useRoute } from 'vue-router';
import { getTemplateList, enableTemplate, getTemplateDetail } from '/@/api/taskTemplateConfig';
import { superviseProblemsList, batchSendBack, lineDel } from '/@/api/supervise';
import { useMessage } from '/@/hooks/web/useMessage'
import { exportMethod } from '/@/utils/file/download';
import { onBeforeRouteEnter } from 'vue-router'



const { hasPermission } = usePermission();
const router = useRouter();
const route = useRoute();
const query = route.query;

watch(route, (newParams) => {
  if(route.query.refresh){
    reload()
  }
})
//模板id
const templateId = ref('')
//菜单名称
const templateName = ref('')
//最终的表头
const finalColumns = ref([])

//formArr
const formArr = ref([])

//列表展示字段
const keys = ref([])

//进度数组
const steps = ref([])

const selectedKey = ref('')
// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    title: '',
    // dataSource: [{}],
    api: superviseProblemsList,
    columns: columns,
    showIndexColumn: true,
    immediate: true,
    size: 'small',
    scroll: { x: 1300 },
    useSearchForm: !query.id,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      showAdvancedButton: false,
    },
    actionColumn: {
      width: 300,
      fixed: 'right',
    },
    rowKey: 'clueId',
    rowSelection: {
      checkStrictly: false,
      preserveSelectedRowKeys: false,
      // getCheckboxProps: getCheckboxProps
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      // params.templateId = templateId.value
    },

  },
});

const [registerTable, { reload, setProps, clearSelectedRowKeys }, { rowSelection, selectedRowKeys, selectedRows, getRawDataSource }] = tableContext;

//选key导出弹窗注册
const [registerExportKeysModal, { openModal: openExportKeysModal, closeModal: closeExportKeysModal }] = useModal();

const { createMessage } = useMessage();

async function initData() { }
initData();

function getTableAction(record): ActionItem[] {
  return [
    {
      label: '编辑',
      onClick: () => {
        router.push({
          path: '/supervise/line/lineAdd',
          query: {
            id: record.clueId,
          },
        });
      },
      ifShow: () => {
        return (record.clueStatus == 0 || record.clueStatus == 2) && hasPermission('supervise:lineEdit')
      },
    },
    {
      label: '退回',
      color: 'error',
      onClick: handleRefuse.bind(null, record),
      ifShow: () => {
        return record.clueStatus == 1 && hasPermission('supervise-line:refuse')
      },
    },
    {
      label: '删除',
      color: 'error',
      onClick: handleDelete.bind(null, record),
      ifShow: () => {
          return (record.clueStatus == 0 || record.clueStatus == 2) && hasPermission('supervise:lineDel')
      },
    },
    {
      label: '提交',
      // color: 'error',
      onClick: handleSubmit.bind(null, record),
      ifShow: () => {
        return (record.clueStatus == 0 || record.clueStatus == 2) && hasPermission('supervise-line:submit')
      }
    },
    {
        label: '查看',
        onClick: () => {
        router.push({
            path: '/supervise/line/lineAdd',
            query: {
              id: record.clueId,
              readOnly:true
            },
          });
        }
    }
    
  ];
}

/**
   * 提交事件
   * @param supId {String} 督办数据id
   * @param templateId {String} 模板id
   */
  function handleSubmit(record) {
    Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要执行该操作吗？',
    onOk() {
      listSubmit({ clueId: record.clueId}).then(res => {
        reload()
    })
    },
    onCancel() {
      console.log('Cancel');
    },
    class: 'test',
  });

    
  }

  /**
   * 删除事件
   * @param supId {String} 督办数据id
   * @param templateId {String} 模板id
   */
   function handleDelete(record) {
    Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要执行该操作吗？',
    onOk() {
      lineDel({ clueId: record.clueId}).then(res => {
        reload()
    })
    },
    onCancel() {
      console.log('Cancel');
    },
    class: 'test',
  });

    
  }

/**
   * 退回事件
   * @param supId {String} 督办数据id
   * @param templateId {String} 模板id
   */
function handleRefuse(record) {
  console.log('record', record)
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要执行退回操作吗？',
    onOk() {
      const clueIds = record == undefined ? selectedRowKeys.value : [record.clueId];
      console.log('clueIds', clueIds.join(','))
      // return
      batchSendBack({ clueIds: clueIds.join(',') }).then(res => {
        reload()
        clearSelectedRowKeys()
      })
    },
    onCancel() {
      console.log('Cancel');
    },
    class: 'test',
  });

}


//导出
const download = (type, params) => {
  switch (type) {
    case 1:
      exportMethod(templateDownload, `问题线索-模板.xlsx`)
      break;
    case 2:
      exportMethod(dataExportKeys, '问题线索.xlsx', params, 'post')
      closeExportKeysModal()
      clearSelectedRowKeys()
      break;
    default:
      break;
  }

}

const exportKeysDownLoad = (data) => {
  download(2, data)
}

/**
 * 导入
*/
const handleImport = (file, type) => {
  const fn = cluesDataImport
  fn(file.file).then(res=>{
      setTimeout(() => {
      reload()
      clearSelectedRowKeys()
    }, 1500);
  })
  
}

/**
 * 选择导出字段
*/
const chooseExportKeys = () => {
  openExportKeysModal(true, {
    supList: selectedRowKeys.value,
    templateId: "",
    finalColumns: columns.map(item => {
      let obj = { dataIndex: "", key: "", title: "" }
      obj.dataIndex = item.dataIndex;
      obj.key = item.dataIndex;
      obj.title = item.title;
      // if (item.children != undefined) {
      //     obj.children = item.children
      // }
      return obj
    })
  })
}

// 添加一个导航守卫，在当前组件将要离开时触发。
// onBeforeRouteEnter((to, from, next) => {
//   console.log(1)
//     next()
//   })
 


// // 生命周期
// onMounted(() => {
//   //获取templateId和路由名称
//   const id = route.path.split('/').pop()
//   templateId.value = id
//   templateName.value = route.meta.title
//   reload()
// })
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
