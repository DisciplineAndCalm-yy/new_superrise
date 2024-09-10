<template>
  <BasicModal @register="register" v-bind="$attrs" title="操作" @ok="handleSubmit" width="40%" @cancel="cancelFn">
    <div class="epic-designer">
      <EBuilder ref="EBuilderref" :pageSchema="pageSchema" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { EBuilder, PageManager } from '@coderlt/form-designer';
  import { superviseEditView, superviseAdd, superviseEdit } from '/@/api/supervise/index';
  import { disabledCooperationOptionsByIds, switchSingleChoiceDropdownFormat } from '../../taskTemplateConfig/designerConfig/common';

  const isUpdate = ref(true);
  const templateId = ref('');
  const supId = ref('');
  const pageSchema = ref<any>({});
  const EBuilderref = ref();
  const checkObj = ref({});

  // 声明emit
  const emit = defineEmits(['success', 'setModalHidden', 'formData', 'checkCallback', 'callback']);

  // 弹窗声明
  const [register, { openModal, closeModal, setModalProps }] = useModalInner(async (data) => {
    // 接收参数
    console.log('11111', data);
    pageSchema.value = disabledCooperationOptionsByIds(JSON.parse(data.pageSchema), data.checkObj.departList);
    templateId.value = data.templateId;
    supId.value = data.supId;
    checkObj.value = data.checkObj;

    //关闭loading
    setModalProps({ confirmLoading: false });
  });

  const hasAnySameElement = (arr1, arr2) => {
    return arr1.some(item => arr2.includes(item));
  };

  //表单提交事件
  const handleSubmit = async () => {
    try {
      if (EBuilderref.value) {
        console.log('EBuilderref', await EBuilderref.value.validate());
      }
      const values = await EBuilderref.value.validate();
      console.log('values', values);
      setModalProps({ confirmLoading: true });

      let formData = JSON.parse(JSON.stringify(values));

      //附件ids字符串
      if (formData.attachments) {
        const storageIds = formData.attachments.map((item) => item.storageId).join(',');
        formData.attachments = storageIds;
      }

      //修改责任部门list为逗号隔开的字符串
      if (formData.responsibleDepart) {
        formData.responsibleDepart = formData.responsibleDepart.join(',');
      }

      //修改牵头部门list为逗号隔开的字符串
      if (formData.leadDepart) {
        formData.leadDepart = formData.leadDepart.join(',');
      }

      const finalFormData = switchSingleChoiceDropdownFormat(pageSchema.value, formData, 'edit');
      // emit('checkCallback', finalFormData);
      // if (hasAnySameElement(checkObj.value.departList, Object.values(finalFormData)[0])) {
      //   message.warning('选项内包含已存在部门，请检查后重新操作！');
      //   return;
      // }

      //关闭弹窗
      closeModal();
      emit('success');
      emit('callback', finalFormData);
      // 销毁弹窗
      emit('setModalHidden', false);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  // watch(
  //   () => checkVal,
  //   (newValue, oldValue) => {
  //     setModalProps({ checkVal: newValue });
  //   },
  //   {
  //     immediate: true,
  //     deep: true,
  //   }
  // );

  //关闭弹窗
  const cancelFn = () => {
    emit('setModalHidden', false);
  };
</script>
