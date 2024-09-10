<template>
  <div class="taskStatistics">
    <a-card class="statistics-top">
      <statisticList></statisticList>
    </a-card>
    <div class="statistics-middle">
      <a-card class="middle-card-left">
        <taskDistribute ></taskDistribute>
      </a-card>
      <a-card class="middle-card-right">
        <undertakeUnit></undertakeUnit>
      </a-card>
    </div>
    <div class="statistics-bottom">
      <a-card class="bottom-card-left">
        <statisticsRank v-model:list="list"></statisticsRank>
      </a-card>
      <a-card class="bottom-card-right">
        <optimizeList v-model:list="list"></optimizeList>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import optimizeList from './components/optimizeList.vue';
import statisticList from './components/statisticList.vue';
import statisticsRank from './components/statisticsRank.vue';
import taskDistribute from './components/taskDistribute.vue';
import undertakeUnit from './components/undertakeUnit.vue';
import { beforehandRetain } from '/@/api/supervise/task'
import { ref } from 'vue'

const list = ref([])

async function getList() {
  let result = await beforehandRetain()
  list.value = result.scoreCalcResVOList || []
}
getList()

</script>

<style lang="less" scoped>
.taskStatistics {
  display: flex;
  flex-direction: column;
  .statistics-top {
    margin-top: 12px;
  }
  .statistics-middle {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    width: 100%;
    .middle-card-left {
      width: 40%;
    }
    .middle-card-right {
      margin-left: 12px;
      flex: 1;
    }
  }
  .statistics-bottom {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 12px;
    height: 280px;
    .bottom-card-left {
      height: 100%;
      width: 35%;
    }
    .bottom-card-right {
      height: 100%;
      margin-left: 12px;
      flex: 1;
    }
    :deep(.ant-card-body) {
      height: 100%;
    }
  }
}
</style>