<template>
  <BasicModal
    @register="register"
    v-bind="$attrs"
    title="配置字段"
    destroyOnClose
    defaultFullscreen
    @ok="handleSubmit"
    width="100%"
    @cancel="cancelFn"
  >
    <div class="expand-designer epic-designer">
      <a-spin :spinning="spinning">
        <EDesigner :editContainerDisabled="true" ref="signer" />
      </a-spin>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { deepClone, EDesigner, pluginManager, useShareStore } from '@coderlt/form-designer';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { superviseExtendTilte } from '../designerConfig/supervise';
  import { validFormEmptyOptions, validFormLabelOptions } from '../designerConfig/common';

  export interface ExpandFormConfig {
    id: string;
    schemas: any;
  }

  const { canvasScale } = useShareStore();
  const { createMessage } = useMessage();
  const signer = ref<InstanceType<typeof EDesigner> | null>(null);

  const formData = ref<ExpandFormConfig>({
    id: '',
    schemas: '',
  });
  const spinning = ref(false);

  const emit = defineEmits<{
    (event: 'expandTemplateChange', data: { id: string; schemas: any }): void;
    // Parameters<RegisterFn> todo 函数类型申明
    (event: 'register', data: any): void;
  }>();

  // 弹窗声明
  const [register, { closeModal, setModalProps }] = useModalInner((data: ExpandFormConfig) => {
    formData.value = data;
    spinning.value = true;

    pluginManager.setCurrentSchemaType([superviseExtendTilte]);

    // const { schemas, script } = data.schemas;

    console.log('schemas', data.schemas);

    signer.value && signer.value.setData(deepClone(data.schemas), true);
    canvasScale.value = 1.0;

    spinning.value = false;

    //关闭loading
    setModalProps({ confirmLoading: false });
  });

  const handleSubmit = () => {
    if (!signer.value) {
      return console.error('模板编辑元素不存在');
    }

    const { schemas, script } = deepClone(signer.value.getData());

    const res = validFormEmptyOptions(schemas);
    if (!res.status) {
      return createMessage.warning(`${res.tips.join('、')} 选项不能为空`);
    }

    const labelRes = validFormLabelOptions({ schemas, script });
    if (!labelRes.status) {
      return createMessage.warning(`组件id 为 ${labelRes.tips.join(', ')} 项的字段名称不能为空`);
    }

    emit('expandTemplateChange', {
      id: formData.value.id,
      schemas: {
        schemas,
        script,
      },
    });

    closeModal();
  };

  //关闭弹窗
  const cancelFn = () => {
    closeModal();
  };
</script>

<style lang="less" scoped>
  .expand-designer {
    :deep(.epic-edit-range) {
      height: auto !important;
      max-height: 100% !important;
      .box-border {
        height: auto !important;
      }
    }

    :deep(.epic-designer-main) {
      height: 85vh;
      .epic-header-container,
      .epic-header-toolbar,
      .epic-action-bar,
      .edit-toolbar,
      .actions-container .action-item:nth-child(3) {
        display: none;
      }
    }
  }
</style>
