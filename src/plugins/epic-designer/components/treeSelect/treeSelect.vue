<script setup lang="ts">
  import { PageManager, capitalizeFirstLetter } from '@coderlt/form-designer';
  import { computed, inject, watch } from 'vue';

  const props = defineProps({
    record: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  });
  const emit = defineEmits(['update:value']);

  function handleUpdate(e = null): void {
    emit('update:value', e);
  }

  // 接收页面管理对象
  const pageManager = inject('pageManager', {}) as PageManager;
  // 表单formData数据
  let formData = inject('formData', {});
  watch(
    () => formData[props.record.field ?? ''],
    () => {
      if ('change' in props.record.on) {
        setTimeout(() => {
          pageManager.doActions(props.record.on.change);
        }, 500);
      }
    }
  );

  const onEvent: { [type: string]: Function } = {};

  // props.record.on &&
  //   Object.keys(props.record.on).forEach((item) => {
  //     !['change', 'vnodeMounted'].includes(item) &&
  //       (onEvent[`on${capitalizeFirstLetter(item)}`] = (...args) => pageManager.doActions(props.record.on[item], ...args));
  //   });
  const getProps = computed(() => {
    return {
      ...props.record.componentProps,
      'onUpdate:value': handleUpdate,
      ...onEvent,
    };
  });
</script>

<template>
  <a-tree-select v-bind="getProps" />
</template>

<style scoped lang="less"></style>
