<template>
  <div class="sortbg">
    <div class="title card-bgc-fill">
      <div class="head-title">
        <div class="base-icon" />
        <div>
          <slot name="title">各大区智能环控实施率排名</slot>
        </div>
      </div>
      <div class="sort-icon" @click="doSort" />
    </div>
    <div v-if="this.listData.length" class="main-contain overfolw">
      <!-- <div class="list-container">
        <div class="list-index">1</div>
        <div class="list-name">南阳</div>
        <div class="list-data">100/100</div>
        <div class="list-percentage">100%</div>
      </div> -->
      <div v-for="(item,index) in listData" :key="index">
        <div :class="[ item.onlineRate < 50 ? 'list-container list-container-red' : 'list-container']">
          <div class="list-index">{{ index + 1 }}</div>
          <div class="list-name">{{ item.fieldName }}</div>
          <div class="list-data">{{ item.onlineCount !== undefined ? item.onlineCount : 100 }}/{{ item.totalUnitCount !== undefined ? item.totalUnitCount : 100 }}</div>
          <div class="list-percentage">{{ item.onlineRate }}%</div>
        </div>
      </div>
    </div>
    <div v-else class="main-contain">
      <img
        style="max-width:300px;"
        :src="noData | noDataFile('noData', 'svg')"
        alt="暂无数据"
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    listData: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      noData: null,
      resData: [
        { name: '内蒙古大区', data1: '98', data2: '100', percenter: '98' },
        { name: '海南大区', data1: '91', data2: '100', percenter: '91' },
        { name: '湖北大区', data1: '88', data2: '100', percenter: '88' },
        { name: '四川大区', data1: '78', data2: '100', percenter: '78' },
        { name: '安徽大区', data1: '75', data2: '100', percenter: '75' },
        { name: '江苏大区', data1: '70', data2: '100', percenter: '70' },
        { name: '豫北大区', data1: '66', data2: '100', percenter: '66' },
        { name: '山东大区', data1: '42', data2: '100', percenter: '48' },
        { name: '南阳大区', data1: '20', data2: '100', percenter: '20' },
        { name: '广西大区', data1: '43', data2: '100', percenter: '43' },
        { name: '山西大区', data1: '34', data2: '100', percenter: '34' },
        { name: '京津翼大区', data1: '23', data2: '100', percenter: '23' }
      ],
      isSort: true
    }
  },
  // watch: {
  //   listsData: {
  //     handler(newValue, oldValue) {
  //       this.resData = newValue
  //     },
  //     deep: true
  //   }
  // },
  mounted() {
  },
  methods: {
    // 点击排序
    doSort() {
      this.listData = this.listData.reverse()
    }
  }
}
</script>
<style scoped lang="scss">
  .card-bgc-fill{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // z-index: 10;
}
.sortbg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  font-size: 12px;

}
.main-contain{
  box-sizing: border-box;
  padding-top: 10px;
  height: 100%;
  width: 100%;
  overflow: scroll;
  img {
    width: 150px;
    margin: 25% 55px;
  }
}
.list-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 1.25rem;
  font-size: .625rem;
}
.list-container-red{
  color: #EB413D;
}
.list-index{
  width: 10%;
  height: 100%;
}
.list-name{
  width: 40%;
  height: 100%;
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
}
.list-data{
  width: 30%;
  height: 100%;
}
.list-percentage{
  width: 20%;
  height: 100%;
}
.title {
  width: 100%;
  height: 2.25rem;
  // border-bottom: .125rem solid #303A8E;
  border-bottom: .125rem solid;
  @include border_bottom_color('viewBorderColor1');
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap:wrap;
  align-items: center;
  box-sizing: border-box;
  color: #cdd8f7;
  font-size: .75rem;
  font-weight: 800;
  background-image: -webkit-linear-gradient(top,#BAEAFF,#509DFF);
  @include background_image('control_title_con');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
  font-weight: bold;
}
.sort-icon{
  width: .75rem;
  height: .75rem;
  background: url('~@/assets/image/cleanProduct/sortIcon.svg') no-repeat center center;
  background-size: contain;
  cursor: pointer;
}
.head-title{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.base-icon{
  width: .75rem;
  height: .75rem;
  margin-right: .3rem;
  background: url('~@/assets/image/dataBase.png') no-repeat center center;
  background-size: contain;
}
</style>
