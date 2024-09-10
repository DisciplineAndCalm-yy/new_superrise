<template>
  <BasicModal @register="registerModal" v-bind="$attrs" title="企业列表" width="60%" :useWrapper="false"
    :canFullscreen="false"  @ok="handleSubmit">
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref  } from 'vue';


// 声明Emits
const emit = defineEmits(['success', 'register']);

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  setModalProps({ confirmLoading: false });
});

//弹框确认
async function handleSubmit() {
  try {
    setModalProps({ confirmLoading: true });
    
    // emit('success', ids);
    closeModal();
    //刷新列表
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>

<style lang="less" scoped>

</style>