<template>
  <div class="deadline-type">
    <FormItem
      v-bind="attrs"
      :required="getRequired"
      :label="attrs.record.label"
      name="formState.deadlineType"
      :rules="[{ required: getRequired, validator: validatePass, message: '该项不能为空', type: 'string' }]"
    >
      <div class="deadline-type-box">
        <FormItem>
          <DatePicker
            v-if="getOptions.type === 'date'"
            v-model:value="formState.requireEndTime"
            :valueFormat="getOptions.valueFormat"
            name="deadlineType"
            @change="onDeadlineTypeChange"
            :disabled="attrs.disabled"
          />
          <MonthPicker
            v-else
            name="deadlineType"
            v-model:value="formState.requireEndTime"
            :valueFormat="getOptions.valueFormat"
            @change="onDeadlineTypeChange"
            :disabled="attrs.disabled"
          />
        </FormItem>
        <FormItem>
          <Checkbox
            class="check-box"
            name="requireEndTime"
            v-model:checked="formState.deadlineType"
            @change="onDeadlineTypeChange"
            :disabled="attrs.disabled"
          >
            {{ getOptions.checkText }}
          </Checkbox>
        </FormItem>
      </div>
    </FormItem>
  </div>
</template>
<script lang="ts" setup>
  import { ref, useAttrs, watch, onMounted, computed, Ref, inject } from 'vue';
  import { FormItem, DatePicker, Checkbox, MonthPicker } from 'ant-design-vue';
  import { PageManager } from '@coderlt/form-designer';

  const props = defineProps({
    modelValue: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const getOptions = computed(() => attrs.record.componentProps);

  const forms = inject('forms', {}) as Ref<{ [name: string]: any }>;

  const attrs = useAttrs() as any;

  const formState = ref({
    requireEndTime: '',
    deadlineType: false,
  });

  const getRequired = computed(() => attrs.record && attrs.record.rules && attrs.record.rules.length && attrs.record.rules[0].required);

  const validatePass = async () => {
    if (getRequired.value) {
      if (formState.value.deadlineType) {
        return Promise.resolve();
      }
      if (formState.value.requireEndTime) {
        return Promise.resolve();
      }
      return Promise.reject('该项不能为空!');
    } else {
      return Promise.resolve();
    }
  };

  const onDeadlineTypeChange = () => {
    if (forms.value?.default) {
      forms.value.default.validateFields('formState.deadlineType');
    }
  };

  const getValue = () => ({
    requireEndTime: formState.value.requireEndTime,
    deadlineType: formState.value.deadlineType ? getOptions.value.checkedValue : getOptions.value.unCheckedValue,
  });

  // 接收页面管理对象
  const pageManager = inject('pageManager', {}) as PageManager;

  onMounted(() => {
    emit('update:modelValue', {
      requireEndTime: formState.value.requireEndTime,
      deadlineType: formState.value.deadlineType ? getOptions.value.checkedValue : getOptions.value.unCheckedValue,
    });
    setTimeout(() => {
      pageManager.doActions(attrs.record.on.change);
    }, 500);
  });

  watch(
    () => formState.value,
    (val) => {
      emit('update:modelValue', {
        requireEndTime: val.requireEndTime,
        deadlineType: val.deadlineType ? getOptions.value.checkedValue : getOptions.value.unCheckedValue,
      });
      setTimeout(() => {
        pageManager.doActions(attrs.record.on.change);
      }, 500);
    },
    {
      deep: true,
    }
  );

  watch(
    () => props.modelValue,
    (val) => {
      const { requireEndTime, deadlineType } = val;

      formState.value.requireEndTime = requireEndTime;
      formState.value.deadlineType = deadlineType === getOptions.value.checkedValue;
    },
    {
      deep: true,
      immediate: true,
    }
  );

  defineExpose({
    getValue,
  });
</script>

<style lang="less" scoped>
  .deadline-type {
    .deadline-type-box {
      display: flex;
      :deep(.ant-form-item) {
        margin-bottom: 0;
      }
      .check-box {
        margin-left: 20px;
      }
    }
  }
</style>
