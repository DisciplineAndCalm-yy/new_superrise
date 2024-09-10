<template>
  <div class="container-padding new-collection-detail">
    <!-- <div class="back" @click="handleBack">
      <left-outlined />
      <span>返回</span>
    </div> -->
    <!-- <collectInfo :pid="pid" :collectInfoConfig="collectInfoConfig" @update-project-info="updateProjectInfo" />
    <collectProgress :pid="pid" v-if="!isDraft" /> -->
    <!-- <indicator-system></indicator-system> -->
    <a-card v-if="btnList.length > 0" class="base-info btncard" size="small">
      <!-- <a-button v-for="(btnEl) in btnList" v-auth="btnEl.operateCode == '3_1' /? 'approveFlow:approval' : ''" :class="['standard_btn', btnColorMap[btnEl.operateCode], btnEl.use ? '' : 'noUse']" @click="handleClick(btnEl.operateCode)" :disabled="!btnEl.use">{{ btnEl.operateCodeDesc }}</a-button> -->
      <div v-for="(btnEl, index) in btnList" style="display: inline-block;" >
        <a-button v-if="hasPermission(btnEl.perms) && ((roleCode != 'QT') || (roleCode == 'QT' && stage == btnEl.stage))" :class="['standard_btn', btnColorMap[index%8]]" @click="handleClick(btnEl)">{{ btnEl.rename }}</a-button>
      </div>
    </a-card>
    <!-- <a-card v-if="!has_city_fgw_Role" class="base-info mt10" size="small">
      <div class="redfont">*填报后需点击提交按钮上报至上级部门，提交后不可更改，请谨慎操作（如需更改，请联系上级部门退回）。</div>
    </a-card> -->
    <a-card class="base-info mt10" size="small">
      <div class="tags_info">
        <div class="tags_info">
          <div>挂牌：</div>
          <div v-if="modifiedSupervise.hangTagTypeDesc !== null" class="tag_box tag_blue">{{ modifiedSupervise.hangTagTypeDesc }}</div>
        </div>
        <div class="tags_info">
          <div>是否超期：</div>
          <div v-if="modifiedSupervise.overdueDesc === null || modifiedSupervise.overdueDesc === '未超期'" class="tag_box tag_blue">{{ modifiedSupervise.overdueDesc }}</div>
          <div v-else class="tag_box tag_red">{{ modifiedSupervise.overdueDesc }}</div>
        </div>
        <div class="tags_info">
          <div>催办次数：</div>
          <div class="tag_box tag_red">{{ modifiedSupervise.urgeNumber }}次</div>
        </div>
      </div>
      <div class="supervise_info">
        <!-- <a-row>
          <a-col v-for="(item, index) in detailArr" :key="index" :span="item.text === '任务内容' ? 24 : 8">
            <div v-if="item.text === '附件'">
              <div class="info_label">{{ item.text }}：</div>
              <div style="display: inline-block">
                <div style="display: flex; flex-direction: column;">
                  <a style="height: 20px;" v-for="elem in item.value" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
                </div>
              </div>
            </div>
            <div v-else>
              <span class="info_label">{{ item.text }}：</span>
              <span class="info_content">{{ item.value }}</span>
            </div>
          </a-col>
        </a-row> -->
        <a-table class="superviseTable" :dataSource="detailArr" :columns="columns" :bordered="true" :pagination="false">
          <template #bodyCell="{text, record, index, column}">
            <template v-if="hasFiles && record.fieldType == 'upload' && column.dataIndex == 'value'">
              <a style="display: block; margin: 4px 0;" v-for="elem in record.value" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
            </template>
            <template v-if="record.fieldType == 'richTextEditor' && column.dataIndex == 'value'">
              <JEditor :value="record.value" :disabled="true"></JEditor>
            </template>
          </template>
        </a-table>
        <!-- <BasicTable @register="registerTable" ></BasicTable> -->
      </div>
    </a-card>
    <a-card class="base-info mt10" size="small">
      <div class="card_title">当前进度</div>
      <div class="card_stepbox">
        <a-steps :current="supProgressActive">
          <!-- <a-step>
            <template #title>Finished</template>
            <template #description>
              <span>This is a description.</span>
            </template>
          </a-step>
          <a-step title="In Progress" sub-title="Left 00:00:08" description="This is a description." />
          <a-step title="Waiting" description="This is a description." /> -->
          <a-step v-for="elem in supProgress" :title="elem.supStatusDesc" />
        </a-steps>
      </div>
    </a-card>
    <a-card class="base-info mt10" size="small" v-if="caseRecordVos.length>0">
      <approveFlow :caseRecordVos="caseRecordVos" :supId="supId" :templateId="templateId" :has_city_fgw_Role="has_city_fgw_Role"/>
    </a-card>
  </div>

  <a-modal v-model:visible="visible" :title="modelTitle" :width="modalWidth" :header="null" :closable="false">
    <div class="modal_body">
      <a-row v-if="modelStatus === '3'">
        <a-col :span="8">
          <span class="info_label"><span class="red_point">*</span>挂牌：</span>
        </a-col>
        <a-col :span="16">
          <a-radio-group v-model:value="listing">
            <a-radio v-for="dict in hangTagTypeList" :value="dict.dictCode">{{ dict.dictName }}</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '5'">
        <a-col :span="8">
          <span class="info_label"><span class="red_point">*</span>{{has_city_fgw_Role ? '变更完成时限' : '延期'}}：</span>
        </a-col>
        <a-col :span="16">
          <!-- <a-date-picker :disabled-date="disabledDate" v-model:value="delay" /> -->
          <a-date-picker placeholder="请选择时间" :disabled-date="disabledDate" v-model:value="delay" />
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '8'">
        <a-col :span="24">
          <a-radio-group v-model:value="checkStatus">
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="0">驳回</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="24" v-if="checkStatus == 0">
          <a-textarea :rows="6" v-model:value="checkReply" placeholder="最多300个字符" :maxlength="300" />
        </a-col>
      </a-row>
      <a-row v-if="false">
        <!-- <a-col v-if="!has_city_fgw_Role" :span="24">
          <div class="redfont">*每个月只能填报一次数据，填报后不可修改，请谨慎操作。</div>
        </a-col> -->

        <!-- <a-col v-if="!has_city_fgw_Role" :span="24">
          完成进度：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="20">
          <a-slider v-model:value="finshProgress" />
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="4">
          <span style="margin-left: 10px;">{{ finshProgress }}%</span>
        </a-col> -->
        <a-col v-if="!has_city_fgw_Role" :span="24">
          {{has_city_fgw_Role ? '回复月度' : '填报月份'}}：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          <!-- <a-month-picker placeholder="请选择填报时间" :disabled-date="disabledMonth" v-model:value="replyMonth" /> -->
          <div>{{ replyMonth || '' }}</div>
        </a-col>
        <a-col :span="24">
          {{has_city_fgw_Role ? '批示内容' : '进展情况'}}：
        </a-col>
        <a-col :span="24">
          <a-textarea :rows="6" v-model:value="reply" placeholder="最多2000个字符" :maxlength="2000" :autosize="{ minRows: 2, maxRows: 3 }" />
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          存在问题：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          <a-textarea :rows="6" v-model:value="question" placeholder="最多2000个字符" :maxlength="2000" :autosize="{ minRows: 2, maxRows: 3 }" />
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          下步措施：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          <a-textarea :rows="6" v-model:value="measure" placeholder="最多2000个字符" :maxlength="2000" :autosize="{ minRows: 2, maxRows: 3 }" />
        </a-col>
        <a-col :span="24">
          附件上传（仅支持doc、docx、xls、xlsx、pdf、jpg、jpeg、png、rar、zip文件格式，最大为50M）：
        </a-col>
        <a-col :span="24">
          <!-- <a-upload v-model:file-list="selectFileList" :showUploadList="false" :before-upload="beforeUpload">
            <span class="inner-button"><upload-outlined />上传附件</span>
          </a-upload> -->
          
          <JUpload ref="uploadRef" :value="fileValue" @change="changeValue" :maxSize="50" accept=".pdf, .doc, .docx, .xlsx, .xls, .jpg, .jpeg, .png, .rar, .zip" />
          <!-- <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImport">上传附件</j-upload-button> -->
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '6'">
        <a-col :span="24">
          <span class="info_label">当前任务完成时限</span>
        </a-col>
        <a-col :span="24">
          <div>{{requireEndTime || ''}}</div>
        </a-col>
        <a-col :span="24">
          <span class="info_label"><span class="red_point">*</span>申请延期时间：</span>
        </a-col>
        <a-col :span="24">
          <a-date-picker placeholder="请选择申请延期时间" :disabled-date="disabledDate" v-model:value="delay" />
          <!-- <a-date-picker :disabled-date="disabledDate" v-model:value="delay" /> -->
        </a-col>
        <a-col :span="24">
          <span class="info_label"><span class="red_point">*</span>申请延期理由：</span>
        </a-col>
        <a-col :span="24">
          <a-textarea :rows="6" v-model:value="delayReason" placeholder="最多300个字符" :maxlength="300" />
        </a-col>
        <a-col :span="24">
          申请延期附件（仅支持doc、docx、xls、xlsx、pdf、jpg、jpeg、png、rar、zip文件格式，最大为50M）：
        </a-col>
        <a-col :span="24">
          <JUpload ref="uploadRef2" :value="fileValue" @change="changeValue" :maxSize="50" accept=".pdf, .doc, .docx, .xlsx, .xls, .jpg, .jpeg, .png, .rar, .zip"/>
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '7'">
        <a-col v-if="showRecord" :span="24">
          <span class="info_label">当前任务完成时限</span>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <div>{{recordObj.requireEndTime || ''}}</div>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <span class="info_label">申请延期时间：</span>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <div>{{recordObj.postponeTime || ''}}</div>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <span class="info_label">申请延期理由：</span>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <div class="info_reason">{{recordObj.postponeReason || ''}}</div>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <span class="info_label">申请延期附件：</span>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <div style="overflow: hidden; width: 100%; margin-bottom: 30px">
            <div class="labelContent">
              <a style="display: block" v-for="elem in recordObj.attachments" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
            </div>
          </div>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <span class="info_label"><span class="red_point">*</span>批示结果：</span>
        </a-col>
        <a-col v-if="showRecord" :span="24">
          <a-radio-group v-model:value="checkStatus">
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="0">驳回</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="24" v-if="checkStatus == 0 && showRecord">
          <a-textarea :rows="6" v-model:value="checkReply" placeholder="最多300个字符" :maxlength="300" />
        </a-col>
        <a-col v-if="!showRecord" style="margin: 20px 0px;" :span="24">
          <a-empty v-if="!showRecord" />
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '13'">
        <a-col v-if="!has_city_fgw_Role" :span="24">
          {{has_city_fgw_Role ? '回复月度' : '填报月份'}}：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          <!-- <a-month-picker placeholder="请选择填报时间" :disabled-date="disabledMonth" v-model:value="replyMonth" :disabled="true" /> -->
          <div>{{ replyMonth || '' }}</div>
        </a-col>
        <a-col :span="24">
          {{has_city_fgw_Role ? '批示内容' : '进展情况'}}：
        </a-col>
        <a-col :span="24">
          <a-textarea :rows="6" v-model:value="reply" placeholder="" :maxlength="2000" :autosize="{ minRows: 2, maxRows: 3 }" :disabled="!isThreeAdmin" />
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          存在问题：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          <a-textarea :rows="6" v-model:value="question" placeholder="" :maxlength="2000" :autosize="{ minRows: 2, maxRows: 3 }" :disabled="!isThreeAdmin" />
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          下步措施：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="24">
          <a-textarea :rows="6" v-model:value="measure" placeholder="" :maxlength="2000" :autosize="{ minRows: 2, maxRows: 3 }" :disabled="!isThreeAdmin" />
        </a-col>
        <a-col :span="24">
          附件上传（仅支持doc、docx、xls、xlsx、pdf、jpg、jpeg、png、rar、zip文件格式，最大为50M）：
        </a-col>
        <a-col v-if="isThreeAdmin" :span="24">
          <JUpload ref="uploadRef" :value="fileValue" @change="changeValue" :maxSize="50" accept=".pdf, .doc, .docx, .xlsx, .xls, .jpg, .jpeg, .png, .rar, .zip" />
        </a-col>
        <a-col :span="24">
          <a style="display: block" v-for="elem in attachments" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
        </a-col>
      </a-row>
    </div>
    <template style="display: flex;" #footer>
      <a-button v-if="modelStatus === '6'" style="float: left;" type="primary" @click="handleShowlog">查看延期记录</a-button>
      <a-button v-if="modelStatus === '7'" style="float: left;" type="primary" @click="handleShowlog">查看延期批示记录</a-button>
      <a-button v-if="showRecord" key="submit" style="width: 120px;margin-right: 30px;" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="logVisible" :title="logModelTitle" :width="logModalWidth" :header="null" :closable="false">
    <a-table :dataSource="recordList" :columns="logColumns" :bordered="true" :pagination="false"></a-table>
    <template #footer>
      <a-button key="back" @click="handleRecordCancel">关闭</a-button>
    </template>
  </a-modal>

  <superviseDetailModal @register="register" @success="reload" @checkCallback="checkCallback" @callback="callback" @setModalHidden="setModalHidden" v-if="modalShow"> </superviseDetailModal>
</template>
<script lang="ts" setup name="newCollectionDetail">
  import moment, { Moment } from 'moment';
  import { ref, toRefs, onMounted, getCurrentInstance } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import approveFlow from './components/approveFlow.vue';
  import {
    superviseDetail,
    getSchemas,
    getHangTagType,
    acceptedBatch,
    supHangTag,
    supReply,
    supPostpone,
    applyForSupPostpone,
    postponeAudit,
    postponeAuditView,
    postponeRecord,
    urgeBatch,
    supSubmit,
    approvedBatch,
    sendBack,
    supFillSubmit,
    fillDetails,
    getRequireEndTime,
    queryRolesByCurUser,
    getSupRecord,
    addCooperation,
    getTemplateButtonRel,
    getAlreadyAddDepartIds
  } from '/@/api/supervise/index'
  // import collectProgress from './components/collectProgress.vue';
  // import indicatorSystem from './components/indicatorSystem.vue';
  // import indicatorBuild from '../indicatorTemplate/indicatorBuild.vue';
  import { CollectInfoConfig, IndicatorProjectDetail } from './index.data';
  import JUpload from '/@/components/Form/src/jeecg/components/JUpload/JUpload.vue';
  import JEditor from '/@/components/Form/src/jeecg/components/JEditor.vue';
  import { getTemporaryPath } from '/@/api/common/api';
  import { formatToDate } from '/@/utils/dateUtil';
  import { downFile } from '/@/utils/file/download';
  import dayjs from 'dayjs';

  import { BasicColumn, BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useUserStore } from '/@/store/modules/user';
  import { useModal } from '/@/components/Modal';
  import superviseDetailModal from './components/superviseDetailModal.vue';

  const [register, { openModal, closeModal, setModalProps }] = useModal();
  const userStore = useUserStore();
  const { hasPermission } = usePermission();

  const route = useRoute();
  const router = useRouter();
  let visible = ref(false);
  let loading = ref<boolean>(false);
  let modalWidth = ref<Number>(700);  //  模态框的宽度
  let modelTitle = <String>('');  //  模态框的标题
  const modalShow = ref(false);
  const modalFormData = ref<any>({});

  let logVisible = ref(false);
  let logModalWidth = ref<Number>(1400);  //  模态框的宽度
  let logModelTitle = <String>('');  //  模态框的标题
  
  let modelStatus = <String>(''); //  模态框的状态
  let modelBtnId = <String>(''); //  模态框当前状态按钮的id
  let listing = ref<String>('');  //  挂牌方式
  let delay = ref<String>('');  //  变更时限/延期时间
  let delayReason = ref<String>('');  //  延期理由
  let checkStatus = ref<Number>(1); //  审核选项
  let checkReply = ref<String>(''); //  驳回理由
  let reply = ref<String>('');  //  回复内容
  let question = ref<String>(''); //  问题描述
  let measure = ref<String>('');  //  下步措施
  let replyMonth = ref<any>();  //  回复月份
  let finshProgress = ref<Number>(0); //  进度条
  let hangTagTypeList = ref<any>([]); //  挂牌选项的列表
  let requireEndTime = ref<any>();  //  完成时限
  let createdTime = ref<any>(); //  创建时间
  let replyProgress = ref<any>(); //  回复进度
  let stage = ref<any>(); //  创建时间
  let hasFiles = ref(false);  //  是否有附件
  let fileValue = ref<any>([]);
  let detailArr = ref<any>([]);
  let supProgress = ref<any>([]);
  let attachments = ref<any>([]);
  let supProgressActive = ref<Number>(0); //  当前进度（督办进度条）
  let btnList = ref<any>([]); //  按钮列表
  let caseRecordVos = ref<any>([]); //  操作记录
  let departList = ref<any>([]); //  已存在部门ID集合
  let modifiedSupervise = ref<any>({}); //  页面头部内容（催办、警告）
  // let passIndex = ref<Number>(0);  //  进度安排第一个index
  // let passNums = ref<Number>(0);  //  进度安排数量
  let recordObj = ref<any>({}); //  延期回显内容
  let recordList = ref<any>([]);  //  延期记录
  let recordId = ref<any>();  //  延期记录ID
  let showRecord = ref(true);  //  延期记录是否展示
  let isThreeAdmin = ref(false);  //  延期记录是否展示

  // 操作类型(1发送, 2接收, 3填报,3_1填报批示 4送审（发起核定）, 5驳回, 6通过, 7催办, 8延期, 9挂牌, 10核定，11申请延期，12延期批示)
  const btnColorMap: { [key: string]: string } = {
    '0': 'green',
    '1': 'blue',
    '2': 'crimson',
    '3': 'orange',
    '4': 'yellow',
    '5': 'blue',
    '6': 'brown',
    '7': 'skyblue',
    '8': 'crimson',
  };
  
  //定义表格列字段
  const columns: BasicColumn[] = [
    {
      title: '内容',
      dataIndex: 'text',
      key: 'text',
      // width: 300,
      // customRender: ({ text, record, index }) => {
      //   console.log('table:::Render:--', text, record, index);
      //   if(record.dataIndex === 'scheduling') {
      //     return {
      //       children: text,
      //       props: {
      //         rowSpan: passNums.value
      //       }
      //     }
      //   }
      // },
      customCell: (_, index) => {
        // console.log('table:::', _, index)
        if(_.fieldType == "multipleTextarea" || _.fieldType == "multipleInput") {
          if(stepsRows.value[_.dataIndex]) {
            if(_.childIndex === 0) {
              if (_.label == '') {
                return { rowSpan: stepsRows.value[_.dataIndex], colSpan: 2 };
              } else {
                return { rowSpan: stepsRows.value[_.dataIndex] };
              };
            } else {
              if (_.label == '') {
                return { rowSpan: 0, colSpan: 2 };
              } else {
                return { rowSpan: 0 };
              };
            };
          } else {
            if(!_.label && _.label != '') {
              return { colSpan: 2 };
            };
          };
        } else {
          if(!_.label && _.label != '') {
            return { colSpan: 2 };
          };
        };
      }
    },
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      customCell: (_, index) => {
        // console.log('table222:::', _, index)
        if(_.fieldType == "multipleTextarea" || _.fieldType == "multipleInput") {
          if(_.label != undefined && _.label == '') {
            return { colSpan: 0 };
          } else if(_.label == undefined) {
            return { colSpan: 0 };
          }
        } else {
          if(!_.label && _.label != '') {
            return { colSpan: 0 };
          }
        }
      }
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '70%',
      customCell: (_, index) => {
        // console.log('table222:::', _, index)
        // if(!_.label) {
        //   return { colSpan: 2 };
        // }
      }
    },
  ];

  const logColumns: BasicColumn[] = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: '变更前完成时限',
      dataIndex: 'requireEndTime',
      key: 'requireEndTime'
    },
    {
      title: '变更后完成时限',
      dataIndex: 'postponeTime',
      key: 'postponeTime'
    },
    {
      title: '延期理由',
      dataIndex: 'postponeReason',
      key: 'postponeReason'
    },
    {
      title: '延期结果',
      dataIndex: 'postponeAuditDesc',
      key: 'postponeAuditDesc'
    },
    {
      title: '驳回原因',
      dataIndex: 'refusedReason',
      key: 'refusedReason'
    },
    {
      title: '申请时间',
      dataIndex: 'applyForTime',
      key: 'applyForTime'
    },
    {
      title: '批示人',
      dataIndex: 'approveUser',
      key: 'approveUser'
    },
    {
      title: '批示时间',
      dataIndex: 'approveTime',
      key: 'approveTime'
    },
    {
      title: '延期操作',
      dataIndex: 'postponeType',
      key: 'postponeType',
      customRender: ({ text, record, index }) => {
        // console.log('table:::Render:--', text, record, index);
        return record.postponeType == '0' ? '领导部门主动延期' : '业务部门申请延期'
      },
    },
  ];
  //需要分组展示的子表头映射对象
  const steps = ref({});

  const stepsRows = ref({});

  // // 定义 Supervise 类型
  // fieldType Supervise = {
  //   urgeNumber: number | null;
  //   hangTagTypeDesc: string | null;
  //   overdueDesc: string | null;
  // };

  // // 使用 ref 创建响应式变量
  // const supervise: Supervise = {
  //   urgeNumber: null,
  //   hangTagTypeDesc: null,
  //   overdueDesc: null,
  // };

  // const modifiedSupervise = toRefs(supervise);
  
  const supId = ref(route.query.supId as string);
  const templateId = ref(route.query.templateId as string);
  const roleCode = ref(route.query.roleCode as string);

  const has_city_fgw_Role = ref(roleCode.value == 'YSB' ? true : false);

  // 是否是草稿
  const isDraft = ref(true);

  // 格式化时间
  const formatTime = ({ date = new Date(), splitStr = '-', noDate = false, onlyMonth = false }) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    if(noDate) return `${[year, month, day].map(formatNumber).join(splitStr)}`;
    if(onlyMonth) return `${[year, month].map(formatNumber).join(splitStr)}`;
    return `${[year, month, day].map(formatNumber).join(splitStr)} ${[hour, minute, second].map(formatNumber).join(':')}`;
  }

  const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
  }
  /*
    所有按钮涉及操作均传按钮的 id ，后台能区分是哪个功能
    回复/批示（所有回复）type：0，全取schemas，不做特殊处理
    接收 type：1、催办 type：2，不涉及弹窗，纯点击
    挂牌 type: 3
    申请完成 type: 4
    延期/变更完成时限 type: 5
    申请延期 type: 6
    延期批示 type: 7
    核定 type: 8
  */


  const handleClick = ({ id, schemas, type }) => {
    if (type == 0 || type == 9) {
      if (schemas) {
        console.log('schemas--->', schemas)
        modalShow.value = true;
        modelBtnId = id;
        modelStatus = type;
        if (type == 9) getAlreadyAddDepartIdsApi(id);
        setTimeout(() => {
          openModal(true, { isUpdate: false, pageSchema: schemas, templateId: templateId.value,  checkObj: { departList: departList.value } });
        }, 200);
      }
    } else {
      handleClickStatus(type, id)
    }
  };

  // const checkCallback = (data) => {
  //   if (modelStatus == '9') {
  //     const result = hasAnySameElement(departList.value, Object.values(data)[0]);
  //     setModalProps({ checkVal: result });
  //     return result;
  //   }
  //   return false;
  // };

  const callback = (data) => {
    console.log('callbackData:::', data);
    modalFormData.value = data;
    if (modelStatus == '0') {
      const replyParams = {
        supId: supId.value,
        templateId: templateId.value,
        menuId: modelBtnId,
        formData: data
      };
      console.log('replyParams:::', replyParams);
      supReply(replyParams).then(() => {
        getData();
      });
    };
    if (modelStatus == '9') {
      let departIds = '';
      for(let val of Object.values(data)) {
        departIds += val + ',';
      };
      if (departIds != '') departIds = departIds.slice(0, -1);
      const departParams = {
        supId: supId.value,
        templateId: templateId.value,
        menuId: modelBtnId,
        departIds: departIds
      };
      addCooperation(departParams).then(() => {
        getData();
      });
    }
  };

  const handleClickStatus = (status: any, id: any) => {
    modelStatus = status;
    modelBtnId = id;
    modalWidth.value = 700;
    showRecord.value = true;
    switch(status) {
      case '1':
        const params = {
          supIds: supId.value,
          templateId: templateId.value,
          menuId: id
        };
        acceptedBatch(params).then(() => {
          getData();
        });
        return;
      // case '3':
      // case '3_1':
      //   modelTitle = '填报';
      //   if(has_city_fgw_Role.value) modelTitle = '批示';
      //   modalWidth.value = 1000;
      //   finshProgress.value = replyProgress.value || 0;
      //   reply.value = '';
      //   question.value = '';
      //   measure.value = '';
      //   fileValue.value = [];
      //   replyMonth.value = formatToDate(new Date(), 'YYYY-MM');
      //   break;
      case '2':
        Modal.confirm({
          title: '催办',
          content: '是否确认催办?',
          onOk() {
            urgeBatch({ supIds: supId.value, templateId: templateId.value, menuId: id }).then(() => {
              getData();
            });
          }
        });
        return;
      case '3':
        modelTitle = '挂牌';
        listing.value = '';
        break;
      case '4':
        Modal.confirm({
          title: '申请完成',
          content: '是否确认申请完成?',
          onOk() {
            supSubmit({ supId: supId.value, templateId: templateId.value, menuId: id }).then(() => {
              getData();
            });
          }
        });
        return;
      case '5':
        modelTitle = '延期';
        if(has_city_fgw_Role.value) modelTitle = '变更完成时限';
        delay.value = '';
        break;
      case '6':
        modelTitle = '申请延期';
        logModelTitle = '延期记录';
        logColumns[4].title = '批示结果';
        delay.value = '';
        delayReason.value = '';
        fileValue.value = [];
        break;
      case '7':
        modelTitle = '延期批示';
        logModelTitle = '延期批示记录';
        checkStatus.value = 1;
        checkReply.value = '';
        getRecordData();
        break;
      case '8':
        modelTitle = '核定';
        checkStatus.value = 1;
        checkReply.value = '';
        break;
      // case '13':
      //   // if(modifiedSupervise.value.monthReplyFlag) {
      //   //   Modal.warning({
      //   //     title: '提示',
      //   //     content: '填报已提交，请联系省营商办退回。',
      //   //     okText: '确定'
      //   //   });
      //   //   return
      //   // };
      //   modelTitle = '提示';
      //   modalWidth.value = 1000;
      //   fileValue.value = [];
      //   getFillDetails();
      //   break;
      // case '14':
      //   Modal.confirm({
      //     title: '提示',
      //     content: '是否退回本月填报内容?',
      //     okText: '确定退回',
      //     onOk() {
      //       sendBack({ supId: supId.value, templateId: templateId.value }).then(() => {
      //         getData();
      //       });
      //     }
      //   });
      //   return;
      default:
        break;
    };
    setTimeout(() => {
      visible.value = true;
    }, 100);
  };

  const handleCancel = () => {
    visible.value = false;
  };

  const handleSubmit = () => {
    switch(modelStatus) {
      // case '3':
      // case '3_1':
      //   // if(replyMonth.value === '' || replyMonth.value === null) {
      //   //   message.warning(`请选择填报时间`);
      //   //   return
      //   // };
      //   if(reply.value === '') {
      //     message.warning(`请填写${has_city_fgw_Role.value ? '批示内容' : '进展情况'}！`);
      //     return
      //   };
      //   if(reply.value.length > 2000) {
      //     message.warning(`${has_city_fgw_Role.value ? '批示内容' : '进展情况'}不能超过2000个字符！`);
      //     return
      //   };
      //   if(question.value && question.value.length > 2000) {
      //     message.warning('存在问题不能超过2000个字符！');
      //     return
      //   };
      //   if(measure.value && measure.value.length > 2000) {
      //     message.warning('下步措施不能超过2000个字符！');
      //     return
      //   };
      //   let fileStr = '';
      //   fileValue.value.map(el => {
      //     fileStr += el.storageId + ',';
      //   });
      //   fileStr = fileStr.substr(0, fileStr.length - 1);
      //   let replyParams = {
      //     supId: supId.value,
      //     templateId: templateId.value,
      //     replyProgress: finshProgress.value,
      //     replyMonth: formatToDate(replyMonth.value, 'YYYY-MM'),
      //     replyContent: reply.value,
      //     problem: question.value,
      //     nextStep: measure.value,
      //     replyAttachment: fileStr
      //   };
      //   if(has_city_fgw_Role.value) {
      //     delete replyParams.replyProgress;
      //     delete replyParams.replyMonth;
      //     delete replyParams.problem;
      //     delete replyParams.nextStep;
      //   };
      //   supReply(replyParams).then(() => {
      //     getData();
      //   });
      //   break;
      case '5':
        if(delay.value === '' || delay.value === null) {
          message.warning(`请选择${has_city_fgw_Role.value ? '变更完成时限' : '延期时间'}！`);
          return
        };
        const param = {
          supId: supId.value,
          templateId: templateId.value,
          postponeTime: formatToDate(delay.value, 'YYYY-MM-DD'),
          menuId: modelBtnId
        };
        supPostpone(param).then(() => {
          getData();
        });
        break;
      case '3':
        if(listing.value === '') {
          message.warning('请选择一种挂牌方式！');
          return
        };
        const params = {
          supId: supId.value,
          templateId: templateId.value,
          hangTagType: listing.value,
          menuId: modelBtnId
        };
        supHangTag(params).then(() => {
          getData();
        });
        break;
      case '8':
        // if(checkStatus.value === 0) {
        //   message.warning('请选择核定状态！');
        //   return
        // };
        if(checkStatus.value === 0 && checkReply.value === '') {
          message.warning('请填写驳回原因！');
          return
        };
        if(checkReply.value.length > 300) {
          message.warning('驳回原因不能超过300个字符！');
          return
        };
        const approveParams = {
          supIds: supId.value,
          templateId: templateId.value,
          approvedFlag: checkStatus.value,
          approvedContent: checkReply.value,
          menuId: modelBtnId
        };
        approvedBatch(approveParams).then(() => {
          getData();
        });
        break;
      case '6':
        if(delay.value === '' || delay.value === null) {
          message.warning(`请选择延期时限`);
          return
        };
        if(delayReason.value === '') {
          message.warning(`请填写延期原因！`);
          return
        };
        if(delayReason.value.length > 300) {
          message.warning('延期原因不能超过300个字符！');
          return
        };
        let fileStrs = '';
        fileValue.value.map(el => {
          fileStrs += el.storageId + ',';
        });
        fileStrs = fileStrs.substr(0, fileStrs.length - 1);
        const postponeParam = {
          supId: supId.value,
          templateId: templateId.value,
          postponeTime: formatToDate(delay.value, 'YYYY-MM-DD'),
          postponeReason: delayReason.value,
          attachment: fileStrs,
          menuId: modelBtnId
        };
        applyForSupPostpone(postponeParam).then(() => {
          getData();
        });
        break;
      case '7':
        if(checkStatus.value === 0 && checkReply.value === '') {
          message.warning('请填写驳回原因！');
          return
        };
        if(checkReply.value.length > 300) {
          message.warning('驳回原因不能超过300个字符！');
          return
        };
        const postponeAuditParam = {
          supId: supId.value,
          templateId: templateId.value,
          recordId: recordId.value,
          approvedFlag: checkStatus.value,
          approvedContent: checkReply.value,
          menuId: modelBtnId
        };
        postponeAudit(postponeAuditParam).then(() => {
          getData();
        });
        break;
      // case '13':
      //   let resultStr = '';
      //   if(fileValue.value.length > 0) {
      //     fileValue.value.map(el => {
      //       resultStr += el.storageId + ',';
      //     });
      //   };
      //   if(attachments.value.length > 0) {
      //     attachments.value.map(el => {
      //       resultStr += el.storageId + ',';
      //     });
      //   };
      //   resultStr = resultStr.substr(0, resultStr.length - 1);
      //   const fillParams = {
      //     supId: supId.value,
      //     templateId: templateId.value,
      //     replyProgress: finshProgress.value,
      //     replyMonth: formatToDate(replyMonth.value, 'YYYY-MM'),
      //     replyContent: reply.value,
      //     problem: question.value,
      //     nextStep: measure.value,
      //     replyAttachment: resultStr
      //   };
      //   supFillSubmit(fillParams).then(() => {
      //     getData();
      //   });
      //   break;
      default:
        break;
    };
    setTimeout(() => {
      loading.value = false;
      visible.value = false;
    }, 2000);
  };

  const matchChinese = (str) => {
    const reg = /[\u4e00-\u9fa5]/g;
    return str.match(reg).length
  };

  const handleShowlog = () => {
    getLogList();
    setTimeout(() => {
      logVisible.value = true;
    }, 100);
  };

  const handleRecordCancel = () => {
    logVisible.value = false;
  };

  const handlePreview = async (val) => {
    const url = await getTemporaryPath({ storageId: val.storageId });
    downFile(url, val.storageName);
    // window.open(url);
  };

  /**
   * 获取展示字段
   * @param arr {Array} schemas对象数组
  */
  const getDetailMap = (arr) => {
    const newarr = arr.map(item => {
      // if(item.field) return item.field;

      if(item.field) {
        return { dataIndex: item.field, text: item.label, fieldType: item.fieldType };
      };

      // if (item.isShow === true) {
      //   return item.label;
      // } else {
      //   return null; // 不符合条件时返回null或其他自定义值
      // };
    }).filter(Boolean); // 去除结果中的空值（null）
    return newarr;
  };

  const getLogList = () => {
    postponeRecord({ supId: supId.value, templateId: templateId.value }).then(res => {
      recordList.value = res;
    });
  };

  const getRecordData = () => {
    postponeAuditView({ supId: supId.value, templateId: templateId.value }).then(res => {
      recordObj.value = res;
      recordId.value = res.recordId;
      showRecord.value = res.isShow;
    });
  };

  const getFillDetails = () => {
    fillDetails({ supId: supId.value, templateId: templateId.value }).then(res => {
      replyMonth.value = formatToDate(res.replyMonth, 'YYYY-MM');
      reply.value = res.replyContent;
      question.value = res.problem;
      measure.value = res.nextStep;
      finshProgress.value = res.value || 0;
      attachments.value = res.attachments || [];
    });
  };

  const getData = () => {
    has_city_fgw_Role.value = (has_city_fgw_Role.value == "false" || has_city_fgw_Role.value == false) ? false : true;
    console.log('has_city_fgw_Role', has_city_fgw_Role.value);

    Promise.all([getSchemas({ templateId: templateId.value }), superviseDetail({ supId: supId.value, templateId: templateId.value })]).then(res => {
      modifiedSupervise.value.urgeNumber = res[1].urgeNumber;
      modifiedSupervise.value.overdueDesc = res[1].overdueDesc;
      modifiedSupervise.value.hangTagTypeDesc = res[1].hangTagTypeDesc;
      modifiedSupervise.value.monthReplyFlag = res[1].monthReplyFlag;
      // btnList.value = res[1].powerVoList;
      // caseRecordVos.value = res[1].supRecordVoList || [];
      supProgress.value = res[1].supProgressVoList || [];
      supProgressActive.value = res[1].supProgressVoList.findIndex(el => el.use);
      
      // requireEndTime.value = res[1].detailDynamicVoList.find(el => el.dataIndex === 'requireEndTime') != undefined ? formatToDate(res[1].detailDynamicVoList.find(el => el.dataIndex === 'requireEndTime').value, 'YYYY-MM') : '' || '';
      createdTime.value = res[1].detailDynamicVoList.find(el => el.dataIndex === 'createdTime') || '';
      replyProgress.value = res[1].detailDynamicVoList.find(el => el.dataIndex === 'replyProgress') != undefined ? res[1].detailDynamicVoList.find(el => el.dataIndex === 'replyProgress').value.split('%')[0] : 0 || 0;
      // 处理数据
      //获取配置的展示字段
      const arr = JSON.parse(res[0]).schemas[0].children[0].children;
      stage.value = res[1].stage;
      console.log('arr:::', arr);
      arr.find((item) => {
        if (
          item.fieldType == 'multipleTextarea' &&
          item.isShow == true &&
          item.componentProps.schedulingDesc &&
          item.componentProps.schedulingDesc.length > 1
        ) {
          steps.value[item.field] = item.componentProps.schedulingDesc;
          stepsRows.value[item.field] = item.componentProps.schedulingDesc.length;
        }
        if (
          item.fieldType == 'multipleInput' &&
          item.isShow == true &&
          item.componentProps.schedulingDesc &&
          item.componentProps.schedulingDesc.length > 1
        ) {
          steps.value[item.field] = item.componentProps.schedulingDesc;
          stepsRows.value[item.field] = item.componentProps.schedulingDesc.length;
        }
      });
      console.log('steps:::', steps.value);
      console.log('stepsRows:::', stepsRows.value);
      // const schedulingLabelList = arr.map(item => { 
      //   if(item.id == 'scheduling') return item.componentProps.schedulingDesc
      // }).filter(Boolean)[0] || [];
      // console.log('arr--schedulingLabelList::', schedulingLabelList);
      let detailMap = getDetailMap(arr);
      // 添加额外字段
      const extraData = [{ dataIndex: 'releaseDepartDesc', text: '发布部门' }, { dataIndex: 'createdTime', text: '创建时间' }];
      extraData.map(el => {
        if(detailMap.findIndex(item => item.dataIndex == el.dataIndex) === -1) detailMap.push(el);
      });
      detailMap.map(el => {
        let str = el.dataIndex + 'Desc';
        if(res[1].detailDynamicVoList.find(el => el.dataIndex == str)) el.dataIndex = str;
      });
      // 特殊处理转译字典字段
      // if(detailMap.findIndex(item => item.dataIndex == 'leadDepart') != -1) detailMap[detailMap.findIndex(item => item.dataIndex == 'leadDepart')].dataIndex = 'leadDepartDesc';
      // if(detailMap.findIndex(item => item.dataIndex == 'fillDepart') != -1) detailMap[detailMap.findIndex(item => item.dataIndex == 'fillDepart')].dataIndex = 'fillDepartDesc';
      // if(detailMap.findIndex(item => item.dataIndex == 'responsibleDepart') != -1) detailMap[detailMap.findIndex(item => item.dataIndex == 'responsibleDepart')].dataIndex = 'responsibleDepartDesc';
      // if(detailMap.findIndex(item => item.dataIndex == 'supStatus') != -1) detailMap[detailMap.findIndex(item => item.dataIndex == 'supStatus')].dataIndex = 'supStatusDesc';
      // if(detailMap.findIndex(item => item.dataIndex == 'overdue') != -1) detailMap[detailMap.findIndex(item => item.dataIndex == 'overdue')].dataIndex = 'overdueDesc';
      // if(detailMap.findIndex(item => item.dataIndex == 'warnLogo') != -1) detailMap[detailMap.findIndex(item => item.dataIndex == 'warnLogo')].dataIndex = 'warnLogoDesc';
      // console.log('detailMap:::', detailMap);
      detailArr.value = detailMap.map(el => {
        res[1].detailDynamicVoList.map(item => {
          if(item.dataIndex == el.dataIndex) {
            el.value = item.value;
          }
        });
        return el;
      }).filter(els => (els.fieldType != 'upload' && els.dataIndex != 'customNotice'));
      // console.log('arr-detailArr---', detailArr.value);
      // passIndex.value = detailArr.value.findIndex(el => el.dataIndex === 'scheduling');
      // console.log('arr-passIndex---', passIndex.value);
      // let passArr = 0;
      // if(detailArr.value[passIndex.value].value) passArr = detailArr.value[passIndex.value].value.split(';');
      // passNums.value = passArr.length;
      // if(passArr.length <= 1) {
      //   columns.splice(1, 1);
      //   let { ctx:that, proxy } = getCurrentInstance();
	    //   that.$forceUpdate();
      // };
      // console.log('arr-passNums---', passNums.value);
      // let newPassArr = [];
      // passArr.forEach((el, i) => {
      //   newPassArr.push({ text: '进度安排', value: el, dataIndex: 'scheduling', label: schedulingLabelList[i].desc });
      // });
      // console.log('arr--newPassArr---', newPassArr)
      // detailArr.value.splice(passIndex.value, 1, ...newPassArr);
      // let pushArr = [];
      // detailArr.value.map((item, index) => {
      //   if (item.dataIndex in steps.value) {
      //     // 判断是否所有 desc 描述均为空，若为空则合并表头展示
      //     if (steps.value[item.dataIndex].every((obj) => obj.desc === '')) {
      //       // console.log('--->', index);
      //       pushArr.push(index);
      //     } else {
      //     }
      //   }
      // });
      for (let key in steps.value) {
        const n = detailArr.value.findIndex((item) => item.dataIndex == key);
        let thisValue = detailArr.value[n];
        let obj = steps.value[key];
        let arrs = [];
        obj.map((el, idx) => {
          arrs.push({ dataIndex: key, text: thisValue.text, label: el.desc, fieldType: thisValue.fieldType, value: thisValue.value.split('@')[idx], childIndex: idx });
        });
        Array.prototype.splice.apply(detailArr.value, [n, 1].concat(arrs));
      }
      if(res[1].attachments) {
        hasFiles.value = true;
        detailArr.value.push({
          text: '附件',
          fieldType: 'upload',
          value: res[1].attachments
        });
      };
      
      console.log('detailArr:::', detailArr.value);
    });

    getSupRecordApi();
    getRequireEndTimeApi();
    getTemplateButtonRelApi();
  };

  const getRequireEndTimeApi = () => {
    getRequireEndTime({ supId: supId.value, templateId: templateId.value }).then(res => {
      requireEndTime.value = res;
    });
  };

  const getSupRecordApi = () => {
    getSupRecord({ supId: supId.value, templateId: templateId.value, roleCode: roleCode.value }).then(res => {
      caseRecordVos.value = res;
    });
  };

  const getAlreadyAddDepartIdsApi = (id) => {
    getAlreadyAddDepartIds({ supId: supId.value, templateId: templateId.value, menuId: id }).then(res => {
      departList.value = res;
    });
  };

  const getTemplateButtonRelApi = () => {
    getTemplateButtonRel({ templateId: templateId.value, roleCode: roleCode.value }).then(res => {
      btnList.value = res;
    });
  };
  
  /**
   * 查询当前用户角色
  */
  // const getQueryRolesByCurUser = () => {
  //     queryRolesByCurUser().then(res => {
  //       isThreeAdmin = res.includes('level3_admin');
  //     })
  // };

  const getHangTag = async () => {
    let res: any = await getHangTagType();
    hangTagTypeList.value = res;
  };

  const changeValue = (val) => {
    // console.log('file:::', val);
    fileValue.value = val;
  };

  const disabledDate = (current) => {
    // return current && current <= new Date(monthRecount(requireEndTime.value));
    return current && current < new Date(monthRecount());
  };

  const disabledMonth = (current) => {
    return current && current < new Date(createdTime.value.value);
  };

  const monthRecount = () => {
    let nowTime = moment(requireEndTime.value).format('YYYY-MM-DD');
    return moment(nowTime);
  };

  // const monthRecount = (date) => {
  //   let dateArr = moment(date).format("YYYY-MM").split('-');
  //   // let dateArr = formatToDate(date, 'YYYY-MM').split('-');
  //   if((dateArr[1] + 1) === '13') {
  //     dateArr[1] = '01';
  //     dateArr[0] = Number(dateArr[0]) + 1;
  //   } else {
  //     dateArr[1] = Number(dateArr[1]) + 1;
  //   };
  //   return dateArr.join('-');
  // };

  //设置弹窗隐藏
  const setModalHidden = (data) => {
    modalShow.value = data;
  };

  // 生命周期
  onMounted(() => {
    // roleCode.value = localStorage.getItem('roleCode');
    // has_city_fgw_Role.value = roleCode.value == 'YSB' ? true : false;
    getHangTag();
    getData();
  });
</script>
<style lang="less" scoped>
  .back {
    width: 100%;
    padding: 10px;
    background: white;
    cursor: pointer;
  }
  .ant-col {
    line-height: 37px;
    > span:nth-child(1) {
      font-weight: 400;
    }
  }
  .mt10 {
    margin-top: 10px;
  }
  .standard_btn {
    min-width: 100px;
    height: 32px;
    margin-top: 15px;
    margin-right: 30px;
    border-radius: 4px;
    border: none;
    color: #fff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }
  .noUse {
    color: lightgray;
    background: #f5f5f5!important;
  }
  .noUse:hover {
    color: lightgray!important;
    background: #f5f5f5!important;
    border-color: #f5f5f5!important;
  }
  .yellow {
    background: #ffbf43;
  }
  .orange {
    background: #ff833d;
  }
  .crimson {
    background: #ff5454;
  }
  .blue {
    background: #4476fa;
  }
  .green {
    background: #0fb50c;
  }
  .brown {
    background: #dabb85;
  }
  .skyblue {
    background: #38b8f8;
  }
  .redfont {
    color: red;
  }
  .card_title {
    color: #333;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .tags_info {
    display: flex;
    align-items: center;
    margin-right: 50px;
  }
  .tag_box {
    padding: 3px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .tag_blue {
    color: #4476fa;
    border-radius: 4px;
    border: 1px solid #4476fa;
    background: #e6ecff;
  }
  .tag_red {
    color: #fa4444;
    border-radius: 4px;
    border: 1px solid #fa4444;
    background: #ffe5e5;
  }
  .tag_orange {
    color: #ff7425;
    border-radius: 4px;
    border: 1px solid #ff7425;
    background: #ffeee4;
  }
  .supervise_info {
    margin-top: 20px;
    padding: 20px;
    width: 100%;
    border-radius: 4px;
    background: #f3f3f3;
  }
  .info_title_label {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
  }
  .info_label {
    display: inline-block;
    color: #666;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .info_reason {
    background: #f1f1f1;
    padding: 2px 12px;
    border-radius: 6px;
  }
  .info_content {
    color: #333;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .card_stepbox {
    margin: 20px 0;
    padding: 0 100px;
  }
  .modal_body {
    padding: 30px 50px;
  }
  .red_point {
    color: red;
  }
  .base-info {
    /deep/ .ant-btn:hover, .ant-btn:focus {
      color: #fff;
      border-color: #FFF;
    }
    // /deep/ .ant-btn-primary:hover, .ant-btn-primary:focus {
    //   border-color: unset;
    //   background: unset;
    // }
  }
  .btncard {
    /deep/ .ant-card-body {
      padding-top: 0;
    }
  } 
</style>
