<template>
  <div class="multiple-input">
    <a-form-item
      v-for="(item, index) in data"
      :key="index"
      :name="`data[${index}]`"
      :rules="[{ required: getRequire, validator: (_rule) => validatePass2(_rule, data[index]), message: '该项不能为空', type: 'string' }]"
    >
      <div class="desc">{{ getDesc[index]?.desc || '' }}</div>
      <div class="input-item">
        <a-input v-model:value="data[index]" v-bind="getProps" />
      </div>
    </a-form-item>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, useAttrs } from 'vue';
  import { NodeItem } from '../../types/components';

  const attrs = useAttrs();

  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [''],
    },
    record: {
      type: Object as PropType<NodeItem>,
      require: true,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:value']);

  let validatePass2 = async (_rule, val) => {
    if (getRequire.value) {
      if (val) {
        return Promise.resolve();
      } else {
        return Promise.reject('该项不能为空!');
      }
    } else {
      return Promise.resolve();
    }
  };

  const getRequire = computed(() => {
    if (props.record.rules && props.record.rules.length) {
      return props.record.rules[0].required;
    }

    return false;
  });

  const getProps = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { max, min, splicingSign, ...parmas } = props.record.componentProps;

    return {
      ...parmas,
      disabled: attrs.disabled,
    };
  });

  const getDesc = computed(() => {
    return props?.record?.componentProps?.schedulingDesc || [];
  });

  const data = ref<string[]>(['']);

  emit('update:value', data.value);

  watch(
    () => data.value,
    (e) => {
      emit('update:value', e);
    },
    { deep: true }
  );
  watch(
    () => getDesc.value.length,
    (currentSize) => {
      if (currentSize <= data.value.length) {
        data.value = data.value.slice(0, currentSize);
      } else {
        data.value = [...data.value, ...Array(currentSize - data.value.length).fill('')];
      }
    },
    { deep: true, immediate: true }
  );

  watch(
    () => props.value,
    (e) => {
      if (e && e.join('---') !== data.value.join('---')) {
        e.forEach((i, index) => {
          data.value[index] = i || '';
        });
      }
    },
    { deep: true }
  );
</script>

<style lang="less" scoped>
  .input-item {
    display: flex;

    .ant-row {
      width: 100%;
    }

    .delete-icon {
      margin: 5px;
      cursor: pointer;
      font-size: 16px;
      color: #bfbfbf;
    }
  }
</style>
