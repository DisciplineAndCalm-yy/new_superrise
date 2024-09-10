<template>
  <RadioGroup v-bind="getProps">
    <Radio
      :style="{ display: getLayout === 'vertical' ? 'block' : 'inline-block' }"
      :value="item.value"
      v-for="(item, index) in getOptions"
      :disabled="item.disabled"
      :key="index"
    >
      {{ item.label }}
    </Radio>
  </RadioGroup>
</template>

<script lang="ts">
  import { defineComponent, watch, computed, inject } from 'vue';
  import { PageManager } from '@coderlt/form-designer';
  import { Radio, RadioGroup } from 'ant-design-vue';
  import { NodeItem } from '../../types/components';

  export default defineComponent({
    components: {
      RadioGroup,
      Radio,
    },
    inheritAttrs: false,
    props: {
      value: {
        type: String,
        default: () => '',
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
      // 表单formData数据
      let formData = inject('formData', {});

      // 监听组件实例是否初始化
      watch(
        () => formData[props.record.field ?? ''],
        () => {
          if (props.record.on && props.record.on.length && 'change' in props.record.on) {
            setTimeout(() => {
              pageManager.doActions(props.record.on.change);
            }, 500);
          }
        }
      );

      const onEvent: { [type: string]: Function } = {};

      // props.record.on &&
      //   props.record.on.length &&
      //   Object.keys(props.record.on).forEach((item) => {
      //     item !== 'change' && (onEvent[`on${capitalizeFirstLetter(item)}`] = (...args) => pageManager.doActions(props.record.on[item], ...args));
      //   });

      const getOptions = computed(() => {
        return props.record.componentProps && props.record.componentProps.options;
      });
      const getLayout = computed(() => {
        return props.record.componentProps && props.record.componentProps.style;
      });

      const getProps = computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const { options, ...params } = props.record.componentProps;

        return {
          ...params,
          value: props.value,
          'onUpdate:value': handleUpdate,
          disabled: attrs.disabled,
          ...onEvent,
        };
      });

      return {
        getOptions,
        getLayout,
        getProps,
      };
    },
  });
</script>
