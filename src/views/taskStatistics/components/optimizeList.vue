<template>
  <div class="optimizeList">
    <div class="optimize-item" v-for="(item, index) in getOptimizeList" :key="index">
      <Progress type="circle" :percent="item.value" :format="percent => `${percent}`" :strokeColor="item.value > 90 ? '#87f7c7' : '#eda44e'" :width="65" :strokeWidth=10 />
      <div>{{ item.label }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, reactive, watchEffect, watch, computed } from 'vue';
import { Progress } from 'ant-design-vue';
import { list } from '../../system/dict/dict.api';


const optimizeList = ref([
  {score: 80, departName: '234'},
  {score: 70, departName: '235'},
  {score: 60, departName: '233'},
  {score: 60, departName: '236'},
  {score: 60, departName: '237'},
])
const props = defineProps(['list'])
const getOptimizeList = computed(() => {
  return optimizeList.value.slice(0, 6).map(task => ({
    value: Number(task.score),
    label: task.departName,
  }))
})

watch(
  props,
  () => {
    console.log('propssssss变化乐',props.list)
    optimizeList.value = props.list
  }
)
</script>

<style lang="less" scoped>
.optimizeList {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  row-gap: 10px;
  .optimize-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 130px;
    text-align: center;
    border-radius: 4px;
    background: #f3f7ff;
    .ant-progress {
      margin-bottom: 10px;
    }
  }
}
</style>