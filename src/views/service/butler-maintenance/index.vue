<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <MaintenanceModal width="40vw"  destroyOnClose @register="registerMaintenanceModal" @success="reload" />
</template>

<script setup name="service-butler-maintenance" lang="ts">
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerMangerList } from './index.api';
import { columns, searchFormSchema } from './index.data';
import MaintenanceModal from "./MaintenanceModal.vue";
import { useModal } from '/@/components/Modal';

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'enterprise-library',
  tableProps: {
    showTableSetting: false,
    showIndexColumn: true,
    api: enterpriseEntMangerMangerList,
    columns: columns,
    size: 'small',
    formConfig: {
      showAdvancedButton: false,
      baseColProps: {
        span: 8,
        lg: 8,
        xxl: 8
      },
      labelWidth: 100,
      labelAlign: 'left',
      schemas: searchFormSchema,
      fieldMapToTime: [
        ['toDate', ['startDate', 'endDate'], 'x']
      ]
    },
    actionColumn: {
      fixed: 'right',
      width: 240,
    },
  },
});


const [registerTable, { reload }] = tableContext;
const [registerMaintenanceModal, { openModal: openMaintenanceModal }] = useModal();

/**
* 操作栏
*/
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '维护',
      onClick: () => {
        openMaintenanceModal(true, record)
      },
      // ifShow: () => hasPermission('system:user:edit'),
    },
  ];
}
</script>

<style></style>