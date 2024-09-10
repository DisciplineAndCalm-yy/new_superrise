<template>
  <div class="manage">
    <!-- <div class="upload">
      上传模板
    </div> -->
    <a-upload class="upload" name="file" :showUploadList="false" :customRequest="onImportXls">
      <span>上传模板</span>
    </a-upload>
    <div class="download" @click="onExportXls">导出模板</div>
  </div>
</template>
<script lang="ts" setup>
import '/@/utils/rem'
import { downloadTemplate, importTemplate } from '/@/api/businessScreen/businessScreen'
import { useMethods } from '/@/hooks/system/useMethods';

const { handleImportXls, handleExportXls } = useMethods();

function onImportXls(d) {
  handleImportXls(d, importTemplate, () => {
    
  });
}
function onExportXls() {
  handleExportXls('营商洞察模板', downloadTemplate);
}
</script>

<style lang="less" scoped>
.manage {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .upload,
  .download {
    cursor: pointer;
    height: 20%;
    width: 20%;
    margin: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #fff;
    border-radius: 10px;
    span {
      color: #fff;
      font-size: 30px;
    }
  }
  .upload {
    background: #7DB0F2;
  }
  .download {
    background: #AC85EF;
  }
}
</style>