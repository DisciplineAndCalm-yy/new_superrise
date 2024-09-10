<template>
  <div class="scorll-list">
    <div class="scorll-table">
      <div class="header">
        <div class="th"  v-for="item in columns" :key="item.key" :style="`flex: ${item.flex || 1}`">{{ item.title }}</div>
      </div>
      <vue3-seamless-scroll :list="dataSource" class="scroll" hover :step="0.3">
        <div class="body">
          <div class="tr" v-for="row,index in dataSource" :key="row.key">
            <div class="td" v-for="item in columns" :key="`${row.key}-${item.key}`" :style="`flex: ${item.flex || 1}`">
              <span class="rank" v-if="item.dataIndex === 'rank'">
                <img v-if="index <= 2" :src="imgs[index]" alt="">
                <span v-else>{{ index + 1}}</span>
              </span>
              <span v-else :title="row[item.dataIndex]">
                {{ row[item.dataIndex] }}
              </span>
            </div>
          </div>
        </div>
      </vue3-seamless-scroll>
    </div>
  </div>
</template>

<script lang='ts' setup>
// import { getImportantWork } from '/@/api/businessScreen/businessScreen'
import { ref, computed, unref, watch } from 'vue';
import First from '/@/assets/images/largeScreen/first.png'
import Second from '/@/assets/images/largeScreen/second.png'
import Third from '/@/assets/images/largeScreen/third.png'

const props = defineProps(['list'])
const imgs = [First,Second,Third]

const dataSource = ref([
  { rank: 1, name1: 'dgewon1', score: 80},
  { rank: 2, name1: 'dgewon2', score: 80},
  { rank: 3, name1: 'dgewon3', score: 80},
  { rank: 4, name1: 'dgewon4', score: 80},
  { rank: 5, name1: 'dgewon5', score: 80},
])

const columns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank',
    flex: 1,
  },
  {
    title: '牵头单位',
    dataIndex: 'departName',
    key: 'departName',
    flex: 1,
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score',
    flex: 1,
  },
]

async function init() {
  dataSource.value =  []
}

watch(
  props,
  () => {
    console.log('propssssss变化乐',props.list)
    dataSource.value = props.list
  }
)
</script>

<style lang='less' scoped>
.scorll-list {
  height: 100%;
  position: relative;
  .scorll-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .header {
      display: flex;
      align-items: center;
      font-family: Microsoft YaHei;
      font-weight: bold;
      height: 36px;
      font-size: 14px;
      background: #EEEDF2;
      .th {
        height: 100%;
      }
    }
    .body {
      .tr {
        display: flex;
        box-sizing: border-box;
        background: #fff;
        padding-bottom: 6px;
        background-clip: content-box;
        border-bottom: 1px solid #eeedf2;
      }
      .tr:nth-child(even) {
        // background: rgba(0, 162, 255, 0.1);
      }
      .tr:nth-child(odd) {
        // background: #021b8c;
      }
      // .tr:nth-child(1) {
      //   .rank {
      //     > span {
      //       width: 37px;
      //       height: 30px;
      //       border: none;
      //     }
      //   }
      // }
      .td {
        padding: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        // color: #FFFFFF;
        line-height: 1;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rank {
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          > span {
            width: 25px;
            height: 25px;
            border: 2px solid #1890ff;
            display: inline-block;
            border-radius: 50px;
            line-height: 20px;
            font-weight: 600;
            color: #1890ff;
            text-align: center;
          }
        }
      }
    }
    .th,
    .td {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}
</style>