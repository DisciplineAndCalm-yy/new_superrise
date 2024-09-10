<template>
  <div>
    <div class="task-text">督办承办单位任务分布</div>
    <div ref="chartRef" autoresize class="charts-pie"></div>
    <div class="empty" v-if="isEmpty">
      <a-empty />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useECharts } from '/@/hooks/web/useECharts';
import { ref, Ref, reactive, watchEffect, watch } from 'vue';
import { getDepartStatistics } from '/@/api/supervise/task'


const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);

const chartData = ref([
  { value: '12', name: '一个' },
  { value: '13', name: '一个2' },
  { value: '15', name: '一个4' },
  { value: '15', name: '一个6' },
  { value: '15', name: '一个7' },
])
const isEmpty = ref(false)
const option = reactive({
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      //x轴文字的配置
      show: true,
      interval: 0,
      textStyle: {
        color: 'rgba(102, 102, 102,1)',
      },
    },
  },
  yAxis: {
    type: 'value',
    interval: 15,
    axisLabel: {
      //y轴文字的配置
      textStyle: {
        color: 'rgba(189, 189, 189,1)',
        margin: 25,
      },
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '6%',
    right: '6%',
    // bottom: data.length <= 4 ? '5%' : '8%',
    top: '30px',
    containLabel: true,
  },
  series: [
    {
      type: 'line',
      radius: '50%',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgb(185, 225, 255)' },
            { offset: 1, color: 'rgb(255, 255, 255)' },
          ],
          global: false // 缺省为 false
        }
      },
      itemStyle: {
        color: '#018ffb', //小圆点和线的颜色
      },
      smooth: 'true', // true为弯曲的线
      symbol: 'circle', // 小圆点实心
      symbolSize: 7, // 小圆点的大小
    },
  ],
  dataZoom: [],
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
  let result = await getDepartStatistics()
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
  const dataZoom = []
  if (chartData.value.length > 4) {
    dataZoom.push({
      show: true,
      realtime: true,
      height: 10,
      bottom: 0,
      start: 0,
      end: (4 / chartData.value.length) * 100,
      minSpan: (4 / chartData.value.length) * 100,
      maxSpan: (4 / chartData.value.length) * 100,
      textStyle: {
        color: "rgba(0, 0, 0, 0)"
      },
      dataBackground: {
        areaStyle: {
          opacity: 0
        },
        lineStyle: {
          opacity: 0
        }
      },
      selectedDataBackground: {
        areaStyle: {
          opacity: 0
        },
        lineStyle: {
          opacity: 0
        }
      },
      fillerColor: "#C5E6FF",
      backgroundColor: "#E8EFFF",
      borderColor: "rgba(210, 219, 238, 0)",
      handleStyle: {
        opacity: 0
      },
    })
    option.dataZoom = dataZoom
  }
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