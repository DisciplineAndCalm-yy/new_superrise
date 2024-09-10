import { defHttp } from '/@/utils/http/axios';

export const getRectificationType = () => defHttp.get({ url: '/sup/dict/getRectificationType' }); //获取整改完成情况类别
export const getClueType = () => defHttp.get({ url: '/sup/dict/getClueType' }); //获取问题线索类别
export const getClueDetail = (params) => defHttp.get({ url: '/sup/problems_clues/view', params }); //问题线索台账详情获取
export const getClueNumber = (params) => defHttp.get({ url: '/sup/problems_clues/getClueNumber', params }); //问题线索台账编号获取
export const getOneByClueNumber = (params?) => defHttp.get({ url: '/sup/problems_clues/getOneByClueNumber', params }); //问题线索台账详情(根据编号回显)
export const questionAdd = (params?) => defHttp.post({ url: '/sup/problems_clues/add', params }); //保存
export const questionSubmit = (params?) => defHttp.post({ url: '/sup/problems_clues/submit', params }); //保存并提交
