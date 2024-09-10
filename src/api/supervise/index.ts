
import { defHttp } from '/@/utils/http/axios';
import { EvidenceResult } from '/@/views/common/evidenceDetailModal';
import { IndicatorProcessDetail, IndicatorProjectDetail } from '/@/views/indicatorManagement/newCollection/index.data';

/**
 * 指标体系列表
 */
// export const indicatorTemplate = (params) => {
//   return defHttp.get({url: 'indicator/indicatorTemplate/list', params}, {successMessageMode: 'none'})
// }

export const getSchemas = (params) => defHttp.get({ url: '/sup/template/getByTemplateId', params }); //获取json
export const superviseAdd = (params?) => defHttp.post({ url: '/sup/base/add', params }); //新增
export const superviseEdit = (params?) => defHttp.post({ url: '/sup/base/editAdd', params }); //编辑
export const superviseDel = (params?) => defHttp.delete({ url: '/sup/base/delete', params }); //删除
export const lineDel = (params?) => defHttp.get({ url: '/sup/problems_clues/delete', params }); //问题线索删除
export const getSupStatus = (params?) => defHttp.get({ url: '/sup/dict/getSupStatus', params }); //查询任务状态
export const listSubmit = (params?) => defHttp.get({ url: '/sup/problems_clues/listSubmit', params }); //线索提交
export const getTaskStateType = (params?) => defHttp.get({ url: '/sup/dict/getTaskStateType', params }); //查询督办状态-方柯改
export const superviseSendBatch = (params?) => defHttp.get({ url: '/sup/base/sendBatch', params }); //批量发起
export const superviseCheckBatch = (params?) => defHttp.get({ url: '/sup/operation/record/batch_submit', params }); //批量提交
export const superviseRejectBatch = (params?) => defHttp.get({ url: '/sup/operation/record/batch_send_back', params }); //批量退回
export const copyTemplate = (params) => defHttp.get({ url: '/indicator/indicatorTemplate/copyTemplate', params }); //指标体系-复制
export const indicatorTemplateAdd = (params) => defHttp.post({ url: '/indicator/indicatorTemplate/add', params }); //指标体系-新增
export const indicatorTemplateEdit = (params) => defHttp.post({ url: '/indicator/indicatorTemplate/edit', params }); //指标体系-编辑
export const indicatorTemplateDel = (params) => defHttp.get({ url: '/indicator/indicatorTemplate/delete', params }); //指标体系-删除
export const indicatorTree = (params) => defHttp.get({ url: '/indicator/indicatorTree', params }); //新建指标-查询指标树

// 导入导出类
export const templateExport = '/sup/export/templateExport'; ///督办-任务模板下载
export const reviewDataExport = '/sup/export/reviewDataExport'; ///督办-下载待核定结果
export const dataExport = '/sup/export/dataExport'; ///督办-任务模板下载
export const dataExportKeys = '/sup/problems_clues/dataExport'; ///督办-任务模板下载
export const operationReportExport = '/sup/export/operationReportExport'//详情-操作记录下载
export const dataImport = (file, params?) => defHttp.uploadFile({ url: '/sup/export/templateImport' }, {file, data: params} ) // 督办-批量任务导入
export const reviewDataImport = (file, params?) => defHttp.uploadFile({ url: '/sup/export/reviewDataImport' }, {file, data: params} ) // 督办-待核定结果导入

// 问题线索导入导出类
export const templateDownload = '/sup/problems_clues/templateDownload'; //督办-问题线索模板下载
export const cluesDataImport = (file, params?) => defHttp.uploadFile({ url: '/sup/problems_clues/import' }, {file, data: params} ) // 督办-问题线索批量导入

export const queryRolesByCurUser = (params) => defHttp.get({ url: '/sys/role/queryRolesByCurUser', params }); //督办-当前用户角色
export const superviseList = (params) => defHttp.get({ url: '/sup/base/list', params }); //督办-列表
export const superviseProblemsList = (params) => defHttp.get({ url: '/sup/problems_clues/list', params }); //督办-问题线索-列表
export const getClueType = (params) => defHttp.get({ url: '/sup/dict/getClueType', params }); //督办-问题线索-线索类别
export const getClueStatus = (params) => defHttp.get({ url: '/sup/dict/getClueStatus', params }); //督办-问题线索-任务状态
export const getRectificationType = (params) => defHttp.get({ url: '/sup/dict/getRectificationType', params }); //督办-问题线索-整改完成情况
export const batchSendBack = (params) => defHttp.get({ url: '/sup/problems_clues/batchSendBack', params }); //督办-问题线索-批量退回
export const superviseEditView = (params) => defHttp.get({ url: '/sup/base/editView', params }); //督办-编辑辉县
export const superviseDetail = (params) => defHttp.get({ url: '/sup/base/view', params }); //督办详情-督办信息
export const getHangTagType = () => defHttp.get({ url: '/sup/dict/getHangTagType' }); //督办详情-督办挂牌map
export const acceptedBatch = (params) => defHttp.get({ url: '/sup/operation/acceptedBatch', params }); //督办详情-督办接收
export const supHangTag = (params) => defHttp.get({ url: '/sup/operation/supHangTag', params }); //督办详情-督办挂牌
export const supReply = (params) => defHttp.post({ url: '/sup/operation/supReply', params }); //督办详情-督办回复
export const supPostpone = (params) => defHttp.get({ url: '/sup/operation/supPostpone', params }); //督办详情-督办延期
export const urgeBatch = (params) => defHttp.get({ url: '/sup/base/urgeBatch', params }); //督办详情-督办催办
export const supSubmit = (params) => defHttp.get({ url: '/sup/operation/supSubmit', params }); //督办详情-督办(送审)发起核定
export const approvedBatch = (params) => defHttp.get({ url: '/sup/operation/approvedBatch', params }); //督办详情-督办核定
export const getRequireEndTime = (params) => defHttp.get({ url: '/sup/operation/getRequireEndTime', params }); //督办详情-督办获取最新完成时限
export const sendBack = (params) => defHttp.get({ url: '/sup/base/send_back', params }); //督办详情-督办（三级管理）驳回
export const fillDetails = (params) => defHttp.get({ url: '/sup/base/fill_details', params }); //督办详情-督办（三级管理）填报回显
export const supFillSubmit = (params) => defHttp.post({ url: '/sup/base/sup_fill_submit', params }); //督办详情-督办（三级）提交

export const applyForSupPostpone = (params) => defHttp.post({ url: '/sup/operation/applyForSupPostpone', params }); //督办详情-督办延期申请
export const postponeAudit = (params) => defHttp.post({ url: '/sup/operation/postponeAudit', params }); //督办详情-督办延期批示审核
export const postponeAuditView = (params) => defHttp.get({ url: '/sup/operation/postponeAuditView', params }); //督办详情-督办延期批示回显
export const postponeRecord = (params) => defHttp.get({ url: '/sup/operation/postponeRecord', params }); //督办详情-督办延期记录
export const getTemplateButtonRel = (params) => defHttp.get({ url: '/sup/template/getTemplateButtonRel', params }); //督办详情-督办按钮配置查询
export const getSupRecord = (params) => defHttp.get({ url: '/sup/operation/supRecord', params }); //督办详情-督办操作记录查询接口
export const addCooperation = (params) => defHttp.get({ url: '/sup/operation/addCooperation', params }); //督办详情-督办 添加配合部门
export const getAlreadyAddDepartIds = (params) => defHttp.get({ url: '/sup/operation/getAlreadyAddDepartIds', params }); //督办详情-督办 添加配合部门-已存在部门
