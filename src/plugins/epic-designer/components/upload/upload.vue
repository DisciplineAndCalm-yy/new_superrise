<template>
  <a-upload-dragger v-bind="getUploadProps">
    <p class="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p class="ant-upload-text">将文件拖到此处，或点击上传</p>
    <p class="ant-upload-hint">
      <span v-if="getAllowFileType !== '*'">支持上传{{ getAllowFileType }}类型文件，</span>
      <span v-if="getAllowFileSize">不超过 {{ getAllowFileSize }} M</span>
    </p>
  </a-upload-dragger>
</template>

<script setup lang="ts">
  import { watch, computed, inject, useAttrs, ref, Ref, nextTick } from 'vue';
  import { Upload, UploadChangeParam, UploadProps, message } from 'ant-design-vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import { getTemporaryPath } from '/@/api/common/api';
  import { downFile } from '/@/utils/file/download';
  import { getToken } from '/@/utils/auth';
  import { NodeItem } from '../../types/components';
  const props = defineProps({
    modelValue: {
      type: Array as PropType<UploadProps['fileList'] | { storageId: string; path: string }[]>,
      default: () => [],
    },
    record: {
      type: Object as PropType<NodeItem>,
      require: true,
      default: () => ({}),
    },
  });
  const emit = defineEmits(['update:modelValue']);
  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const fileList = ref<UploadProps['fileList']>([]);

  const forms = inject('forms', {}) as Ref<{ [name: string]: any }>;

  watch(fileList, (e) => {
    const successList = e
      ?.filter((i) => i.status === 'success')
      .map((i) => {
        const { name, uid } = i;
        return {
          storageId: uid,
          storageName: name,
        };
      });
    emit('update:modelValue', successList || []);

    // 上传完成自动校验 form-item
    if (forms.value.default) {
      setTimeout(() => {
        forms.value.default.validateFields([props.record.field]);
      }, 200);
    }
  });
  // 处理传递进来的值
  watch(
    () => props.modelValue,
    (e) => {
      if (e != null && e.length > 0) {
        e.forEach((file) => {
          if (fileList.value?.filter((i) => i.uid === (file.uid || file.storageId)).length === 0) {
            if ('storageId' in file) {
              fileList.value?.push({
                status: 'success',
                uid: file.storageId,
                name: file.storageName,
                url: file.storageName,
              });
            } else {
              fileList.value?.push(file);
            }
          }
        });
      }
    },
    { deep: true, immediate: true }
  );

  function handleUpdate(e: UploadProps['fileList']): void {
    nextTick(() => {
      fileList.value = e;
    });
  }

  // 处理数据结果
  const handleChange = (info: UploadChangeParam): void => {
    if (info.file.status === 'uploading') {
      return;
    }

    if (info.file.status === 'done') {
      const response = info.file.response;
      if (response.code === 200) {
        info.file.status = 'success';
        info.file.uid = response.result.storageId;
        info.file.url = `${import.meta.env.VITE_IMAGEPREVIEW_PREFIX}${response.result.tempPath}`;
      }
    }

    if (info.file.status === 'error') {
      message.error('upload error');
    }
  };

  const getAllowFileSize = computed(() => attrs.maxSize || '');

  // 上传前处理
  const beforeUpload = (file: any) => {
    if (getAllowFileType.value !== '*') {
      const fileExtension = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);

      if (!getAllowFileType.value.includes(fileExtension)) {
        message.error(`只支持上传${getAllowFileType.value}`);
        return false || Upload.LIST_IGNORE;
      }
    }

    if (attrs.maxSize) {
      const isLt2M = file.size / 1024 / 1024 < (attrs.maxSize as number);
      if (!isLt2M) {
        message.error(`文件大小超过 ${attrs.maxSize}MB!`);
        file.status = 'error';
      }
      return isLt2M || Upload.LIST_IGNORE;
    }
    // return isJpgOrPng && isLt2M;
  };

  // 预览回调
  const handlePreview = async (file) => {
    const url = (await getTemporaryPath({ storageId: file.uid })) as string;
    downFile(`${import.meta.env.VITE_IMAGEPREVIEW_PREFIX}${url}`, file.name);
  };

  const getAllowFileType = computed(() => (attrs.uploadRange.length ? attrs.uploadRange.join(',') : '*'));

  const getUploadProps = computed<UploadProps>(() => {
    const props = {
      'onUpdate:file-list': handleUpdate,
      'file-list': fileList.value,
      'before-upload': beforeUpload,
      onChange: handleChange,
      onPreview: handlePreview,
      accept: getAllowFileType.value,
    };

    const attribute = {
      headers: {},
      ...attrs,
    };

    attribute.headers['X-Access-Token'] = getToken();

    return {
      ...attribute,
      ...props,
    };
  });
</script>

<style scoped lang="less"></style>
