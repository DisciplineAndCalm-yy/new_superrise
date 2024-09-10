<template>
  <BasicModal @register="register" v-bind="$attrs" title="回复频率设置" @ok="handleSubmit" width="60%" @cancel="cancelFn">
    <div class="reply-rate">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import { DictType } from '/#/config';
  import { getSupReplyRule } from '/@/api/taskTemplateConfig';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useForm, BasicForm, FormSchema } from '/@/components/Form';
  import { ReplyRateData } from '../index.data';

  const props = withDefaults(defineProps<{ supReplyFrequencyList: DictType[] }>(), {
    supReplyFrequencyList: () => [],
  });

  const dateKeyMap = {
    '1': {
      picker: 'month',
      valueFormat: 'YYYY-MM',
    },
    '2': {
      picker: 'quarter',
      valueFormat: 'YYYY-MM',
    },
    '3': {
      picker: 'year',
      valueFormat: 'YYYY',
    },
    '4': {
      picker: 'daterange',
      valueFormat: 'YYYY-MM-DD',
    },
  };

  const idVal = ref('');
  const formSchemas: FormSchema[] = [
    {
      field: 'replyFrequency',
      label: '回复频率',
      component: 'Select',
      labelWidth: 300,
      required: true,
      componentProps: {
        options: [],
        fieldNames: {
          label: 'dictName',
          value: 'dictCode',
        },
        allowClear: false,
        onChange: (val) => {
          setFieldsValue({ replyDate: '', replies: 0 });
          clearValidate('replyDate');
          if (val in dateKeyMap) {
            updateSchema([
              {
                field: 'replyDate',
                componentProps: dateKeyMap[val],
              },
            ]);
          }
        },
      },
    },
    {
      field: 'replyRule',
      label: '回复详细规则设置',
      component: 'ApiRadioGroup',
      labelWidth: 300,
      required: true,
      componentProps: {
        api: getSupReplyRule,
        labelField: 'dictName',
        valueField: 'dictCode',
        allowClear: false,
      },
      ifShow: ({ values }) => {
        return values.replyFrequency && values.replyFrequency !== '0';
      },
    },
    {
      field: 'replyDate',
      label: '请选择日期范围',
      component: 'RangePicker',
      labelWidth: 300,
      required: true,
      componentProps: {
        valueType: 'Date',
        picker: 'month',
        valueFormat: 'YYYY-MM',
        style: {
          width: '100%',
        },
        placeholder: ['请选择开始日期时间', '请选择结束日期时间'],
      },
      ifShow: ({ values }) => {
        return values.replyFrequency && values.replyFrequency !== '0' && values.replyRule && values.replyRule === '0';
      },
    },
    {
      field: 'replies',
      label: '请输入次数',
      component: 'InputNumber',
      labelWidth: 300,
      required: true,
      componentProps: {
        style: {
          width: '100%',
        },
      },
      ifShow: ({ values }) => {
        return values.replyFrequency && values.replyFrequency !== '0' && values.replyRule && values.replyRule === '1';
      },
    },
  ];

  const [registerForm, { setFieldsValue, clearValidate, updateSchema, validate }] = useForm({
    schemas: formSchemas,
    showActionButtonGroup: false,
    autoFocusFirstItem: true,
  });

  const emit = defineEmits<{
    (event: 'replyChange', data: { id: string; replyRate: ReplyRateData }): void;
    // Parameters<RegisterFn> todo 函数类型申明
    (event: 'register', data: any): void;
  }>();

  const [register, { closeModal, setModalProps }] = useModalInner((data) => {
    const { id, replyRate } = data;
    idVal.value = id;
    setFieldsValue({});
    if (replyRate) {
      const { replyStartDate, replyEndDate, ...params } = replyRate;

      updateSchema([
        {
          field: 'replyDate',
          componentProps: { ...dateKeyMap[params.replyFrequency] },
        },
      ]);
      setFieldsValue({
        ...params,
        replyDate: replyStartDate && replyEndDate ? [replyStartDate, replyEndDate] : [],
      });
    } else {
      setFieldsValue({
        replyFrequency: undefined,
        replyRule: undefined,
        replyDate: [],
        replies: 0,
      });
    }

    updateSchema([
      {
        field: 'replyFrequency',
        componentProps: {
          options: props.supReplyFrequencyList,
        },
      },
    ]);

    clearValidate();
    setModalProps({ confirmLoading: false });
  });

  const getLastMonthOfQuarter = (date) => {
    const quarter = dayjs(date).quarter();

    const lastMonthMap = {
      1: 2,
      2: 5,
      3: 8,
      4: 11,
    };

    return dayjs(date).month(lastMonthMap[quarter]).endOf('month');
  };

  const handleSubmit = () => {
    validate().then((res) => {
      const { replyDate, ...params } = res;
      const data = {
        ...params,
        replyStartDate: '',
        replyEndDate: '',
      };

      if (replyDate && replyDate.length) {
        // 获取当前月份所在
        const endDate = getLastMonthOfQuarter(replyDate[1]);
        data.replyStartDate = dayjs(replyDate[0]).format(dateKeyMap[params.replyFrequency].valueFormat);
        data.replyEndDate = dayjs(endDate).format(dateKeyMap[params.replyFrequency].valueFormat);
      }

      emit('replyChange', { id: idVal.value, replyRate: data });
      closeModal();
    });
  };

  //关闭弹窗
  const cancelFn = () => {
    closeModal();
  };
</script>
<style lang="less" scoped>
  .reply-rate {
    height: 300px;
  }
</style>
