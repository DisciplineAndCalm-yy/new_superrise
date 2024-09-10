enum ComponentTypeEnum {
  INPUT = 'input',
  MULTIPLE_INPUT = 'multipleInput',
  FORM = 'form',
  SELECT = 'select',
  RADIO = 'radio',
  UPLOAD = 'upload',
  SWITCH = 'switch',
  TIME = 'time',
  TREE_SELECT = 'treeSelect',
  TEXTAREA = 'textarea',
  MULTIPLE_TEXTAREA = 'multipleTextarea',
  DATA_PICKER = 'dataPicker',
  COMPOSITE_COMPONENT = 'compositeComponent',
  CUSTOM_NOTICE = 'customNotice',
  CHECK_BOX = 'checkBox',
  RICH_TEXT_EDITOR = 'richTextEditor',
  SLIDER_CONFIG = 'slider',
  DEADLINE_TYPE = 'deadlineType',
}

enum DataPickerEnum {
  DATE = 'date',
  MONTH = 'month',
  DATARANGE = 'daterange',
}

// switch 选项值
enum SwitchEnum {
  OPEN = '1',
  CLOSE = '0',
}

export { ComponentTypeEnum, DataPickerEnum, SwitchEnum };
