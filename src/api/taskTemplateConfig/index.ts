import { defHttp } from '/@/utils/http/axios';
import { ExpandConfig } from '/@/views/taskTemplateConfig/index.data';

/**
 * 督办模板
 */
export const getTemplateList = (params) => defHttp.get({ url: '/sup/template/list', params });
export const addTemplate = (params) => defHttp.post({ url: '/sup/template/add', params });
export const editTemplate = (params) => defHttp.post({ url: '/sup/template/edit', params });
export const getTemplateDetail = (params) => defHttp.get({ url: '/sup/template/getOneByTemplateId', params });
export const enableTemplate = (params) => defHttp.post({ url: '/sup/template/enable', params });
export const deleteTemplate = (params) => defHttp.get({ url: '/sup/template/delete', params });
export const saveTemplateButton = (params) => defHttp.post({ url: '/sup/template/saveTemplateButton', params });

// 督办字典
export const getDeadlineType = () => defHttp.get({ url: '/sup/dict/getDeadlineType' }); // 完成时限
export const getEmergency = () => defHttp.get({ url: '/sup/dict/getEmergency' }); // 紧急程度
export const getIndicator = () => defHttp.get({ url: '/sup/dict/getIndicator' }); // 指标查询
export const getSupNoticeDaysType = () => defHttp.get({ url: '/sup/dict/getSupNoticeDaysType' }); // 通知时间类型
export const getSupNoticeWeekType = () => defHttp.get({ url: '/sup/dict/getSupNoticeWeekType' }); // 周期类型类型
export const getResponsibleOrg = () => defHttp.get({ url: '/sup/dict/getResponsibleOrg' }); // 下发责任单位查询

export const getSupCiteType = () => defHttp.get({ url: '/sup/dict/getSupCiteType' }); // 下发责任单位查询

// 拓展配置
export const getInitTemplateButton = (params: { citeType: string }) =>
  defHttp.get<ExpandConfig[]>({ url: '/sup/template/initTemplateButton', params }); // 拓展配置列表
export const getTemplateButtonView = (params: { templateId: string }) => defHttp.get({ url: '/sup/template/getTemplateButtonRel', params }); // 回显拓展配置列表
export const getSupReplyFrequency = () => defHttp.get({ url: '/sup/dict/getSupReplyFrequency' }); // 回复频率
export const getSupReplyRule = () => defHttp.get({ url: '/sup/dict/getSupReplyRule' }); // 回复详细规则设置
