<script setup lang="ts">
  import { watch, computed, inject, useAttrs, onMounted } from 'vue';
  import { PageManager } from '@coderlt/form-designer';
  const props = defineProps({
    record: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  });
  const emit = defineEmits(['update:value']);

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  function handleUpdate(e = null): void {
    emit('update:value', e);
  }

  // 接收页面管理对象
  const pageManager = inject('pageManager', {}) as PageManager;
  // 表单formData数据
  let formData = inject('formData', {});

  // 监听组件实例是否初始化
  watch(
    () => formData[props.record.field ?? ''],
    () => {
      if (props.record.on && 'change' in props.record.on) {
        setTimeout(() => {
          pageManager.doActions(props.record.on.change);
        }, 500);
      }
    }
  );

  const onEvent: { [type: string]: Function } = {};

  const getComponentTypeDesc = computed(() => {
    return props?.record?.componentProps?.optionType || 'department';
  });

  // 过滤节点
  const filterTree = (tree, ids, disableParents = false, disabledIds) => {
    const filterNode = (node) => {
      if (node.children) {
        const filteredChildren = node.children.map(filterNode).filter(Boolean);
        if (filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren,
            disabled: disableParents || disabledIds.includes(node.key),
          };
        }
      }
      if (ids.includes(node.key)) {
        return { ...node, disabled: disabledIds.includes(node.key) };
      }
      return null;
    };

    return tree.map(filterNode).filter(Boolean);
  };

  onMounted(() => {
    setTimeout(() => {
      if (getComponentTypeDesc.value === 'department' && props.record.on && 'vnodeMountedCustom' in props.record.on) {
        pageManager.doActions(props.record.on.vnodeMountedCustom, props.record.id);
      }
    }, 500);
  });

  const getProps = computed(() => {
    if (getComponentTypeDesc.value === 'department') {
      const filterTreeIds = props.record.componentProps?.treeSelectProps?.filterTreeIds || [];
      const disabledIds = props.record.componentProps?.treeSelectProps?.disabledIds || [];

      // 过滤模板配置树节点
      const filterTreeData = filterTree(
        props.record.componentProps?.treeData || [],
        filterTreeIds,
        props.record.componentProps?.mode === '',
        disabledIds
      );
      return {
        value: attrs.value,
        ...(props.record.componentProps?.treeSelectProps || {}),
        treeData: filterTreeData,
        treeCheckable: props.record.componentProps?.mode === 'multiple',
        placeholder: props.record.componentProps?.placeholder || '',
        'onUpdate:value': handleUpdate,
        disabled: attrs.disabled,
        ...onEvent,
      };
    } else {
      return {
        value: attrs.value,
        ...(props.record.componentProps?.selectProps || {}),
        options: props.record.componentProps?.options || [],
        mode: props.record.componentProps?.mode,
        placeholder: props.record.componentProps?.placeholder || '',
        'onUpdate:value': handleUpdate,
        disabled: attrs.disabled,
        ...onEvent,
      };
    }
  });
</script>

<template>
  <template v-if="getComponentTypeDesc === 'department'">
    <div class="question">1</div>
    <a-tree-select v-bind="getProps" key="department-tree-select" />
  </template>
  <template v-else>
    <a-select v-bind="getProps" />
  </template>
</template>

<style scoped lang="less">
  .question {
    position: absolute;
    z-index: -1;
  }
</style>
