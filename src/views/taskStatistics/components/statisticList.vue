<template>
  <div class="statistic">
    <a-row :gutter="24">
      <a-col :md="6" :sm="6" v-for="item in staticList" :key="item.index">
        <div class="item" :style="{ 'backgroundImage': `url(${imgs[item.index].bg})` }">
          <div class="value">{{ item.value }}</div>
          <div class="label">{{ item.label }}</div>
          <div class="icon">
            <img :src="imgs[item.index].icon" alt="">
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { getDataStatistics } from '/@/api/supervise/task'
import TopIcon1 from '/@/assets/images/largeScreen/top-icon-1.png'
import TopBg1 from '/@/assets/images/largeScreen/top-bg-1.png'
import TopIcon2 from '/@/assets/images/largeScreen/top-icon-2.png'
import TopBg2 from '/@/assets/images/largeScreen/top-bg-2.png'
import TopIcon3 from '/@/assets/images/largeScreen/top-icon-3.png'
import TopBg3 from '/@/assets/images/largeScreen/top-bg-3.png'
import TopIcon4 from '/@/assets/images/largeScreen/top-icon-4.png'
import TopBg4 from '/@/assets/images/largeScreen/top-bg-4.png'
import { reactive, ref } from 'vue';
const imgs = reactive({
  0: {
    bg: TopBg1,
    icon: TopIcon1,
  },
  1: {
    bg: TopBg2,
    icon: TopIcon2,
  },
  2: {
    bg: TopBg3,
    icon: TopIcon3,
  },
  3: {
    bg: TopBg4,
    icon: TopIcon4,
  },
})

const staticList = ref(
  [
  {
      value: '0',
      label: '督办总量',
      index: 0,
    },
    {
      value: '0',
      label: '进行中',
      index: 1,
    },
    {
      value: '0',
      label: '已办结',
      index: 2,
    },
    {
      value: '0',
      label: '超期预计',
      index: 3,
    },
  ]
)
  
async function getList() {
  const params = {}

  
 let result = await getDataStatistics()
 staticList.value = result.map(({ name, value }, index) => {
    return {
      value,
      label: name,
      index,
    }
  })
  // getSuperviseSum(params).then((res) => {
  //   if (res.code === 200) {
  //     if (res.result) {
  //       this.staticList = res.result.map(({ name, value }, index) => {
  //         return {
  //           value,
  //           label: name,
  //           index,
  //         }
  //       })
  //     } else {
  //       this.reset()
  //     }
  //   } else {
  //     this.$message.warning(res.message)
  //   }
  // })
}
getList()


function reset() {
  staticList.value = [
    {
      value: '0',
      label: '督办总量',
      index: 0,
    },
    {
      value: '0',
      label: '进行中',
      index: 1,
    },
    {
      value: '0',
      label: '已办结',
      index: 2,
    },
    {
      value: '0',
      label: '超期预计',
      index: 3,
    },
  ]
}

</script>

<style lang='less' scoped>
.statistic {
  padding: 0 25px;
}
.item {
  position: relative;
  text-align: center;
  height: 120px;
  width: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .value {
    position: absolute;
    left: 33px;
    top: 21%;
    font-size: 29px;
    font-weight: bold;
    color: #fff;
  }

  .label {
    position: absolute;
    left: 33px;
    top: 60%;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }
  img {
    width: 100%;
    height: 100%;
  }

  .icon {
    position: absolute;
    top: 50%;
    right: 33px;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 4px;
    padding: 6px;
    background: #fff;
  }
}
</style>