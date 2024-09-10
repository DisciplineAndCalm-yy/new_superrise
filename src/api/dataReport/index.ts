import { defHttp } from '/@/utils/http/axios';

/**
 * 数据报送相关接口
 */
export const sendFillAnswerList = (params) => defHttp.get({ url: '/project/send/fillAnswer/list', params }) // 查询填报人数据报送分页列表
export const fillAnswerQuerySendQuestionList = (params) => defHttp.get({ url: '/project/send/fillAnswer/querySendQuestionList', params }) // 查询填报人开启问题列表分页列表
export const sendList = (params) => defHttp.get({ url: '/project/send/list', params }) // 数据报送分页列表-创建人
export const fillAnswerQueryOpenIndicatorTree = (params) => defHttp.get({ url: '/project/send/fillAnswer/queryOpenIndicatorTree', params }) // 查询填报人报送下拉指标树
export const queryOpenIndicatorTree = (params) => defHttp.get({ url: '/project/send/queryOpenIndicatorTree', params }) // 查询报送下拉指标树
export const querySendQuestionList = (params) => defHttp.get({ url: '/project/send/querySendQuestionList', params }) // 查询开启问题列表
export const submitSendAnswer = (params) => defHttp.post({ url: '/project/send/submitSendAnswer', params }) // 提交报送答案
export const projectFinishList = (params) => defHttp.get({ url: '/project/send/projectFinishList', params }) // 一键报送下拉采集任务列表
export const copySendAnswer = (params) => defHttp.get({ url: '/project/send/copySendAnswer', params }) // 一键报送
export const importSendAnswer = (file, params?) => defHttp.uploadFile({ url: '/project/send/importSendAnswer' }, {file, data: params} ) // 导入采集数据
export const exportSendAnswer = '/project/send/exportSendAnswer'  // 导出采集数据


