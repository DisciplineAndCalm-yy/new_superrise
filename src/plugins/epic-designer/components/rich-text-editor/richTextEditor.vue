<template>
  <Tinymce v-bind="bindProps" @change="handleUpdate" />
</template>

<script lang="ts" setup name="RichTextEditor">
  import { computed, inject, Ref, useAttrs } from 'vue';

  import { Tinymce } from '/@/components/Tinymce';
  import { capitalizeFirstLetter } from '@coderlt/form-designer';

  const props = defineProps({
    record: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  });
  const emit = defineEmits(['update:value']);

  const attrs = useAttrs();

  const forms = inject('forms', {}) as Ref<{ [name: string]: any }>;

  const onEvent: { [type: string]: Function } = {};

  props.record.on &&
    Object.keys(props.record.on).forEach((item) => {
      item !== 'change' && (onEvent[`on${capitalizeFirstLetter(item)}`] = (...args) => pageManager.doActions(props.record.on[item], ...args));
    });

  const handleUpdate = (value) => {
    if (forms.value.default) {
      setTimeout(() => {
        forms.value.default.validateFields([props.record.field]);
      }, 200);
    }
    emit('update:value', value);
  };

  const bindProps = computed(() => {
    return {
      ...props.record.componentProps,
      'onUpdate:value': handleUpdate,
      options: {
        readonly: attrs.disabled,
      },
      ...onEvent,
    };
  });

  //   export default defineComponent({
  //     name: 'RichTextEditor',
  //     components: { Tinymce },
  //     inheritAttrs: false,
  //     props: {
  //       value: propTypes.string.def(''),
  //       disabled: propTypes.bool.def(false),
  //     },
  //     emits: ['change', 'update:value'],
  //     setup(props, { emit, attrs }) {
  //       // 合并 props 和 attrs
  //       const bindProps = computed(() => Object.assign({}, props.record.componentProps));
  //
  //       // value change 事件
  //       function onChange(value) {
  //         emit('change', value);
  //         emit('update:value', value);
  //       }
  //
  //       return {
  //         bindProps,
  //         onChange,
  //       };
  //     },
  //   });
</script>

<style lang="less" scoped></style>
