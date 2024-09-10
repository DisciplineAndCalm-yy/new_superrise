<template>
  <div class="">
    <div>
      <div class="attr-item">
        <div class="attr-label" title="所需列数">所需列数</div>
        <div class="attr-input">
          <InputNumber v-model:value="currentSize" @blur="handleSizeChange" />
        </div>
      </div>
    </div>
    <div class="attr-item vertical">
      <div class="attr-label">描述管理</div>
      <div class="attr-input">
        <div class="py-4 my-2 text-center text-gray-400 bg-white" v-show="!data?.length">暂无选项</div>
        <KOptionsCol v-model="data" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import KOptionsCol from './optionsCol.vue';
  import { InputNumber, message } from 'ant-design-vue';
  import { computed, ref, watch } from 'vue';
  const props = defineProps<{
    record: {
      type: Object;
      require: true;
      default: () => {};
    };
    modelValue: { desc: string }[];
  }>();

  const emit = defineEmits(['update:modelValue']);

  const data = ref<{ desc: string }[]>([{ desc: '' }]);

  const getNumberInputProps = computed(() => {
    return {
      min: props.record.componentProps.min,
      max: props.record.componentProps.max,
    };
  });

  const currentSize = ref(data.value.length);

  const handleSizeChange = () => {
    if (currentSize.value > getNumberInputProps.value.max) {
      currentSize.value = data.value.length;
      return message.error(`数量不能大于${getNumberInputProps.value.max}`);
    }

    if (currentSize.value < getNumberInputProps.value.min) {
      currentSize.value = data.value.length;
      return message.error(`数量不能小于${getNumberInputProps.value.min}`);
    }

    if (currentSize.value <= data.value.length) {
      data.value = currentSize.value ? data.value.slice(0, currentSize.value) : [{ desc: '' }];
    } else {
      data.value = [
        ...data.value,
        ...Array(currentSize.value - data.value.length)
          .fill(null)
          .map(() => ({ desc: '' })),
      ];
    }
  };

  watch(
    () => props.modelValue,
    (val) => {
      if (JSON.stringify(val) !== JSON.stringify(data.value)) {
        data.value = val;
      }
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    () => data.value,
    (val) => {
      currentSize.value = val.length;
      emit('update:modelValue', val);
    },
    {
      deep: true,
      immediate: true,
    }
  );
</script>
