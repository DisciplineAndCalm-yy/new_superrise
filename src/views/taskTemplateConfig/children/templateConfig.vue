<template>
  <div class="templateConfig epic-designer">
    <a-spin :spinning="spinning">
      <EDesigner :editContainerDisabled="true" v-if="props.isShow" ref="signer" />
    </a-spin>
    <div class="btn">
      <a-button @click="onCancelChange">取消</a-button>
      <a-button @click="onPrevStepChange">上一步</a-button>
      <a-button @click="onNextStepChange" type="primary">下一步</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { deepClone, EDesigner, pluginManager, useShareStore } from '@coderlt/form-designer';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { customSchema, defaultSchema, defaultNoticeSchema } from '../designerConfig';
  import { SchemasJson } from '../index.data';
  import { superviseTilte } from '../designerConfig/supervise';
  import { validFormEmptyOptions, validFormLabelOptions } from '../designerConfig/common';

  const props = withDefaults(defineProps<{ isShow: boolean; schemasJson: string }>(), {
    isShow: false,
    schemasJson: '',
  });

  const emit = defineEmits<{
    (event: 'cancel'): void;
    (event: 'nextStepChange', data: { step: number; data: string }): void;
    (event: 'prevStepChange'): void;
  }>();

  const { canvasScale } = useShareStore();

  const { createMessage } = useMessage();

  const signer = ref<InstanceType<typeof EDesigner> | null>(null);

  const isFirst = ref(true);
  const spinning = ref(false);

  watchEffect(() => {
    if (props.isShow) {
      pluginManager.setCurrentSchemaType([superviseTilte]);
      canvasScale.value = 1.0;
      if (isFirst.value) {
        spinning.value = true;
        setTimeout(() => {
          const schemasJson = props.schemasJson ? JSON.parse(props.schemasJson) : customSchema;
          setTemplate(schemasJson);
          isFirst.value = true;
          spinning.value = false;
        }, 500);
      } else {
        spinning.value = false;
      }
    }
  });

  const setTemplate = (schemasJson: SchemasJson) => {
    const { schemas, script } = schemasJson;

    signer.value &&
      signer.value.setData(
        {
          schemas: formatSchema(schemas, false),
          script,
        },
        true
      );
  };

  const handleReset = () => {
    signer.value && signer.value.setData(defaultSchema, true);
  };

  const onCancelChange = () => {
    emit('cancel');
  };
  const onPrevStepChange = () => {
    emit('prevStepChange');
  };
  const onNextStepChange = () => {
    if (!signer.value) {
      return console.error('模板编辑元素不存在');
    }
    const { schemas, script } = deepClone(signer.value.getData());

    const finalSchema = formatSchema(schemas, true);

    const res = validFormEmptyOptions(finalSchema);
    if (!res.status) {
      return createMessage.warning(`${res.tips.join('、')} 选项不能为空`);
    }

    const labelRes = validFormLabelOptions({ schemas, script });
    if (!labelRes.status) {
      return createMessage.warning(`组件id 为 ${labelRes.tips.join(', ')} 项的字段名称不能为空`);
    }

    emit('nextStepChange', {
      step: 2,
      data: JSON.stringify({
        schemas: finalSchema,
        script,
      }),
    });
  };

  // 编辑的时候,元素固定的禁用,去掉通知; 保存的时候,元素开启编辑,添加通知
  const formatSchema = (schema: any, isSave: boolean) => {
    if (!schema.length) {
      return [];
    }

    const formConfig = schema[0].children[0];

    if (isSave) {
      formConfig.children.push(defaultNoticeSchema);
    } else {
      formConfig.children = formConfig.children.filter((i) => i.id !== 'customNotice');
    }

    return schema;
  };

  defineExpose({
    setTemplate,
    handleReset,
  });
</script>

<style lang="less" scoped>
  .templateConfig {
    width: 100%;
    height: 613px;
    display: flex;
    flex-direction: column;

    // 高度自适应
    :deep(.epic-edit-range) {
      height: auto !important;
      max-height: 100% !important;
      .box-border {
        height: auto !important;
      }
    }

    :deep(.epic-designer-main) {
      height: 563px;
      // .epic-header-container,
      // .epic-header-toolbar,
      // .epic-action-bar,
      // .edit-toolbar,
      .actions-container .action-item:nth-child(3) {
        display: none;
      }
    }

    .btn {
      margin: 10px 0;
      text-align: center;
      height: 30px;
      .ant-btn + .ant-btn {
        margin-left: 10px;
      }
    }
  }
</style>
