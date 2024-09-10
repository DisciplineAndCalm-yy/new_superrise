<template>
  <div>
    <div class="task-text">指标任务分布</div>
    <div ref="chartRef" autoresize class="charts-pie"></div>
    <div class="empty" v-if="isEmpty">
      <a-empty />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useECharts } from '/@/hooks/web/useECharts';
import { ref, Ref, reactive, watchEffect, watch } from 'vue';
import { getTypeStatistics } from '/@/api/supervise/task'

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);

const chartData = ref([
  {value: '12', name: '一个'},
  {value: '12', name: '一个2'},
  {value: '12', name: '一个4'},
])
const isEmpty = ref(false)
const colorList = [
  '#0C96FF',
  '#0057FF',
  '#3900DA',
  '#9C01FB',
  '#D047DC',
  '#F52771',
  '#EF2B4E',
  '#F45F3F',
  '#E89C57',
  '#FDCF2E',
  '#FFE500',
  '#85ED00',
  '#0FD918',
  '#4AF1AB',
  '#14FFF1',
  '#00D1FF',
  '#20A1BD',
  '#0076CF',
  '#FF4E0F',
  '#FF4444',
  '#FFA979',
  '#474C6B',
  '#00617E',
  '#B1A5FF',
]
const option = reactive({
  color: colorList,
  tooltip: {
    trigger: 'item',
  },
  legend: {
    type: 'scroll',
    top: 'center',
    right: '1%',
    itemWidth: 20,
    itemHeight: 8,
    orient: 'vertical', // 默认'horizontal'水平   'vertical'是垂直
    itemGap: 20,
  },
  series: [
    {
      name: '任务分布',
      type: 'pie',
      radius: ['43%', '60%'],
      center: ['30%', '55%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
    },
  ],
  dataset: {
    dimensions: ['name', 'value'],
    source: chartData.value
  }
})


async function getList() {
  // const params = {}

  // if (this.data.length) {
  //   params.startTime = this.data[0]
  //   params.endTime = this.data[1]
  // }
  let result = await getTypeStatistics()
  chartData.value = result || []
  if (result && result.length) {
    isEmpty.value = false
    initChart(result)
  } else {
    isEmpty.value = true
  }
  // getIndicator(params).then((res) => {
  //   if (res.code === 200) {
  //     if (res.result && res.result.length) {
  //       this.isEmpty = false
        // this.initChart(res.result)
  //     } else {
  //       this.isEmpty = true
  //     }
  //   } else {
  //     this.$message.warning(res.message)
  //   }
  // })
}

function initChart(data = []) {
  option.dataset.source = data
  setOptions(option);
}
getList()
</script>

<style lang="less" scoped>
.task-text {
  font-size: 15px;
  line-height: 1em;
  font-weight: 700;
  margin-top: 2px;
  padding-left: 8px;
  border-left: 4px solid #2b65d9;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 30px;
  bottom: 0;
  background: #fff;
}

.charts-pie {
  height: 270px;
}
</style>