<template>
  <draggable
    v-model="modelValueComputed"
    item-key="id"
    :component-data="{
      type: 'transition-group',
    }"
    group="option-list"
    handle=".handle"
    :animation="200"
  >
    <template #item="{ element, index }">
      <div>
        <div class="grid-cols-[16px_auto_auto_16px] option-item grid gap-2 items-center mb-2">
          <HolderOutlined class="mr-2 text-lg cursor-move handle" />
          <Input v-model="element.desc" v-model:value="element.desc" placeholder="label" />
          <DeleteOutlined class="text-lg hover:text-red cursor-pointer" @click="handleRemove(index)" />
        </div>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts" setup>
  import draggable from 'vuedraggable';
  import { pluginManager } from '@coderlt/form-designer';
  import { computed } from 'vue';
  import { HolderOutlined, DeleteOutlined } from '@ant-design/icons-vue';

  defineOptions({
    name: 'KOptionsCol',
  });

  const props = defineProps<{
    modelValue: { desc: string }[];
  }>();
  const Input = pluginManager.getComponent('input');
  const emit = defineEmits(['update:modelValue']);
  const modelValueComputed = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });

  /**
   * 删除选项
   * @param index
   */
  function handleRemove(index: number) {
    modelValueComputed.value?.splice(index, 1);
  }
</script>
