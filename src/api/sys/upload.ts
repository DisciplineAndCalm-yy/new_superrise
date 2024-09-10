import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

const { apiUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl,
      onUploadProgress,
    },
    params
  );
}
/**
 * @description: Upload interface
 */
export function uploadImg(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: `${apiUrl}/sys/common/upload`,
      onUploadProgress,
    },
    params,
    { isReturnResponse: true }
  );
}
