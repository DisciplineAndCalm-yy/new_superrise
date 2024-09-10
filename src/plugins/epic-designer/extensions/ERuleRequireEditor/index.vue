<template>
  <div>
    <ENode
      v-model="requiredRule.required"
      :record="{ ...requiredRuleSchemas[0], disabled: getDisabledStatus, noFormItem: true }"
      @change="handleUpdate"
    />
  </div>
</template>
<script lang="ts" setup>
  import { deepClone } from '@coderlt/form-designer';
  import { ref, watch, PropType, useAttrs, computed } from 'vue';
  import { FormItemRule } from './types';
  import { ENode } from '@coderlt/form-designer';

  const props = defineProps({
    modelValue: {
      type: Array as PropType<FormItemRule[] | undefined>,
      default: undefined,
    },
  });

  const attr = useAttrs();

  const requiredRule = ref<FormItemRule>(
    props.modelValue || {
      required: false,
      message: '必填项',
      type: 'string',
      trigger: ['change'],
    }
  );

  const requiredRuleSchemas = [
    {
      type: 'switch',
      label: '必填项',
      model: 'required',
    },
  ];

  const getDisabledStatus = computed(() => attr?.record?.componentProps?.disabled || false);

  const rules = ref<FormItemRule[]>([]);
  const emit = defineEmits(['update:modelValue']);

  watch(
    () => props.modelValue,
    (e) => {
      if (e) {
        if (!e) return;
        rules.value = [];
        e.forEach((item) => {
          // 必填项单独存储
          if (typeof item.required !== 'undefined') {
            requiredRule.value = item;
          } else {
            rules.value.push(item);
          }
        });
      }
    },
    {
      immediate: true,
    }
  );

  /**
   * 更新校验规则
   */
  function handleUpdate() {
    // 存在必填项时,合并其他规则
    if (requiredRule.value.required) {
      emit('update:modelValue', deepClone([...rules.value, requiredRule.value]));
      return;
    }

    // 存在其他规则
    if (rules.value.length) {
      emit('update:modelValue', deepClone(rules.value));
      return;
    }

    // 没有任何校验规则
    emit('update:modelValue', undefined);
  }
</script>
