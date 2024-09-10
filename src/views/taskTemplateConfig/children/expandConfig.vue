<template>
  <div class="expand-config">
    <div class="btn-list">
      <div class="btn" v-for="item in expandConfigList" :key="item.id">
        <div class="btn-header">
          <template v-if="item.isEdit">
            <Input v-model:value="item.rename" size="small" :placeholder="item.rename || item.name.slice(0, -2)" />
            <SaveOutlined class="icon" @click="item.isEdit = !item.isEdit" />
          </template>
          <template v-else>
            {{ item.rename || item.name.slice(0, -2) }}
            <EditOutlined class="icon" @click="item.isEdit = !item.isEdit" />
          </template>
        </div>
        <div class="btn-content" v-if="item.perms.includes('reply')">
          <div class="reply-rate" @click="() => openModal(true, { id: item.id, replyRate: item.replyRate })">
            回复频率: {{ typeof item.replyRate == 'object' && getLabelByCode(item.replyRate?.replyFrequency) }}
          </div>
          <div class="schema-config" @click="() => openExpandTemplateModal(true, { id: item.id, schemas: item.schemas })">点击配置弹窗字段</div>
        </div>
        <div class="btn-content cooperate" v-if="item.perms.includes('addCooperateDepart')">
          <div class="schema-config" @click="() => openCooperateTemplateModal(true, { id: item.id, schemas: item.schemas })">点击配置弹窗字段</div>
        </div>
      </div>
    </div>
    <div class="step-config">
      <a-button @click="onCancelChange">取消</a-button>
      <a-button @click="onPrevStepChange">上一步</a-button>
      <a-button @click="handleChecked" type="primary">完成</a-button>
    </div>
    <ReplyRateModal :sup-reply-frequency-list="supReplyFrequencyList" @register="register" @reply-change="onReplyChange" />
    <ExpandTemplateConfigModal @register="expandTemplateRegister" @expand-template-change="onExpandTemplateChange" />
    <CooperateTemplateConfigModal @register="cooperateTemplateRegister" @expand-template-change="onExpandTemplateChange" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { Input } from 'ant-design-vue';
  import { EditOutlined, SaveOutlined } from '@ant-design/icons-vue';
  import { deepClone } from '@coderlt/form-designer';
  import { DictType } from '/#/config';
  import { getInitTemplateButton, getSupReplyFrequency, getTemplateButtonView } from '/@/api/taskTemplateConfig';
  import { useModal } from '/@/components/Modal';
  import ReplyRateModal from './replyRateModal.vue';
  import ExpandTemplateConfigModal from './expandTemplateConfigModal.vue';
  import CooperateTemplateConfigModal from './cooperateTemplateConfigModal.vue';
  import { BaseInfo, ExpandConfig, ReplyRateData } from '../index.data';
  import { customCooperateSchema, customExpandSchema, customReplyRate } from '../designerConfig';

  const props = withDefaults(defineProps<{ isShow: boolean; templateData: BaseInfo }>(), {
    isShow: false,
    templateData: () => ({
      citeType: '',
      oldCiteType: '',
      templateName: '',
      templateId: '',
    }),
  });

  const emit = defineEmits<{
    (event: 'cancel'): void;
    (event: 'updateOldCityType'): void;
    (event: 'nextStepChange', data: { step: number; data: Object }): void;
    (event: 'prevStepChange'): void;
  }>();

  const expandConfigList = ref<ExpandConfig[]>([]);
  const getDefaultExpandConfig = () => {
    const params = {
      citeType: props.templateData.citeType,
    };
    getInitTemplateButton(params).then((res) => {
      expandConfigList.value = res.map((i) => {
        i.isEdit = false;
        if (i.perms.includes('reply')) {
          !i.schemas && (i.schemas = deepClone(customExpandSchema));
          !i.replyRate && (i.replyRate = deepClone(customReplyRate));
        }
        if (i.perms.includes('addCooperateDepart') && !i.schemas) {
          !i.schemas && (i.schemas = deepClone(customCooperateSchema));
        }
        return i;
      });
    });
  };
  const getExpandConfig = () => {
    const params = {
      templateId: props.templateData.templateId,
    };
    getTemplateButtonView(params).then((res) => {
      expandConfigList.value = res.map((i) => {
        const { schemas, replyRate } = i;
        i.isEdit = false;
        if (i.perms.includes('reply')) {
          i.schemas = JSON.parse(schemas);
          i.replyRate = JSON.parse(replyRate);
        }
        if (i.perms.includes('addCooperateDepart')) {
          i.schemas = JSON.parse(schemas);
        }
        return i;
      });

      console.log('报错拓展详情接口-', expandConfigList.value);
      if (expandConfigList.value.length === 0) {
        getDefaultExpandConfig();
      }
    });
  };

  const supReplyFrequencyList = ref<DictType[]>([]);
  const getSupReplyFrequencyList = () => {
    getSupReplyFrequency().then((res) => {
      supReplyFrequencyList.value = res;
    });
  };
  const getLabelByCode = (code) => {
    if (!code) {
      return '';
    }

    const detail = supReplyFrequencyList.value.find((i) => i.dictCode === code);
    if (detail) {
      return detail.dictName;
    }

    return '';
  };

  watchEffect(() => {
    if (props.isShow) {
      if (props.templateData.oldCiteType != props.templateData.citeType) {
        getDefaultExpandConfig();
      } else {
        getExpandConfig();
      }

      getSupReplyFrequencyList();
      emit('updateOldCityType');
    }
  });

  const onCancelChange = () => {
    emit('cancel');
  };
  const onPrevStepChange = () => {
    emit('prevStepChange');
  };
  const handleChecked = () => {
    console.log('报错拓展配置写-', expandConfigList.value);

    emit('nextStepChange', {
      step: 3,
      data: JSON.stringify(expandConfigList.value),
    });
  };

  // 回复频率弹窗
  const [register, { openModal }] = useModal();
  const [expandTemplateRegister, { openModal: openExpandTemplateModal }] = useModal();
  const [cooperateTemplateRegister, { openModal: openCooperateTemplateModal }] = useModal();

  const onReplyChange = ({ id, replyRate }: { id: string; replyRate: ReplyRateData }) => {
    const detail = expandConfigList.value.find((i) => i.id === id);
    if (detail) {
      detail.replyRate = replyRate;
    }
  };

  const onExpandTemplateChange = ({ id, schemas }: { id: string; schemas: any }) => {
    const detail = expandConfigList.value.find((i) => i.id === id);
    if (detail) {
      detail.schemas = schemas;
    }
  };
</script>

<style lang="less" scoped>
  .expand-config {
    width: 100%;
    height: 613px;
    display: flex;
    flex-direction: column;

    .btn-list {
      flex: 1;
      padding: 10px 10%;
      overflow-y: auto;
      box-sizing: content-box;

      .btn {
        margin-bottom: 10px;
        border-radius: 5px 5px 0 0;
        border: 1px solid #1890ff;
        overflow: hidden;
        .btn-header {
          display: flex;
          align-items: center;
          padding: 10px 8px;
          background: #1890ff;
          text-align: left;
          height: 40px;
          color: #fff;

          .ant-input {
            width: 300px;
          }

          .icon {
            margin-left: 10px;
            font-size: 20px;
            cursor: pointer;
          }
        }
        .btn-content {
          display: flex;
          padding: 10px 20px;
          color: #58a0d8;
          justify-content: space-between;

          > div {
            cursor: pointer;
          }
        }
        .cooperate {
          justify-content: flex-end;
        }
      }
    }

    .step-config {
      padding: 10px 0;
      text-align: center;
      height: 50px;
      border-top: 1px solid #eaeaea;
      .ant-btn + .ant-btn {
        margin-left: 10px;
      }
    }
  }
</style>
