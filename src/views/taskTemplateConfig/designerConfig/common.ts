import { ComponentTypeEnum } from '/@/plugins/epic-designer';

/**
 * 校验 EDesigner 表单项中的 select 组件 选项是否为空
 * @param schema 模板 schema , 和script同级的schema, 注意注意注意不包含 script 的格式
 * @returns status 是否通过校验, tips string[] 校验失败的表单lable项
 */
export const validFormEmptyOptions = (schema) => {
  const rootSchema = schema[0];
  const formSchema = rootSchema.children[0];
  const emptyOptionsLabels = [] as any[];

  formSchema.children.forEach((i) => {
    if (i.fieldType === ComponentTypeEnum.SELECT) {
      if (i.componentProps.optionType === 'department') {
        const filterTreeIds = i.componentProps.treeSelectProps.filterTreeIds;

        if (!filterTreeIds.length || filterTreeIds.includes('')) {
          emptyOptionsLabels.push(i.label);
        }
      }

      if (i.componentProps.optionType === 'custom') {
        const options = i.componentProps.options;

        if (!options.length || options.filter((i) => i.value === '').length) {
          emptyOptionsLabels.push(i.label);
        }
      }
    }
    if (i.fieldType === ComponentTypeEnum.RADIO) {
      const options = i.componentProps.options;

      if (!options.length || options.filter((i) => i.value === '').length) {
        emptyOptionsLabels.push(i.label);
      }
    }
    if (i.fieldType === ComponentTypeEnum.CHECK_BOX) {
      const options = i.componentProps.options;

      if (!options.length || options.filter((i) => i.value === '').length) {
        emptyOptionsLabels.push(i.label);
      }
    }
  });

  if (emptyOptionsLabels.length) {
    return {
      status: false,
      tips: emptyOptionsLabels,
    };
  } else {
    return {
      status: true,
      tips: [],
    };
  }
};

/**
 * 转换生成器表单单选下拉的结果值, 字符串转换为长度唯一的数组, 配合后端使用
 * @param schemaData 模板 schema ,包含 script 的格式
 * @param formData 表单数据
 * @param mode edit 或者 display, edit 从字符串转换为数组, display 从数组转换为字符串
 * @returns 转换后的表单数据
 */
export const switchSingleChoiceDropdownFormat = (schemaData, formData, mode = 'edit') => {
  const { schemas } = schemaData;
  const rootSchema = schemas[0];
  const formSchema = rootSchema.children[0];

  formSchema.children.forEach((i) => {
    if (i.fieldType === ComponentTypeEnum.SELECT && i.componentProps.mode === '') {
      if (mode === 'edit') {
        if (formData[i.field]) {
          formData[i.field] = [formData[i.field]];
        }
      } else {
        if (formData[i.field] && formData[i.field].length) {
          formData[i.field] = formData[i.field][0];
        }
      }
    }
  });

  return formData;
};

/**
 * 禁用配合单位中的id选项, 特殊配合部门中使用, 不通用
 * @param schemaData 模板 schema ,包含 script 的格式
 * @param ids string[] 要禁用的id
 * @returns schema
 */
export const disabledCooperationOptionsByIds = (schemaData, ids) => {
  const { schemas } = schemaData;
  const rootSchema = schemas[0];
  const formSchema = rootSchema.children[0];

  formSchema.children.forEach((i) => {
    if (i.id === 'cooperation') {
      i.componentProps.treeSelectProps.disabledIds = ids || [];
    }
  });

  return { ...schemaData, schemas };
};

/**
 * 校验 EDesigner 表单项中的 label 属性是否为空
 * @param schemaData 模板 schema ,包含 script 的格式
 * @returns status 是否通过校验, tips string[] 校验失败的表单lable项
 */
export const validFormLabelOptions = (schemaData) => {
  const { schemas } = schemaData;
  const rootSchema = schemas[0];
  const formSchema = rootSchema.children[0];
  const emptyLabels = [] as any[];

  formSchema.children.forEach((i) => {
    if (!i.label) {
      emptyLabels.push(i.id);
    }
  });

  if (emptyLabels.length) {
    return {
      status: false,
      tips: emptyLabels,
    };
  } else {
    return {
      status: true,
      tips: [],
    };
  }
};
