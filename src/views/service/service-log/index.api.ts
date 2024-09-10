import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerRecordList= '/enterprise/entMangerRecord/list', // 服务记录列表 - 日常走访
  qixianMangerMangerServiceRecord= '/qixian/manger/mangerServiceRecord', // 服务记录列表 - 诉求处理
}


export const enterpriseEntMangerRecordList = (params) => defHttp.get({ url: Api.enterpriseEntMangerRecordList, params });
export const qixianMangerMangerServiceRecord = (params) => defHttp.get({ url: Api.qixianMangerMangerServiceRecord, params });