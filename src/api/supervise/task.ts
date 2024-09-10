import { defHttp } from '/@/utils/http/axios';


/**
 * 查看上次计算结果
 */
export const beforehandRetain = (params) => {  
  return defHttp.get({url: '/sup/score/beforehandRetain', params})
}

/**
 * 确认计算
 */
export const confirmCalc = (params) => {  
  return defHttp.post({url: '/sup/score/confirmCalc', params})
}

/**
 * 导出自动评分结果
 */
export const exportResultsScore = '/sup/score/dataExport'

/**
 * 获取模板任务列表
 */
export const listTemplateTask = (params?) => {  
  return defHttp.get({url: '/sup/score/tempList', params})
}

/**
 * 督办任务评分部门列表
 */
export const getDepartList = (params) => {  
  return defHttp.get({url: '/sup/score/getDepartList', params})
}

/**
 * 督办数据统计
 */
export const getDataStatistics = (params?) => {  
  return defHttp.get({url: '/sup/statistic/data_statistics', params})
}

/**
 * 督办承办单位任务分布
 */
export const getDepartStatistics = (params?) => {  
  return defHttp.get({url: '/sup/statistic/depart_statistics', params})
}

/**
 * 任务分布统计
 */
export const getTypeStatistics = (params?) => {  
  return defHttp.get({url: '/sup/statistic/type_statistics', params})
}