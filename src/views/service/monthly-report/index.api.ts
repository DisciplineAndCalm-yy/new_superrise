import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerRecordReportList= '/enterprise/entMangerRecord/report/list', // 月报列表

  exportXls = '/enterprise/entMangerRecord/exportXls',
}


export const enterpriseEntMangerRecordReportList = (params) => defHttp.get({ url: Api.enterpriseEntMangerRecordReportList, params });

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;