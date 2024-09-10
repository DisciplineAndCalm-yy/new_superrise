<template>
  <div class="supervision">
    <div class="header">
      <div class="steps">
        <a-steps v-model:current="currentStep">
          <a-step title="基本信息" disabled />
          <a-step title="模板配置" disabled />
          <a-step title="拓展配置" disabled />
        </a-steps>
      </div>
    </div>
    <div class="content">
      <Baseinfo class="baseinfo" :template-data="templateData" v-show="currentStep === 0" @cancel="handleBack" @next-step-change="onNextStepChange" />
      <div class="designer" v-show="currentStep === 1">
        <TemplateConfig
          ref="templateConfigRef"
          :isShow="currentStep === 1"
          :schemasJson="templateData.schemasJson"
          @cancel="handleBack"
          @next-step-change="onNextStepChange"
          @prev-step-change="onPrevStepChange"
        />
      </div>
      <div class="templateData" v-show="currentStep === 2">
        <ExpandConfig
          :isShow="currentStep === 2"
          @cancel="handleBack"
          @prev-step-change="onPrevStepChange"
          @next-step-change="onNextStepChange"
          @update-old-city-type="templateData.oldCiteType = templateData.citeType"
          :template-data="templateData"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="taskTemplateConfigEdit">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { addTemplate, editTemplate, getTemplateDetail, saveTemplateButton } from '/@/api/taskTemplateConfig';
  import Baseinfo, { FormData } from './children/baseInfo.vue';
  import TemplateConfig from './children/templateConfig.vue';
  import ExpandConfig from './children/expandConfig.vue';
  import { TemplateDetail } from './index.data';

  defineOptions({
    inheritAttrs: false,
  });

  const route = useRoute();
  const router = useRouter();
  const { close: closeTab } = useTabs();

  onMounted(() => {
    if (route.query.templateId) {
      templateData.value.templateId = route.query.templateId as string;
      getDetail();
    } else {
      templateData.value.schemasJson = '';
    }
  });

  const getDetail = () => {
    getTemplateDetail({ templateId: templateData.value.templateId }).then((res) => {
      const { citeType, templateName, schemasJson } = res;
      templateData.value = {
        citeType,
        oldCiteType: citeType,
        schemasJson,
        templateId: templateData.value.templateId,
        templateName,
      };
    });
  };

  const templateData = ref<TemplateDetail>({
    citeType: '',
    oldCiteType: '',
    schemasJson: '',
    templateId: '',
    templateName: '',
  });

  const currentStep = ref(0);

  const templateConfigRef = ref<InstanceType<typeof TemplateConfig> | null>(null);

  const handleSave = async () => {
    if (templateData.value.templateId) {
      await editTemplate(templateData.value);
    } else {
      const res = await addTemplate(templateData.value);
      templateData.value.templateId = res;
    }
  };

  const onPrevStepChange = () => {
    currentStep.value >= 1 && (currentStep.value -= 1);
  };
  const onNextStepChange = async ({ step, data }) => {
    switch (step) {
      case 1:
        const { citeType, templateName } = data as FormData;
        templateData.value.citeType = citeType;
        templateData.value.templateName = templateName;

        currentStep.value += 1;
        break;
      case 2:
        templateData.value.schemasJson = data as string;
        await handleSave();
        currentStep.value += 1;
        break;
      default:
        const params = {
          templateId: templateData.value.templateId,
          schemasJson: data as string,
        };

        saveTemplateButton(params).then(() => {
          handleBack();
        });
        break;
    }
  };

  const handleBack = () => {
    router.go(-1);
    closeTab();
  };
</script>

<style lang="less" scoped>
  .supervision {
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 700px;
    background-color: #eff1f4;

    .header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      background-color: #fff;

      .back {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .steps {
        width: 70%;
      }

      .save {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .content {
      flex: 1;
      display: flex;
      overflow: hidden;
      margin-top: 15px;
      background-color: #fff;
      .baseinfo {
        width: 100%;
        position: relative;
        margin: 0 auto;
      }

      .designer {
        width: 100%;
      }

      .templateData {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
