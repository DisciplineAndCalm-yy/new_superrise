<template>
  <BasicModal @register="register" v-bind="$attrs" title="导出" @ok="handleSubmit" width="40%" @cancel="cancelFn">
    <!-- selectedRowKeys: {{ selectedRowKeys }} -->
    <h3><span style="color:red">* </span>导出文件将按照弹窗勾选字段及勾选顺序进行展示。如不需要某字段，请取消勾选。</h3>
    <span style="font-weight: bold;margin-right:5px">已选字段 : </span>
    <a-tag v-for="key in selectedRowKeys">{{ key }}</a-tag>

    <a-table rowKey="title" :columns="columns" :data-source="dataSource"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="false" />
  </BasicModal>
</template>
<script lang="ts" setup>
import { ref, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { superviseEditView, superviseAdd, superviseEdit } from '/@/api/supervise/index';
import { useMessage } from '/@/hooks/web/useMessage';
const { notification } = useMessage();
const isUpdate = ref(true);
const templateId = ref('');
const selectedRowKeys = ref([]);
const selectedRows = ref([]);
const columns = [
  // {
  //     "title": "序号",
  //     "dataIndex": "index",
  //     "key": "index"
  //   },
  {
    "title": "导出字段",
    "dataIndex": "title",
    "key": "title"
  }
]

const dataSource = ref([]);
const supList = ref([]);

const onSelectChange = (selectedRowKeys1, selectedRows1) => {

  selectedRowKeys.value = selectedRowKeys1;
  console.log(selectedRowKeys.value);
  selectedRows.value = selectedRows1;
};
// 声明emit
const emit = defineEmits(['success', 'toDownLoad']);

// 弹窗声明
const [register, { openModal, closeModal, setModalProps }] = useModalInner(async (data) => {
  // setModalProps({ defaultFullscreen: true })
  // 接收参数
  console.log('11111', data);
  templateId.value = data.templateId;
  supList.value = data.supList;
  dataSource.value = data.finalColumns;
  selectedRows.value = data.finalColumns;
  selectedRowKeys.value = dataSource.value.map(item => item.title);

  //关闭loading
  setModalProps({ confirmLoading: false });

  // // 赋值
  isUpdate.value = !!data?.isUpdate;

  // // 判断是否更新？即-编辑回显 | unref() 如果参数是一个ref则返回它的value，否则返回参数本身
  if (unref(isUpdate)) {
    const params = { templateId: data.templateId };
  }
});

//表单提交事件
const handleSubmit = async () => {
  if (selectedRows.value.length == 0) {
    notification.error({
      message: "警告",
      description: "请选择要导出的字段",
      duration: 3,
    });
    return
  }
  emit('toDownLoad', {
    supList: supList.value,
    templateId: templateId.value,
    columns: selectedRows.value
  });
};

//关闭弹窗
const cancelFn = () => {
  emit('setModalHidden', false);
};
</script>
