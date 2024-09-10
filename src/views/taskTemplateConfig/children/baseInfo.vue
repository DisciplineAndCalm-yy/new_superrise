<template>
  <div class="baseinfo">
    <div class="basic-form">
      <BasicForm @register="registerForm" style="margin-top: 50px; margin-left: 50px" />
    </div>
    <div class="btn">
      <a-button @click="onCancelChange">取消</a-button>
      <a-button @click="onNextStepChange" type="primary">下一步</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import { useForm, BasicForm, FormSchema } from '/@/components/Form';
  import { BaseInfo } from '../index.data';
  import { getSupCiteType } from '/@/api/taskTemplateConfig';

  export interface FormData {
    templateName: string;
    citeType: string;
  }

  const props = withDefaults(defineProps<{ templateData: BaseInfo }>(), {
    templateData: () => ({
      citeType: '',
      oldCiteType: '',
      templateId: '',
      templateName: '',
    }),
  });

  const emit = defineEmits<{
    (event: 'cancel'): void;
    (event: 'nextStepChange', data: { step: number; data: Object }): void;
  }>();

  const formSchemas: FormSchema[] = [
    {
      label: '模板信息',
      field: 'templateName',
      component: 'Input',
      labelWidth: 150,
      labelLength: 3,
      required: true,
    },
    {
      label: '引用流程',
      field: 'citeType',
      component: 'ApiSelect',
      labelWidth: 150,
      labelLength: 3,
      required: true,
      componentProps: {
        api: getSupCiteType,
        labelField: 'dictName',
        valueField: 'dictCode',
        allowClear: false,
      },
    },
  ];

  const [registerForm, { setFieldsValue, validate }] = useForm({
    schemas: formSchemas,
    autoSubmitOnEnter: false,
    showResetButton: false,
    showSubmitButton: false,
    submitButtonOptions: { text: '下一步', preIcon: '' },
    actionColOptions: { span: 17 },
  });

  const onCancelChange = () => {
    emit('cancel');
  };

  const onNextStepChange = () => {
    validate().then((res) => {
      emit('nextStepChange', {
        step: 1,
        data: res,
      });
    });
  };

  watch(
    () => props.templateData,
    (val: BaseInfo) => {
      setFieldsValue(val);
    },
    {
      deep: true,
    }
  );
</script>

<style lang="less" scoped>
  .baseinfo {
    display: flex;
    flex-direction: column;
    height: 100%;

    .basic-form {
      flex: 1;
      width: 50%;
      margin: 0 auto;
    }

    .btn {
      padding: 10px 0;
      text-align: center;
      height: 50px;
      border-top: 1px solid #eaeaea;
      .ant-btn + .ant-btn {
        margin-left: 10px;
      }
    }
  }
</style>
