import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerMangerList= '/enterprise/entManger/manger/list', // 维护管家列表
  enterpriseEntMangerSaveOrUpdateManger = '/enterprise/entManger/saveOrUpdate/manger', // 维护管家信息
}

export const enterpriseEntMangerMangerList = (params) => defHttp.get({ url: Api.enterpriseEntMangerMangerList, params });
export const enterpriseEntMangerSaveOrUpdateManger = (params) => defHttp.get({ url: Api.enterpriseEntMangerSaveOrUpdateManger, params });