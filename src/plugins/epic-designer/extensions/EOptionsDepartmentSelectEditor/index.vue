<template>
  <a-tree-select
    v-model:value="modelValueComputed"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择部门"
    allow-clear
    tree-checkable
    tree-default-expand-all
    :tree-data="departmentData"
    :field-names="{
      children: 'children',
      label: 'title',
      value: 'value',
    }"
    :maxTagCount="1"
    tree-node-filter-prop="title"
  />
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { pluginManager } from '@coderlt/form-designer';

  const props = defineProps<{
    record: {
      type: Object;
      require: true;
      default: () => {};
    };
    modelValue: { desc: string }[];
  }>();

  const emit = defineEmits(['update:modelValue']);

  const modelValueComputed = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });

  const departmentData = ref([]);

  const getDepartmaneData = async () => {
    const data = await pluginManager.publicMethods.getResponsibleOrg.method();
    departmentData.value = data;
  };

  getDepartmaneData();
</script>
