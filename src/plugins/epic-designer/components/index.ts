import { type PluginManager } from '@coderlt/form-designer';
import { generateSchemaByConfig } from '../utils/common';
import { formConfig } from './form';
import formItemSchema from './form-item';
import { ComponentManagerParmas, SchemaItem } from '../types/components';

/**
 * 注册表单和组
 * @param pluginManager form-designer pluginManager 实例
 * @param config 表单配置数据 SchemaGroup
 */
export function setupComponentManager(pluginManager: PluginManager, config: SchemaItem[], parmas: ComponentManagerParmas) {
  const schemaList: SchemaItem[] = generateSchemaByConfig(config, parmas.mode || 'merge');

  function registerComponents(config: SchemaItem[]) {
    config.forEach((item) => {
      pluginManager.registerComponent(item);
    });
  }

  registerComponents(schemaList);

  // 表单所需，特殊处理 form-item
  pluginManager.registerComponent(formConfig);
  pluginManager.registerComponent(formItemSchema);
}

export function setupSchemaGroup(pluginManager: PluginManager, title: string, config: string[]) {
  pluginManager.addSchemaGroup({
    title,
    list: config,
  });
}
