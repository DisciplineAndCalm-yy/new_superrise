<template>
  <!-- pageSchema: {{ pageSchema }} -->
  <!-- selectKeys: {{ selectKeys }} -->
  <!-- modalShow: {{ modalShow }} -->
  <!-- steps： {{steps}} -->
  <div v-if="roleCode.length > 1" class="rolewraps">
    <div v-for="menus in roleCode" :class="['rolemenus', menus == thisRole ? 'activeRoleMenu' : '']" @click="changeRoles(menus)">{{
      roleMap[menus]
    }}</div>
  </div>
  <BasicTable @register="registerTable" :rowSelection="rowSelection" class="superviseTable" @columns-change="columnChange">
    <template #between>
      <a-row class="summary">
        <a-col :span="4">
          <a-tooltip title="统计维度为具体子任务，仅支持与子任务状态、完成时限、发布日期进行联动查询">
            <img :src="warning" alt="警告图标" class="warningIcon" />
            <span class="warningTxt">请注意!</span>
          </a-tooltip>
        </a-col>
        <!-- selectedKey: {{ selectedKey }} -->
        <a-col :span="4" v-for="(value, key) in summary">
          <div
            class="summaryItem"
            @click="toSelect(key)"
            :style="{ color: key == selectedKey ? 'white' : null, background: key == selectedKey ? colors[key] : null }"
          >
            <span class="labelTxt">{{ key }}</span> ：<span>{{ value }}</span>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #tableTitle class="btnContainer">
      <a-button type="primary" @click="toNew" v-if="hasPermission('supervise:add')">新建任务</a-button>
      <div style="width: 87.6px" v-if="!hasPermission('supervise:add')"></div>
      <a-space>
        <!-- <a-popconfirm title="确定要催办这些任务吗?" @confirm="pushCase()">
                    <a-button class="orangeBtn" :disabled="selectedRows.length == 0">催办</a-button>
                </a-popconfirm> -->
        <a-button v-if="hasPermission('supervise:pushCase')" class="orangeBtn" :disabled="selectedRows.length == 0" @click="toPush()">催办</a-button>
        <a-button v-if="hasPermission('supervise:templateExport')" type="primary" ghost @click="download(1)">模板下载</a-button>
        <!-- <a-button type="primary" ghost @click="onImportXls">批量导入任务</a-button> -->
        <j-upload-button v-if="hasPermission('supervise:templateExport')" size="small" type="primary" ghost @click="handleImport($event, 1)"
          >批量导入任务</j-upload-button
        >
        <a-button v-if="hasPermission('supervise:handleActive')" type="primary" ghost :disabled="selectedRows.length == 0" @click="handleActive()"
          >批量发起任务</a-button
        >
        <a-button
          v-if="hasPermission('supervise:superviseCheckBatch')"
          type="primary"
          ghost
          :disabled="selectedRows.length == 0"
          @click="handleDeal(1)"
          >批量提交</a-button
        >
        <a-button
          v-if="hasPermission('supervise:superviseRejectBatch')"
          type="primary"
          ghost
          :disabled="selectedRows.length == 0"
          @click="handleDeal(2)"
          >批量退回</a-button
        >
        <a-button v-if="hasPermission('supervise:resultDownLoad')" type="primary" ghost :disabled="selectedRows.length == 0" @click="download(2)"
          >下载待核定结果</a-button
        >
        <!-- <a-button type="primary" ghost @click="sendAnnounce">导入待核定结果</a-button> -->
        <j-upload-button v-if="hasPermission('supervise:resultImport')" size="small" type="primary" ghost @click="handleImport($event, 2)"
          >导入待核定结果</j-upload-button
        >
        <!-- <j-upload-button size="small" type="link" v-if="record.activateStatus == '2'" @click="handleImport($event, record)">导入</j-upload-button> -->
        <a-button v-if="hasPermission('supervise:downLoad')" type="primary" :disabled="selectedRows.length == 0" @click="chooseExportKeys()"
          >导出</a-button
        >
      </a-space>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <superviseModal @register="register" @success="reload" @setModalHidden="setModalHidden" v-if="modalShow"> </superviseModal>

  <!-- 导出弹窗 -->
  <exportKeysModal @register="registerExportKeysModal" @toDownLoad="exportKeysDownLoad"></exportKeysModal>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import warning from '/@/assets/images/warning.png';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { createVNode } from 'vue';
  import { Modal } from 'ant-design-vue';
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import superviseModal from './components/superviseModal.vue';
  import exportKeysModal from './components/exportKeysModal.vue';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { getColumns } from './index.data';
  import { useRoute, useRouter } from 'vue-router';
  import { exportMethod } from '/@/utils/file/download';
  import { deepClone } from '@coderlt/form-designer';
  import {
    queryRolesByCurUser,
    superviseCheckBatch,
    superviseRejectBatch,
    superviseList,
    getSchemas,
    superviseDel,
    superviseSendBatch,
    urgeBatch,
    dataImport,
    reviewDataImport,
    templateExport,
    reviewDataExport,
    dataExport,
  } from '/@/api/supervise/index';
  const { hasPermission } = usePermission();
  //   声明路由
  const router = useRouter();

  const route = useRoute();

  const [register, { openModal, closeModal, setModalProps }] = useModal();

  //选key导出弹窗注册
  const [registerExportKeysModal, { openModal: openExportKeysModal, closeModal: closeExportKeysModal }] = useModal();

  const columnChange = (data) => {
    // reload()
  };

  // 禁止勾选
  const getCheckboxProps = (record) => {
    //禁用的方法
    return {
      // disabled: record.activateStatus != '2'
    };
  };

  //模板id
  const templateId = ref('');
  //菜单名称
  const templateName = ref('');
  //最终的查询条件集合
  const searchFormSchema = ref([]);

  const modalShow = ref(false);

  //最终的表头
  const finalColumns = ref([]);
  //json
  const pageSchema = ref('');

  //formArr
  const formArr = ref([]);

  //列表展示字段
  const keys = ref([]);

  //需要分组展示的子表头映射对象
  const steps = ref({});

  //需要合并表头展示的子表头映射对象
  const stepsColumns = ref({});

  //当前用户是否有city_fgw角色
  const has_city_fgw_Role = ref(true);
  const roleCode = ref([]);
  const thisRole = ref('');
  const roleMap = ref({
    YSB: '营商办',
    QT: '牵头部门',
    PH: '配合部门',
  });
  const currentMonth = new Date().getMonth() + 1;
  const anotherKey = `本月填报延期`;
  // console.log('anotherKey', anotherKey)
  //summary数据
  const summary = ref({
    已超期: '',
    即将超期: '',
    黄牌: '',
    红牌: '',
    // anotherKey: ""
  });
  // summary.value[anotherKey] = ''
  // const summary = ref[
  //     {
  //         name: "已超期",
  //         expiredCount: ""
  //     }
  // ]

  // 生命周期
  onMounted(() => {
    //获取templateId和路由名称
    const id = route.path.split('/').pop();
    templateId.value = id;
    templateName.value = route.meta.title;

    // 设置查询条件
    searchFormSchema.value = getColumns(templateName.value, 'search');

    //获取schemas
    getSchemasFn({ templateId: id });

    getQueryRolesByCurUser();
  });

  //选中
  const selectedKey = ref('');
  // const colors = ref(['#D59D30', '#FFDC60', '#E3E800', '#FF4B4B'])
  const colors = ref({
    已超期: '#D59D30',
    即将超期: '#FFDC60',
    黄牌: '#E3E800',
    红牌: '#FF4B4B',
  });
  // colors.value[anotherKey] = '#FCEE21'
  const toSelect = (key) => {
    selectedKey.value = selectedKey.value != key ? key : '';
    // console.log('key', key)
    // const anotherKeyTxt = summary.value[anotherKey]
    // console.log('anotherKey', anotherKey)
    let filterType = '';
    switch (selectedKey.value) {
      case '已超期':
        filterType = 0;
        break;
      case '即将超期':
        filterType = 1;
        break;
      case '黄牌':
        filterType = 2;
        break;
      case '红牌':
        filterType = 3;
        break;
      case anotherKey:
        filterType = 4;
        break;
      default:
        filterType = '';
        break;
    }
    setProps({
      searchInfo: {
        filterType: filterType,
      },
    });

    setPagination({
      current: 1,
    });
    reload();
  };

  /**
   * 选择导出字段
   */
  const chooseExportKeys = () => {
    const uniqueArray = finalColumns.value.filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));
    openExportKeysModal(true, {
      supList: selectedRowKeys.value,
      templateId: templateId.value,
      finalColumns: uniqueArray.map((item) => {
        let obj = { dataIndex: '', key: '', title: '' };
        obj.dataIndex = item.exportKey;
        obj.key = item.exportKey;
        obj.title = item.title;
        // if (item.children != undefined) {
        //     obj.children = item.children
        // }
        return obj;
      }),
    });
  };

  const exportKeysDownLoad = (data) => {
    download(3, data);
  };

  //导出
  const download = (type, params) => {
    switch (type) {
      case 1:
        exportMethod(templateExport, `${templateName.value}-模板.xlsx`, { templateId: templateId.value });
        break;
      case 2:
        exportMethod(
          reviewDataExport,
          `${templateName.value}-待核定结果.xlsx`,
          { templateId: templateId.value, supList: selectedRowKeys.value },
          'post'
        );
        clearSelectedRowKeys();
        break;
      case 3:
        exportMethod(dataExport, `${templateName.value}.xlsx`, params, 'post');
        closeExportKeysModal();
        clearSelectedRowKeys();
        break;
      default:
        break;
    }
  };

  /**
   * 查询当前用户角色
   */
  const getQueryRolesByCurUser = () => {
    queryRolesByCurUser().then((res) => {
      // console.log(11111111111, res.includes('city_fgw'))
      // has_city_fgw_Role.value = res.includes('city_fgw');
      // localStorage.setItem('roles', JSON.stringify(res));
      roleCode.value = res.filter((el) => el == 'YSB');
      if (roleCode.value.length == 0) roleCode.value = res.filter((el) => el == 'QT' || el == 'PH');
      thisRole.value = roleCode.value[0];
      localStorage.setItem('roles', thisRole.value);
    });
  };

  const changeRoles = (val) => {
    thisRole.value = val;
    setTimeout(() => {
      reload();
      clearSelectedRowKeys();
    }, 500);
  };

  /**
   * 导入
   */
  const handleImport = (file, type) => {
    const fn = type == 1 ? dataImport : reviewDataImport;
    fn(file.file, { templateId: templateId.value }).then((res) => {
      setTimeout(() => {
        reload();
        clearSelectedRowKeys();
      }, 1500);
    });
  };

  /**
   * 获取json数据
   * @param additionalShowKeys {Array} 督办分类列表除配置显示外的额外字段
   * */
  const getSchemasFn = async (params) => {
    await getSchemas(params).then((res) => {
      // 督办分类列表除配置显示外的额外字段
      const additionalShowKeys = getColumns(templateName.value, 'list');

      // console.log('additionalShowKeys', additionalShowKeys)
      //赋值
      pageSchema.value = res;

      //获取配置的展示字段
      formArr.value = JSON.parse(res).schemas[0].children[0].children;
      console.log('formArr.value', formArr.value);
      formArr.value.find((item) => {
        if (
          item.fieldType == 'multipleTextarea' &&
          item.isShow == true &&
          item.componentProps.schedulingDesc &&
          item.componentProps.schedulingDesc.length > 1
        ) {
          steps.value[item.field] = item.componentProps.schedulingDesc;
        }
        if (
          item.fieldType == 'multipleInput' &&
          item.isShow == true &&
          item.componentProps.schedulingDesc &&
          item.componentProps.schedulingDesc.length > 1
        ) {
          steps.value[item.field] = item.componentProps.schedulingDesc;
        }
      });

      const supOrderArr = ['supOrder'];
      // 列表显示字段合并，最终展示字段
      // keys.value = [...getKeys(formArr.value)]
      console.log(getKeys(formArr.value));
      keys.value = [...supOrderArr, ...getKeys(formArr.value), ...additionalShowKeys];
    });

    //查询
    reload();
  };

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '督办列表',
      api: superviseList,
      immediate: false,
      columns: [],
      showIndexColumn: true,
      indexColumnProps: {
        width: 100,
        align: 'center',
      },
      size: 'small',
      expandRowByClick: true,
      scroll: { x: 1600 },
      showTableSetting: false,
      // searchInfo: {templateId: 111},
      fetchSetting: {
        //配置返回参数
        listField: 'dataSource',
      },
      formConfig: {
        labelWidth: 150,
        schemas: searchFormSchema,
        showAdvancedButton: false,
        fieldMapToTime: [
          ['requireTime', ['requireStartTime', 'requireEndTime'], 'YYYY-MM-DD'],
          ['createTime', ['releaseStartTime', 'releaseEndTime'], 'YYYY-MM-DD'],
          ['replyTime', ['replyStartTime', 'replyEndTime'], 'YYYY-MM-DD'],
        ],
        resetFunc: async () => {
          // currentAuditStatus.value = 0
        },
      },
      actionColumn: {
        width: 250,
        fixed: 'right',
      },
      rowKey: 'supId',
      rowSelection: {
        checkStrictly: false,
        preserveSelectedRowKeys: false,
        getCheckboxProps: getCheckboxProps,
      },
      // 请求之前对参数做处理
      beforeFetch(params) {
        params.templateId = templateId.value;
        params.roleCode = thisRole.value;
      },

      afterFetch(data) {
        //获取数据
        let rawData = getRawDataSource();
        console.log('keys', keys.value);
        console.log('rawData:::', rawData);

        summary.value['已超期'] = rawData.expiredCount;
        summary.value['即将超期'] = rawData.immediatelyExpiredCount;
        summary.value['黄牌'] = rawData.yellowCardCount;
        summary.value['红牌'] = rawData.redCardCount;
        // summary.value[anotherKey] = rawData.monthUnReplyCount;

        //筛选要展示的字段(按照keys的顺序排列)
        let columns = keys.value.map((key) => {
          //过滤模板字段
          const possibleKeys = [key, key + 'Desc'];
          // console.log('possibleKeys', possibleKeys)
          return rawData.columns.filter((column, index) => {
            //处理问题线索调账中，“牵头单位”改为“整改责任单位”
            // if (templateId.value == '1773264334441054209' && column.title == '牵头单位') {
            //     column.title = '整改责任单位'
            // }

            // console.log('possibleKeys', possibleKeys)
            const isOk = possibleKeys.includes(column.dataIndex);
            // console.log('isOk', isOk)
            if (isOk) {
              column.exportKey = JSON.parse(JSON.stringify(column.dataIndex));
              // console.log('kkk', column.key)
              //找到fornjson中的label赋值给column
              formArr.value.find((item) => {
                if (item.field == key) {
                  column.title = item.label;
                }
              });
              if (column.dataIndex == 'questionMainCondition') {
                column.width = 300;
              }
              if (column.dataIndex == 'scheduling' && steps.value.length > 0) {
                let arr = [];
                steps.value.map((step, i) => {
                  let newColumn = {
                    title: step,
                    dataIndex: column.dataIndex + i,
                  };
                  console.log(newColumn);
                  arr.push(newColumn);
                });
                column.children = arr;
              }
              if (column.dataIndex in steps.value) {
                console.log('column:::', column);
                console.log('steps:::', steps.value);
                // 判断是否所有 desc 描述均为空，若为空则合并表头展示
                if (steps.value[column.dataIndex].every((obj) => obj.desc === '')) {
                  console.log('--->', index);
                  column.colSpan = steps.value[column.dataIndex].length;
                  let arr = [];
                  // 将所有需要合并的子表头处理成对象数组映射
                  steps.value[column.dataIndex].map((el, idx) => {
                    return arr.push({
                      title: column.title,
                      dataIndex: column.dataIndex + '_' + idx,
                      colSpan: idx === 0 ? steps.value[column.dataIndex].length : 0,
                      exportKey: JSON.parse(JSON.stringify(column.dataIndex)),
                    });
                  });
                  stepsColumns.value[column.dataIndex] = arr;
                } else {
                  let arr = [];
                  // 将所有需要分组展示的子表头处理成对象数组映射
                  steps.value[column.dataIndex].map((el, idx) => {
                    return arr.push({ title: el.desc, dataIndex: column.dataIndex + '_' + idx });
                  });
                  column.children = arr;
                }
              }
              // else{
              //     column.width = 300
              // }

              // console.log('currentLabel', currentLabel)
              // column.title = currentLabel != undefined? currentLabel : column.title
              return column;
            }
          })[0];
        });
        //过滤空值
        columns = columns.filter((column) => column != undefined);
        let otherColumns = rawData.columns.filter((el) => el.otherField);
        columns = [...columns, ...otherColumns];
        console.log('stepsColumns:::', stepsColumns.value);
        console.log('columns:::', columns);
        // 处理合并表头，找到原表结构需要插入部分，进行插入合并处理
        for (let key in stepsColumns.value) {
          const n = columns.findIndex((column) => column.dataIndex == key);
          Array.prototype.splice.apply(columns, [n, 1].concat(stepsColumns.value[key]));
        }
        console.log('final--columns:::', columns);
        finalColumns.value = columns;
        setProps({ scroll: { x: 300 + (columns.length - 1) * 200 }, columns: columns });
        // 设置columns
        // setColumns(columns)
        // setCacheColumns(columns)

        setTimeout(() => {
          setProps({ showTableSetting: true });
        }, 1000);

        rawData.dataSource.map((item) => {
          for (let key in steps.value) {
            if (item.hasOwnProperty(key)) {
              let arr = item[key].split(';');
              steps.value[key].map((el, index) => {
                item[key + '_' + index] = arr[index];
              });
            }
            if (item.children && item.children.length > 0) {
              item.children.map((el) => {
                if (el.hasOwnProperty(key)) {
                  let arr = el[key].split(';');
                  steps.value[key].map((els, index) => {
                    el[key + '_' + index] = arr[index];
                  });
                }
                return el;
              });
            }
          }
          return item;
        });
        console.log('--rawData--', rawData);

        // if (steps.value.length > 0) {
        //   return rawData.dataSource.map((item) => {
        //     const arr = item.scheduling.split(';');
        //     steps.value.map((step, i) => {
        //       item['scheduling' + i] = arr[i];
        //     });

        //     if (item.children) {
        //       item.children = item.children.map((item1) => {
        //         steps.value.map((step, i) => {
        //           item1['scheduling' + i] = arr[i];
        //         });
        //         return item1;
        //       });
        //     }
        //     return item;
        //   });
        // }
      },
      // showTableSetting: true,
    },
  });

  // if (item.children == undefined) {
  //                         const arr = item.scheduling.split(';');
  //                         steps.value.map((step, i) => {
  //                             item['scheduling' + i] = arr[i]
  //                         })
  //                         return item
  //                     }else{
  //                         item.children.map(item1=>{

  //                         })
  //                     }

  //注册table数据
  const [
    registerTable,
    { reload, setProps, clearSelectedRowKeys, setPagination, setColumns, setCacheColumns, getRawDataSource, getSelectRowKeys },
    { rowSelection, selectedRows, selectedRowKeys },
  ] = tableContext;

  /**
   * 操作栏
   */
  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '发起',
        onClick: handleActive.bind(null, record.supId),
        // popConfirm: {
        //     title: '是否确认发起当前任务？',
        //     confirm: handleActive.bind(null, record.supId),
        // },
        ifShow: () => {
          return record.supStatus == '1' && record.parentId == null && hasPermission('supervise:handleActive');
        },
      },
      {
        label: '查看',
        onClick: toNextPage.bind(null, record, 'detail'),
        ifShow: () => {
          return (
            (record.children == undefined && record.parentId != null) ||
            (record.children != undefined && record.parentId != null && thisRole.value == 'QT')
          );
        },
      },
      {
        label: '编辑',
        color: 'warning',
        onClick: toEdit.bind(null, record),
        ifShow: () => {
          return record.supStatus == '1' && record.parentId == null && hasPermission('supervise:handleActive');
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '是否确认删除？',
          confirm: handleDelete.bind(null, record),
        },
        ifShow: () => {
          return record.supStatus == '1' && record.parentId == null && hasPermission('supervise:handleActive');
        },
      },
    ];
  }

  /**
   * 获取展示字段
   * @param arr {Array} schemas对象数组
   */

  const getKeys = (arr) => {
    const newarr = arr
      .map((item) => {
        if (item.isShow == true) {
          return item.field;
        } else {
          return null; // 不符合条件时返回null或其他自定义值
        }
      })
      .filter(Boolean); // 去除结果中的空值（null）
    return newarr;
  };

  //催办
  const toPush = () => {
    Modal.confirm({
      title: '确定要催办这些任务吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: '若勾选任务中包含草稿、待核定、已完成任务会自动过滤，不会进行催办',
      onOk() {
        pushCase();
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  };

  /**
   * 催办
   * @param supIds {String} 督办数据ids
   * @param templateId {String} 模板id
   */
  const pushCase = () => {
    urgeBatch({ supIds: selectedRowKeys.value.join(','), templateId: templateId.value }).then((res) => {
      clearSelectedRowKeys();
      reload();
    });
  };

  // 方法
  const toNextPage = (record, suffix) => {
    let queryObj = { supId: record.supId, roleCode: thisRole.value };
    if (suffix == 'detail') {
      queryObj.templateId = record.templateId;
    }
    router.push({ path: '/supervise/' + suffix, query: queryObj });
  };

  /**
   * 删除事件
   * @param supId {String} 督办数据id
   * @param templateId {String} 模板id
   */
  async function handleDelete(record) {
    await superviseDel({ supId: record.supId, templateId: record.templateId }).then((res) => {
      reload();
    });
  }

  /**
   * 去编辑
   * @param isUpdate {Boolean} 模板Schema
   * @param supId {String} 督办数据id
   * @param templateId {String} 模板id
   * @param pageSchema {String} 模板Schema
   */
  function toEdit(record) {
    modalShow.value = true;
    setTimeout(() => {
      openModal(true, { isUpdate: true, pageSchema: pageSchema, supId: record.supId, templateId: record.templateId });
    }, 200);
  }

  /**
   * 发起
   * @param supIds {String} 督办数据ids
   * @param templateId {String} 模板id
   */
  function handleActive(supId) {
    console.log('supId', supId);
    Modal.confirm({
      title: '确定要进行该操作吗?',
      icon: createVNode(ExclamationCircleOutlined),
      // content: '若勾选任务中包含草稿、待核定、已完成任务会自动过滤，不会进行催办',
      onOk() {
        const supIds = supId != undefined ? supId : getSelectRowKeys().join(',');
        superviseSendBatch({ templateId: templateId.value, supIds: supIds }).then((res) => {
          reload();
          clearSelectedRowKeys();
        });
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  }

  /**
   * 批量提交/退回
   * @param supIds {String} 督办数据ids
   * @param templateId {String} 模板id
   */
  function handleDeal(type) {
    Modal.confirm({
      title: '确定要批量处理这些任务吗?',
      icon: createVNode(ExclamationCircleOutlined),
      // content: '若勾选任务中包含草稿、待核定、已完成任务会自动过滤，不会进行催办',
      onOk() {
        const fn = type == 1 ? superviseCheckBatch : superviseRejectBatch;
        const supIds = getSelectRowKeys().join(',');
        fn({ templateId: templateId.value, supIds: supIds }).then((res) => {
          reload();
          clearSelectedRowKeys();
        });
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  }

  /**
   * 新建
   * @param isUpdate {Boolean} 模板Schema
   * @param pageSchema {String} 模板Schema
   * @param templateId {String} 模板id
   */
  const toNew = () => {
    modalShow.value = true;
    setTimeout(() => {
      openModal(true, { isUpdate: false, pageSchema: pageSchema, templateId: templateId });
    }, 200);
  };

  //设置弹窗隐藏
  const setModalHidden = (data) => {
    modalShow.value = data;
  };
</script>

<style lang="less" scoped>
  /deep/ .ant-picker {
    width: 100% !important;
  }

  /deep/ .jeecg-basic-table-header__tableTitle > * {
    margin-right: 67px !important;
  }

  /deep/ .ant-btn-background-ghost[disabled],
  .ant-btn-background-rgba(121, 75, 75, 0.25)er {
    color: rgba(0, 0, 0, 0.25) !important;
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
  }

  /deep/ .jeecg-basic-table-header__tableTitle {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  /deep/ .jeecg-basic-table-header__toolbar {
    width: 0px;
  }

  .summary {
    height: 54px;
    background: #fff7e8;
    border: 1px solid #ffd88c;
    border-radius: 4px;
    padding: 11px 10px;
    margin: 10px 0;
    position: relative;
  }

  .warningIcon {
    position: absolute;
    top: 5px;
    left: 25px;
    width: 24px;
    height: 24px;
  }

  .warningTxt {
    margin-left: 58px;
    // font-weight: bolder;
    color: #333333;
    line-height: 32px;
    cursor: pointer;
  }

  .labelTxt {
    // font-weight: bolder;
    // color: #333333;
  }

  .summaryItem {
    width: 200px;
    cursor: pointer;
    transition: 0.5s;
    padding: 4px 8px;
    border-radius: 4px;
  }

  // .summaryItem:nth-of-type(4){
  //     width: auto;
  // }

  // .summaryItem :hover {
  //     background: #000;
  //     border-radius: 4px;
  // }
  .summaryItem:hover {
    background-color: #f8e3bc;
    border-radius: 4px;
    color: white;
  }

  .rolewraps {
    margin: 10px 10px 0;
    background-color: #fff;
    padding: 10px;
  }

  .rolemenus {
    cursor: pointer;
    display: inline-block;
    margin-right: 30px;
  }

  .activeRoleMenu {
    color: blue;
  }
</style>
