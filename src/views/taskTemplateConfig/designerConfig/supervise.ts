import { deepClone } from '@coderlt/form-designer';
import { SchemaItem } from '/@/plugins/epic-designer/types/components';
import { atomicComponent } from './component';
import { ComponentTypeEnum } from '/@/plugins/epic-designer';

// const isProd = ['uat', 'production'].includes(import.meta.env.MODE);
const isProd = false;

interface Config {
  isUnique?: boolean;
  isFixed?: boolean;
  isHide?: boolean;
  isShow?: boolean;
  isDel?: boolean;
  isRequired?: boolean;
  prefix: string;
}

const generateConfig = (type: keyof typeof atomicComponent, params: Config): SchemaItem => {
  if (!(type in atomicComponent)) {
    throw `${type} 改类型组件不存在`;
  }

  const defaultSchemaConfig = deepClone(atomicComponent[type].defaultSchema || {});
  const defaultConfig = deepClone((atomicComponent[type] as any).config || {});

  params.isUnique && (defaultSchemaConfig.isUnique = true);

  if (params.isDel === false) {
    defaultSchemaConfig.hideDel = true;
  } else {
    defaultSchemaConfig.hideDel = false;
    defaultConfig.attribute = defaultConfig.attribute || [];
  }

  // fix: 全部去掉编辑按钮
  defaultSchemaConfig.hideCopy = true;

  // 本地保存调试,添加 isShow 字段
  // if (!isProd) {
  defaultConfig.attribute = defaultConfig.attribute || [];
  // defaultConfig.attribute.push({
  //   label: '是否列表字段',
  //   type: 'switch',
  //   field: 'isShow',
  // });
  // }

  defaultSchemaConfig.forbid = params.isFixed || false; // 是否固定字段
  defaultSchemaConfig.isRequired = params.isRequired || false; // 是否必填
  defaultSchemaConfig.isShow = params.isShow || false; // 是否列表字段

  // 后端解析使用
  defaultSchemaConfig.fieldType = defaultSchemaConfig.type;
  defaultSchemaConfig.type = `${defaultSchemaConfig.type}${params.prefix ? `-${params.prefix}` : ''}`;

  // defaultSchemaConfig.type = `${params.prefix}${defaultSchemaConfig.id}`;

  params.isHide && (defaultSchemaConfig.hide = true);

  return {
    ...atomicComponent[type],
    defaultSchema: defaultSchemaConfig,
    config: defaultConfig,
  };
};

// 督办组件配置
const supervisePrefix = 'supervise';
const superviseConfigMap: Record<string, Config> = {
  multipleInput: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 多行文本框
  multipleTextarea: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 多行文本域
  attachments: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: false, isDel: true }, // 附件
  radio: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 单选框
  checkBox: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 复选框
  select: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 多选
  slider: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 滑动条
  date: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 日期
  richTextEditor: { isUnique: false, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: false, isDel: true }, // 富文本
  remarks: { isUnique: true, isFixed: false, isHide: false, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: true }, // 备注

  deadlineType: { isUnique: true, isFixed: true, isHide: true, prefix: supervisePrefix, isRequired: true, isShow: true, isDel: false }, // 多选
  notice: { isUnique: true, isFixed: true, isHide: true, prefix: '' }, // 通知
};

const superviseExtendPrefix = 'extend';
const superviseExtendConfigMap: Record<string, Config> = {
  // 拓展配置
  multipleInput: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 多行文本框
  multipleTextarea: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 多行文本域
  attachments: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 附件
  radio: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 单选框
  checkBox: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 复选框
  select: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 多选
  slider: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 滑动条
  date: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 日期
  richTextEditor: { isUnique: false, isFixed: false, isHide: isProd, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 富文本
  remarks: { isUnique: true, isFixed: false, isHide: false, prefix: superviseExtendPrefix, isRequired: true, isShow: false, isDel: true }, // 备注
};

const generateTemplateConfig = () => {
  const templateConfig = deepClone(
    Object.entries(superviseConfigMap).map(([type, params]) => generateConfig(type as keyof typeof atomicComponent, params))
  );

  templateConfig.forEach((item) => {
    // attribute label 输入框默认限制20个字
    const labelDetail = item.config?.attribute?.find((i) => i.field === 'label');

    if (labelDetail) {
      labelDetail.componentProps = {
        maxLength: 20,
        ...(labelDetail.componentProps ?? {}),
      };
    }
  });

  return templateConfig;
};

const generateExtendConfig = () => {
  const extendConfig = deepClone(
    Object.entries(superviseExtendConfigMap).map(([type, params]) => generateConfig(type as keyof typeof atomicComponent, params))
  );

  extendConfig.forEach((i) => {
    // 单行文本框 多行文本域去掉 描述管理
    if (i.config?.attribute && ['multipleInput', 'multipleTextarea'].includes(i.defaultSchema.fieldType)) {
      i.config.attribute = i.config?.attribute?.filter((item) => !['isRepeat', 'componentProps.schedulingDesc'].includes(item.field as string));
    }

    i.defaultSchema.isDetailField = true;

    // 全部添加 是否详情字段
    i.config?.attribute?.push({
      field: 'isDetailField',
      label: '是否详情字段',
      type: 'switch',
    });

    // attribute label 输入框默认限制10个字
    const labelDetail = i.config?.attribute?.find((i) => i.field === 'label');

    if (labelDetail) {
      labelDetail.componentProps = {
        maxLength: 10,
        ...(labelDetail.componentProps ?? {}),
      };
    }
  });

  return extendConfig;
};

// 督办默认展示组件
export const superviseFormConfig: SchemaItem[] = [...generateTemplateConfig(), ...generateExtendConfig()];

export const superviseTilte = '基础组件';
export const superviseNormalFormConfig = {
  title: superviseTilte,
  list: [
    `${ComponentTypeEnum.MULTIPLE_INPUT}-${supervisePrefix}`,
    `${ComponentTypeEnum.MULTIPLE_TEXTAREA}-${supervisePrefix}`,
    `${ComponentTypeEnum.RICH_TEXT_EDITOR}-${supervisePrefix}`,
    `${ComponentTypeEnum.SELECT}-${supervisePrefix}`,
    `${ComponentTypeEnum.CHECK_BOX}-${supervisePrefix}`,
    `${ComponentTypeEnum.RADIO}-${supervisePrefix}`,
    `${ComponentTypeEnum.UPLOAD}-${supervisePrefix}`,
    `${ComponentTypeEnum.DATA_PICKER}-${supervisePrefix}`,
  ],
};
console.log('superviseNormalFormConfig', superviseNormalFormConfig);

export const superviseExtendTilte = '拓展组件';
export const superviseExtendFormConfig = {
  title: superviseExtendTilte,
  list: [
    `${ComponentTypeEnum.MULTIPLE_INPUT}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.MULTIPLE_TEXTAREA}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.RICH_TEXT_EDITOR}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.SELECT}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.CHECK_BOX}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.RADIO}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.UPLOAD}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.DATA_PICKER}-${superviseExtendPrefix}`,
    `${ComponentTypeEnum.SLIDER_CONFIG}-${superviseExtendPrefix}`,
  ],
};

export const superviseCooperateTilte = '配合单位组件';
export const superviseCooperateFormConfig = {
  title: superviseCooperateTilte,
  list: [],
};
