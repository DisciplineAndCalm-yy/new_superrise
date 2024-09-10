<template>
  <!-- supId: {{ supId }}
  templateId: {{ templateId }} -->
  <!-- has_city_fgw_Role: {{props.has_city_fgw_Role }}- {{ has_city_fgw_Role == 'true' }} -->
  <div class="card_branch">
    <span class="card_title">操作记录</span>
    <div v-auth="'approveFlow:export'" class="export_btn" @click="download()">导出</div>
    <!-- <a-button class="export_btn" type="primary">导出</a-button> -->
  </div>
  <div>
    <a-steps progress-dot :current="props.caseRecordVos.length" direction="vertical" style="width: 100%; overflow-y: scroll; max-height: 400px">
      <a-step style="padding-bottom: 20px" :key="index1" v-for="(item, index1) in caseRecordVos">
        <template #title>
          <div style="overflow: hidden; width: 100%">
            <span class="label">操 作：</span>
            <span class="labelContent">{{ item.operationType }}</span>
          </div>
          <!-- 回复特殊处理 -->
          <!-- <div
            style="overflow: hidden; width: 100%"
            v-if="item.operationCode == '3' && item.supReplyDynamicVoList && item.supReplyDynamicVoList.length > 0"
          >
            <a-table class="superviseTable" :dataSource="item.supReplyDynamicVoList" :columns="columns" :bordered="true" :pagination="false">
              <template #bodyCell="{ text, record, index, column }">
                <template v-if="record.fieldType == 'upload' && column.dataIndex == 'value'">
                  <a style="display: block; margin: 4px 0" v-for="elem in record.value" @click="handlePreview(elem)" :key="elem.storageId">{{
                    elem.storageName
                  }}</a>
                </template>
                <template v-if="record.fieldType == 'richTextEditor' && column.dataIndex == 'value'">
                  <JEditor :value="record.value" :disabled="true"></JEditor>
                </template>
              </template>
            </a-table>
          </div> -->
          <div
            style="overflow: hidden; width: 100%"
            v-if="item.operationCode == '3' && item.supReplyDynamicVoList && item.supReplyDynamicVoList.length > 0"
          >
            <div v-for="(els, idx) in item.supReplyDynamicVoList" :key="idx">
              <span class="label">{{ els.text }}：</span>
              <div v-if="els.fieldType == 'upload'" class="labelContent">
                <a style="display: block" v-for="elem in els.value" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
              </div>
              <div v-else-if="els.fieldType == 'richTextEditor'" class="labelContent">
                <JEditor :value="els.value" :disabled="true" />
              </div>
              <span v-else-if="els.fieldType == 'slider'" class="labelContent">{{ els.value }} %</span>
              <span v-else class="labelContent">{{ els.value }}</span>
            </div>
          </div>
          <!-- <div v-if="item.operationType == '填报'" style="width: 100%">
            <div style="overflow: hidden; width: 100%">
              <span class="label">填报月份：</span>
              <span class="labelContent">{{ item.replyMonth }}</span>
            </div>
          </div>
          <div v-if="item.operationType == '批示'" style="width: 100%">
            <div style="overflow: hidden; width: 100%">
              <span class="label">批示内容：</span>
              <span class="labelContent">{{ item.replyContent }}</span>
            </div>
          </div>
          <div v-if="item.operationType == '填报'" style="width: 100%">
            <div style="overflow: hidden; width: 100%">
              <span class="label">进展情况：</span>
              <span class="labelContent">{{ item.replyContent }}</span>
            </div>
          </div>
          <div v-if="item.operationType == '填报'" style="width: 100%">
            <div style="overflow: hidden; width: 100%">
              <span class="label">下步措施：</span>
              <span class="labelContent">{{ item.nextStep }}</span>
            </div>
          </div>
          <div v-if="item.operationType == '填报'" style="width: 100%">
            <div style="overflow: hidden; width: 100%">
              <span class="label">存在问题：</span>
              <span class="labelContent">{{ item.problem }}</span>
            </div>
          </div> -->
          <div v-if="item.rejectReason != null && item.rejectReason != ''" style="width: 100%">
            <div style="overflow: hidden; width: 100%">
              <span class="label">原 因：</span>
              <span class="labelContent">{{ item.rejectReason }}</span>
            </div>
          </div>
          <div style="overflow: hidden; width: 100%" v-if="item.caseOption == '驳回'">
            <span class="label">详 情：</span>
            <a class="labelContent" @click="exportXls(item.id)">查看内容</a>
          </div>
          <div style="overflow: hidden; width: 100%">
            <span class="label">操作人：</span>
            <span class="labelContent">{{ item.operationOrgCode }}</span>
          </div>
          <div style="overflow: hidden; width: 100%">
            <span class="label">时 间：</span>
            <span class="labelContent">{{ item.operationTime }}</span>
          </div>
          <!-- <div style="overflow: hidden; width: 100%">
            <span class="label">备 注：</span>
            <span class="labelContent">{{ item.remarks }}</span>
          </div> -->
          <div v-if="item.attachments" style="overflow: hidden; width: 100%; margin-bottom: 30px">
            <span class="label">附 件：</span>
            <div class="labelContent">
              <a style="display: block" v-for="elem in item.attachments" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
            </div>
          </div>
        </template>
      </a-step>
    </a-steps>
  </div>
</template>
<script lang="ts" setup>
  import { getTemporaryPath } from '/@/api/common/api';
  import { operationReportExport } from '/@/api/supervise/index';
  import { exportMethod, downFile } from '/@/utils/file/download';
  import JEditor from '/@/components/Form/src/jeecg/components/JEditor.vue';
  import { BasicColumn } from '/@/components/Table';
  // let caseRecordVos = <any>([]);
  // 声明props
  const props = defineProps({
    caseRecordVos: {
      type: Array,
      default: [],
    },
    supId: {
      type: String,
      default: '',
    },
    templateId: {
      type: String,
      default: '',
    },
    has_city_fgw_Role: {
      type: Boolean,
      default: false,
    },
  });

  const columns: BasicColumn[] = [
    {
      title: '内容',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '70%',
    },
  ];

  const handlePreview = async (val) => {
    const url = await getTemporaryPath({ storageId: val.storageId });
    downFile(url, val.storageName);
    // window.open(url);
  };

  //导出
  const download = () => {
    exportMethod(operationReportExport, `操作记录.xlsx`, { templateId: props.templateId, supId: props.supId });
  };
</script>

<style scoped>
  .card_branch {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card_title {
    color: #333;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .export_btn {
    width: 100px;
    height: 32px;
    line-height: 32px;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    background: #4877f3;
    text-align: center;
    cursor: pointer;
  }
  .label {
    font-weight: bolder;
    float: left;
    width: 90px;
    text-align: justify;
    text-align-last: justify;
  }
  .labelContent {
    float: right;
    text-align: left;
    width: calc(100% - 90px);
  }
</style>
