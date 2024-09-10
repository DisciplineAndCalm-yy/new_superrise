<template>
  <div class="newform">
    <div class="newform-titlewrap">
      <div class="newform-titlewrap-title">{{ isEdit || readOnly ? '详情' : '新建线索台账' }}</div>
      <div class="newform-titlewrap-btns">
        <a-button @click="() => router.push({ path: '/supervise/line' })">返回</a-button>
        <a-button v-if="!readOnly" type="primary" @click="saveToSubmit(0)">保存为草稿</a-button>
        <a-button v-if="!readOnly" type="primary" @click="saveToSubmit(1)">保存并提交</a-button>
      </div>
    </div>
    <div class="newform-content">
      <div v-if="isEdit || readOnly" class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>编号:</div>
        <div class="newform-content-item-value">{{ clueNumber ? clueNumber : '暂无' }}</div>
      </div>
      <div v-if="isAdd" class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>问题线索性质:</div>
        <div class="newform-content-item-value">
          <a-radio-group v-model:value="questionNature" @change="changeQuestionNature" :disabled="readOnly">
            <a-radio :value="0">新建问题线索</a-radio>
            <a-radio :value="1">已上报问题线索</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>问题线索类别:</div>
        <div class="newform-content-item-value">
          <a-select placeholder="请选择" v-model:value="questionType" style="width: 100%" @change="changeQuestionType" :disabled="isEdit || readOnly">
            <a-select-option v-for="(item, key) in typeList" :key="key" :value="item.dictCode">{{ item.dictName }}</a-select-option>
          </a-select>
        </div>
      </div>
      <div v-show="questionNature == 1" class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>选择编号:</div>
        <div class="newform-content-item-value">
          <a-select placeholder="请选择" v-model:value="clueNumber" style="width: 100%" @change="changeQuestionIds" :disabled="readOnly">
            <a-select-option v-for="(item, key) in idList" :key="key" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>问题线索归属:</div>
        <div class="newform-content-item-value">
          <a-textarea
            :rows="6"
            v-model:value="ascription"
            placeholder="最多2000个字符"
            :maxlength="2000"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :disabled="readOnly"
          />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>问题线索概要:</div>
        <div class="newform-content-item-value">
          <a-textarea
            :rows="5"
            v-model:value="outline"
            placeholder="最多2000个字符"
            :maxlength="2000"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :disabled="readOnly"
          />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>问题线索主要情况:</div>
        <div class="newform-content-item-value">
          <a-textarea
            :rows="5"
            v-model:value="situation"
            placeholder="最多2000个字符"
            :maxlength="2000"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :disabled="readOnly"
          />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>整改责任单位:</div>
        <div class="newform-content-item-value">
          <a-input placeholder="请输入整改责任单位" v-model:value="rectifyDepart" style="width: 100%" :disabled="readOnly" />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>整改时限:</div>
        <div class="newform-content-item-value halfwidth">
          <a-month-picker v-model:value="rectifyDate" style="width: 60%" :disabled="readOnly" />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>整改情况（月）:</div>
        <div class="newform-content-item-value">
          <a-textarea
            :rows="5"
            v-model:value="rectifySituation"
            placeholder="最多2000个字符"
            :maxlength="2000"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :disabled="readOnly"
          />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>存在问题:</div>
        <div class="newform-content-item-value">
          <a-textarea
            :rows="5"
            v-model:value="question"
            placeholder="最多2000个字符"
            :maxlength="2000"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :disabled="readOnly"
          />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>下步措施:</div>
        <div class="newform-content-item-value">
          <a-textarea
            :rows="5"
            v-model:value="measure"
            placeholder="最多2000个字符"
            :maxlength="2000"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :disabled="readOnly"
          />
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>整改完成情况:</div>
        <div class="newform-content-item-value">
          <a-radio-group v-model:value="finishStatus" :disabled="readOnly">
            <a-radio v-for="(el, ids) in finishStatusOptions" :key="ids" :value="el.dictCode">{{ el.dictName }}</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="newform-content-item">
        <div class="newform-content-item-label"><span class="redtip">*</span>牵头单位:</div>
        <div class="newform-content-item-value">
          <a-input placeholder="请输入牵头单位" v-model:value="department" style="width: 100%" :disabled="readOnly" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="taskTemplateConfigIndex">
  import moment, { Moment } from 'moment';
  import { onActivated, ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import {
    getRectificationType,
    getClueType,
    getClueNumber,
    getOneByClueNumber,
    questionAdd,
    questionSubmit,
    getClueDetail,
  } from '/@/api/supervise/question';
  import { queryRolesByCurUser } from '/@/api/supervise/index';
  import dayjs from 'dayjs';

  const router = useRouter();
  const route = useRoute();
  const query = route.query;

  const clueId = ref(null);
  const questionNature = ref(0);
  const questionType = ref(null);
  const clueNumber = ref(null);
  const ascription = ref('');
  const outline = ref('');
  const situation = ref('');
  const rectifyDepart = ref('');
  const rectifyDate = ref(null);
  const rectifySituation = ref('');
  const question = ref('');
  const measure = ref('');
  const finishStatusOptions = ref([]);
  const finishStatus = ref('');
  const department = ref('');
  const typeList = ref([]);
  const idList = ref([]);
  const readOnly = ref(false);
  const isEdit = ref(false);
  const isAdd = ref(false);
  let isYsb = ref(false);

  const resetForm = (_boolean = true) => {
    if (_boolean) {
      questionType.value = null;
      clueNumber.value = null;
    }
    if (isAdd.value) clueNumber.value = null;
    ascription.value = '';
    outline.value = '';
    situation.value = '';
    rectifyDepart.value = '';
    rectifyDate.value = null;
    rectifySituation.value = '';
    question.value = '';
    measure.value = '';
    finishStatus.value = '';
    department.value = '';
  };

  const showBack = () => {
    console.log('query:', query);
    if (query && query.id) {
      getClueDetail({ clueId: query.id }).then((res) => {
        if (res.clueType) {
          getClueNumberApi(res.clueType);
        }
        if (res) {
          setTimeout(() => {
            questionNature.value = Number(res.clueNature);
            clueId.value = res.clueId;
            clueNumber.value = res.clueNumber;
            questionType.value = res.clueType;
            ascription.value = res.clueAffiliation;
            outline.value = res.clueSummary;
            situation.value = res.clueMainConditions;
            rectifyDepart.value = res.responsibleDepart;
            rectifyDate.value = dayjs(res.disposeTime);
            rectifySituation.value = res.disposeCondition;
            question.value = res.problem;
            measure.value = res.nextStep;
            finishStatus.value = res.rectificationType;
            department.value = res.leadDepart;
          }, 100);
        }
      });
    }
  };

  const changeQuestionNature = (_val) => {
    resetForm();
    if (_val.target.value === 0) clueNumber.value = '';
  };

  const checkForm = () => {
    if (questionType.value === null) {
      message.warning('请选择问题线索类别！');
      return true;
    }
    if (questionNature.value == 1 && clueNumber.value == '') {
      message.warning('请选择一个编号！');
      return true;
    }
    if (ascription.value === '') {
      message.warning('请填写问题线索归属！');
      return true;
    }
    if (ascription.value.length > 2000) {
      message.warning('问题线索归属不能超过2000个字符！');
      return true;
    }
    if (outline.value === '') {
      message.warning('请填写问题线索概要！');
      return true;
    }
    if (outline.value.length > 2000) {
      message.warning('问题线索概要不能超过2000个字符！');
      return true;
    }
    if (situation.value === '') {
      message.warning('请填写问题线索主要情况！');
      return true;
    }
    if (situation.value.length > 2000) {
      message.warning('问题线索主要情况不能超过2000个字符！');
      return true;
    }
    if (rectifyDepart.value === '') {
      message.warning('请填写整改责任单位！');
      return true;
    }
    if (rectifyDate.value === null || rectifyDate.value === 'Invalid Date') {
      message.warning('请选择整改时限！');
      return true;
    }
    if (rectifySituation.value === '') {
      message.warning('请填写整改情况（月）！');
      return true;
    }
    if (rectifySituation.value.length > 2000) {
      message.warning('整改情况（月）不能超过2000个字符！');
      return true;
    }
    if (question.value === '') {
      message.warning('请填写存在问题！');
      return true;
    }
    if (question.value.length > 2000) {
      message.warning('存在问题不能超过2000个字符！');
      return true;
    }
    if (measure.value === '') {
      message.warning('请填写下步措施！');
      return true;
    }
    if (measure.value.length > 2000) {
      message.warning('下步措施不能超过2000个字符！');
      return true;
    }
    if (finishStatus.value === '') {
      message.warning('请选择整改完成情况！');
      return true;
    }
    if (department.value === '') {
      message.warning('请填写牵头单位！');
      return true;
    }
    return false;
  };

  const saveToSubmit = (_val: number) => {
    if (checkForm()) return;

    const params = {
      operateType: isEdit.value ? 1 : 0, // 0新增，1编辑
      clueId: clueId.value || null,
      clueNumber: clueNumber.value || null,
      clueNature: questionNature.value,
      clueType: questionType.value,
      clueAffiliation: ascription.value,
      clueSummary: outline.value,
      clueMainConditions: situation.value,
      responsibleDepart: rectifyDepart.value,
      disposeTime: dayjs(rectifyDate.value).format('YYYY-MM'),
      disposeCondition: rectifySituation.value,
      problem: question.value,
      nextStep: measure.value,
      rectificationType: finishStatus.value,
      leadDepart: department.value,
    };
    if (_val === 0) {
      // console.log('保存：', params);
      questionAdd(params).then(() => {
        router.push({ path: '/supervise/line', query: { refresh: true } });
      });
    }
    if (_val === 1) {
      // console.log('保存提交：', params);
      questionSubmit(params).then(() => {
        router.push({ path: '/supervise/line', query: { refresh: true } });
      });
    }
  };

  const getRectificationTypeApi = () => {
    getRectificationType().then((res) => {
      finishStatusOptions.value = res;
    });
  };

  const getClueTypeApi = () => {
    getClueType().then((res) => {
      typeList.value = res;
    });
  };

  const changeQuestionType = (_val) => {
    if (questionNature.value === 1) getClueNumberApi(_val);
  };

  const changeQuestionIds = (_val) => {
    const params = {
      clueNumber: _val,
      clueType: questionType.value,
    };
    getOneByClueNumber(params).then((res) => {
      resetForm(false);
      if (res) {
        clueNumber.value = _val;
        ascription.value = res.clueAffiliation;
        outline.value = res.clueSummary;
        situation.value = res.clueMainConditions;
        rectifyDepart.value = res.responsibleDepart;
        rectifyDate.value = dayjs(res.disposeTime);
        rectifySituation.value = res.disposeCondition;
        question.value = res.problem;
        measure.value = res.nextStep;
        finishStatus.value = res.rectificationType;
        department.value = res.leadDepart;
        if (!isEdit.value) clueId.value = res.clueId;
      }
    });
  };

  const getClueNumberApi = (val = null) => {
    idList.value = [];
    if (!isEdit.value) resetForm(false);
    getClueNumber({ clueType: val }).then((res) => {
      if (res) {
        res.map((el) => {
          idList.value.push({ label: el, value: el });
        });
      }
    });
  };

  /**
   * 查询当前用户角色
   */
  const getQueryRolesByCurUser = () => {
    queryRolesByCurUser().then((res) => {
      isYsb = res.includes('city_fgw');
    });
  };

  // 生命周期
  onMounted(() => {
    if (query && !query.id) isAdd.value = true;
    if (query && query.readOnly) readOnly.value = query.readOnly;
    if (query && query.id && !query.readOnly) isEdit.value = true;
    getQueryRolesByCurUser();
    getClueTypeApi();
    getRectificationTypeApi();
    resetForm();
    showBack();
  });
</script>

<style lang="less" scoped>
  .newform {
    margin: 20px;
    background: #fff;
    padding: 20px;
    &-titlewrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2dcdc;
      padding-bottom: 20px;
      &-title {
        font-size: 16px;
        font-weight: bold;
      }
      &-btns {
        button {
          min-width: 100px;
          margin-left: 20px;
        }
      }
    }
    &-content {
      padding-top: 20px;
      &-item {
        margin-top: 20px;
        display: flex;
        // align-items: center;
        padding: 0 150px;
        &-label {
          min-width: 150px;
          text-align: right;
          margin-right: 20px;
          height: 30px;
          line-height: 30px;
        }
        &-value {
          width: calc(100% - 170px);
          display: flex;
          align-items: center;
        }
        .halfwidth {
          width: 50%;
        }
      }
      .redtip {
        color: red;
        margin-right: 6px;
      }
    }
  }
</style>
