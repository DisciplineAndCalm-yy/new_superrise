import { defaultNoticeSchema } from './designerConfig';

// 编辑的时候,元素固定的禁用,去掉通知; 保存的时候,元素开启编辑,添加通知
export const formatSchema = (schema: any, isSave: boolean) => {
  if (!schema.length) {
    return [];
  }

  const formConfig = schema[0].children[0];

  if (isSave) {
    formConfig.children.push(defaultNoticeSchema);
  } else {
    formConfig.children = formConfig.children.filter((i) => i.id !== 'customNotice');
  }

  return schema;
};
