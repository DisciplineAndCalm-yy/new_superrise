<template>
  <div class="echarts-box">
    <div class="chartRef" ref="chartRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { useECharts } from '/@/hooks/web/useECharts';
import { getTaskOverview } from '/@/api/businessScreen/businessScreen'
import { ref, Ref, reactive, watchEffect, watch } from 'vue';


const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);


const chartData = ref([])

const option = reactive({
  color: ['#62FFC2','#0084FF', '#FFE400'],
  grid: {
    top: '20%',
    left: '10%',
    height: '60%',
    width: '84%',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      // label: {
      //   backgroundColor: 'rgba(75, 239, 255,.2)',
      // },
    },
    textStyle: {
      color: '#fff'
    },
    borderWidth: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // formatter: '{a0}: {c0}<br />{a1}: {c1}'
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: true,
      lineStyle: {
        color: '#1C4CAB',
      },
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      overflow: 'truncate',
      width: 50,
      interval: 0,
      rotate: 0,
      color: '#fff'
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false,
      color: '#fff'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#1C4CAB',
      },
    },
    max: 'dataMax',
  },
  series: [
    {
      name: '已完成',
      type: 'bar',
      stack: 'total',
      barMinHeight: 5,
      itemStyle: {
        color: '#62FFC2',
        borderWidth: 1,
        borderColor: '#012584',
      },
    },
    {
      name: '执行中',
      type: 'bar',
      stack: 'total',
      barMinHeight: 5,
      itemStyle: {
        color: '#0084FF',
        borderWidth: 1,
        borderColor: '#012584',
      },
    },
    {
      name: '已超期',
      type: 'bar',
      stack: 'total',
      barMinHeight: 5,
      itemStyle: {
        color: '#FFE400',
        opacity: 0,
        decal: {
          symbol: 'none',
        }
      },
      label: {
        opacity: 1,
        color: '#FFE400',
        show: true,
        position: 'insideBottom',
        fontSize: 14,
      }
    },
  ],
  legend: {
    right: '2%',
    textStyle: {
      color: '#fff'
    },
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
    data: [
      {name: '已完成', itemStyle: { color: '#62FFC2', borderWidth: 0 }},
      {name: '执行中', itemStyle: { color: '#0084FF', borderWidth: 0 }},
      {name: '已超期', itemStyle: { color: '#FFE400', opacity: 1 }},
    ]
  },
  aria: {
    enabled: true,
    decal: {
      show: true,
      // decals: {
        // symbol: 'bar',
        // rotation: 10,
      // }
    }
  },
  dataZoom: {
    xAxisIndex: 0,
    type: 'slider',
    show: false,
    height: 10,
    width: '70%',
    left: '15%',
    bottom: '5%',
    start: 0,
    end: 50,
    // backgroundColor: '',
    // fillerColor: 'rgba(0,0,0,0.3)',
  },
  dataset: {
    dimensions: ['supType', 'finish', 'execute', 'alreadyOverdue'],
    source: chartData.value
  }
})


async function init() {
  let res =  await getTaskOverview()
  chartData.value = res || []
  initCharts()
}


function initCharts() {
  // let xAxisData = chartData.value.map(item => item.indicatorName)
  // let s1Data =chartData.value.map(item => item.score)
  // let s2Data =chartData.value.map(item => item.indicatorLevel)
  let maxValue = getMaxOrMinData(chartData.value, 'max', 'total')
  // console.log('max--', max)
  option.yAxis.max = Math.ceil(maxValue + maxValue * 0.1)
  option.dataset.source = chartData.value
  if (chartData.value.length > 5) {
    option.dataZoom.show = true
    option.dataZoom.start = 0
    option.dataZoom.end = 50
  } else {
    option.dataZoom.show = false
    option.dataZoom.start = 0
    option.dataZoom.end = 100
  }
  // option.series[1].data = s2Data
  // option.xAxis.data = xAxisData
  setOptions(option);
}

init()

// 获取data数组中value字段的最大值或最小值 
function getMaxOrMinData(data, type, ...values) {
  if (!data || !data.length) {
    return 0
  }
  let maxOrMin =data[0][values[0]]
  // console.log('初始值',maxOrMin)
  for (let item of data) {
    for (let index in values) {
      // console.log('value', values[index])
      if (type == 'min') {
        if (Number(item[values[index]]) < maxOrMin) {
          maxOrMin = Number(item[values[index]])
        }
      } else {
        if (Number(item[values[index]]) > maxOrMin) {
          maxOrMin = Number(item[values[index]])
        }
      }
    }
  }
  // console.log('max', max)
  return maxOrMin
}

</script>

<style lang="less" scoped>
.echarts-box {
  height: 100%;
  width: 100%;
  .chartRef {
    height: 100%;
    width: 100%;
  }
}
</style>