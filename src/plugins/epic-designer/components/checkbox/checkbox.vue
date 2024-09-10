<template>
  <CheckboxGroup v-bind="getProps">
    <div v-for="(item, index) in getOptions" :key="index" :style="{ display: getLayout === 'vertical' ? 'block' : 'inline-block' }">
      <Checkbox :value="item.value" :disabled="getDisabledStatus">
        {{ item.label }}
      </Checkbox>
    </div>
  </CheckboxGroup>
</template>

<script lang="ts">
  import { defineComponent, watch, computed, inject } from 'vue';
  import { PageManager } from '@coderlt/form-designer';
  import { CheckboxGroup, Checkbox } from 'ant-design-vue';
  import { NodeItem } from '../../types/components';

  export default defineComponent({
    components: {
      CheckboxGroup,
      Checkbox,
    },
    inheritAttrs: false,
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      record: {
        type: Object as PropType<NodeItem>,
        require: true,
        default: () => ({}),
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      function handleUpdate(e = null): void {
        emit('update:value', e);
      }

      // 接收页面管理对象
      const pageManager = inject('pageManager', {}) as PageManager;

      // 监听组件实例是否初始化
      watch(
        () => props.value,
        () => {
          if (props.record.on && props.record.on.length && 'change' in props.record.on) {
            setTimeout(() => {
              pageManager.doActions(props.record.on.change);
            }, 500);
          }
        }
      );

      const onEvent: { [type: string]: Function } = {};

      const getOptions = computed(() => {
        return props.record.componentProps && props.record.componentProps.options;
      });
      const getLayout = computed(() => {
        return props.record.componentProps && props.record.componentProps.style;
      });
      const getDisabledStatus = computed(() => (attrs.disabled || false) as boolean);

      const getProps = computed(() => {
        const { ...params } = props.record.componentProps;
        delete params.options;

        return {
          ...params,
          value: props.value,
          'onUpdate:value': handleUpdate,
          ...onEvent,
        };
      });

      return {
        getOptions,
        getLayout,
        getProps,
        getDisabledStatus,
      };
    },
  });
</script>
