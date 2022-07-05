<template>
  <!-- 集团概览页面 -->
  <div class="main">
    <article class="container">
      <div class="con-left">
        <div class="con-left-1 public-style">
          <facility :tip-title="showImpMsc" :list-data="impRate" :name="name1">
            <div slot="title"><span>环控实施概况</span></div>
            <div slot="name"><span>单元实施率</span></div>
          </facility>
        </div>
        <div class="con-left-2 public-style">
          <facility :tip-title="showOnLineMsc" :list-data="onlineRate" :name="name2">
            <div slot="title"><span>环控在线概况</span></div>
            <div slot="name"><span>单元在线率</span></div>
          </facility>
        </div>
        <div class="con-left-3 public-style">
          <facility-more :list-data="overviewData">
            <div slot="title"><span>单元舒适度概况</span></div>
          </facility-more>
        </div>
        <div class="con-left-4 public-style">
          <facility-detail :list-data="overviewData">
            <div slot="title"><span>设备概况</span></div>
          </facility-detail>
        </div>
      </div>
      <div class="con-center">
        <div class="inner">
          <div class="center-top">
            <div class="center-top-l">
              <div class="center-top-title">已实施环控的场区(个)</div>
              <div class="center-top-num">
                <div class="c-t-n-con">
                  <div v-for="(value, i) in showNum" :key="i" class="c-t-n-con-f">{{ value }}</div>
                </div>
              </div>
            </div>
            <div class="center-top-c" />
            <div class="center-top-r">
              <div class="center-top-title">场区实施率(%)</div>
              <div class="center-top-num">
                <div class="c-t-n-con-r">
                  <div v-for="(value, i) in showPer" :key="i" class="c-t-n-con-f">{{ value }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="map-list">
            <div class="map-con">
              <china-map
                v-if="flag"
                :map-data="mapData"
                :all-list="allList"
                :params-json="paramsJson"
                :region="region"
                :area="area"
                :field="field"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="con-right">
        <div class="con-right-1 public-style">
          <ranking-list-imp :list-data="rateData" />
        </div>
        <div class="con-right-1 public-style">
          <ranking-list :list-data="onlineData">
            <div slot="title">
              各大区智能环控在线排名
            </div>
          </ranking-list>
        </div>
        <div class="con-right-1 public-style">
          <ranking-list-com :list-data="comfortableData">
            <div slot="title">
              各大区单元舒适度排名
            </div>
          </ranking-list-com>
        </div>
      </div>
    </article>
  </div>
</template>
<script>
import { getConfigElement } from '@/utils/overtService'

import rankingList from '@/views/IntelligentControl/groupOverview/components/rankingList'
import rankingListCom from '@/views/IntelligentControl/groupOverview/components/rankingListCom'
import rankingListImp from '@/views/IntelligentControl/groupOverview/components/rankingListImp'
import facility from '@/views/IntelligentControl/groupOverview/components/facility'
import facilityMore from '@/views/IntelligentControl/groupOverview/components/facilityMore'
import facilityDetail from '@/views/IntelligentControl/groupOverview/components/facilityDetail'
import chinaMap from '@/views/IntelligentControl/groupOverview/components/map'
export default {
  name: 'GroupOverview',
  components: {
    rankingList,
    rankingListCom,
    rankingListImp,
    facility,
    facilityMore,
    facilityDetail,
    chinaMap
  },
  data() {
    return {
      name1: '实施率',
      name2: '在线率',
      flag: false,
      pageElement: [],
      headers: '',
      dataInterface: [],
      allList: [], // 地图中判断？
      region: '',
      area: '',
      field: '',
      paramsJson: {
        regionId: '',
        areaId: ''
      }, // 地图中判断
      nameActive: '', // 地图中更换区域传入的区域
      mapData: [], // 地图中判断？
      onlineData: [], // 在线率
      comfortableData: [], // 舒适度
      rateData: [], // 实施率
      overviewData: {}, // 所有概况
      showNum: [], // 已实施环控的场区(个)
      showPer: [], // 实施率(%)
      impRate: 0, // 环控实施概况
      onlineRate: 0, // 环控在线概况
      showImpMsc: '集团已接入智能环控的单元数/集团单元总数',
      showOnLineMsc: '集团已接入智能环控在线单元数/集团已接入环控单元总数'
    }
  },
  watch: {

  },

  created() {
    this.headers = {
      appCode: 'unit-evc',
      Authorization: localStorage.getItem('TOKEN'),
      'X-Requested-With': 'XMLHttpRequest'
    }
    this.pageElement = getConfigElement('dataView')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
    // this.commonElement = getConfigElement('clean-produceDataInterface')
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {

  },
  methods: {
    init() { // 初始化获取所有
      this.getAllOverData()
      this.getAllLineData()
      this.getAllComfortableData()
      this.getAllImplementData()
      this.getRegionAreaField()
    },
    getRegionAreaField() { // 获取用户所有的权限
      const dataInterface = this.dataInterface['getRegionAreaFieldTree']
      this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri,
        payload: {},
        callback: data => {
          const obj = this.getPowerData(data.data)
          this.region = obj.region
          this.area = obj.area
          this.field = obj.field
        }
      })
    },
    getPowerData(arr) {
      const regions = []; const areas = []; const fields = []
      arr.forEach(region => {
        regions.push(region.value)
        if (region.children) {
          region.children.forEach(area => {
            areas.push(area.value)
            if (area.children) {
              area.children.forEach(field => {
                fields.push(field.value)
              })
            }
          })
        }
      })
      return { region: regions, area: areas, field: fields }
    },
    getMapData() { // 地图内部点击事件

    },
    formatShowNumber(params) { // 格式化显示数字
      let tmpArr = []
      if (!params) {
        tmpArr = ['-', '-']
        return tmpArr
      }
      tmpArr = params.toString().split('')
      return tmpArr
    },
    getAllOverData() { // 获取所有概况数据
      const element = this.pageElement['getOverview']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.overviewData = res.data
            this.showNum = this.formatShowNumber(res.data.impFieldCount)
            this.showPer = this.formatShowNumber(res.data.impFieldRate)
            this.impRate = res.data && res.data.impRate !== null ? res.data.impRate : 0
            this.onlineRate = res.data && res.data.onlineRate !== null ? res.data.onlineRate : 0
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllLineData() { // 获取在线排名
      const element = this.pageElement['getOnlineInfoList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.onlineData = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllComfortableData() { // 获取舒适度排名
      const element = this.pageElement['getComfortInfoList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.flag = true
            this.comfortableData = res.data
            this.allList = res.data // 获取地图中hover内容
            const distributeStats = res.data ? res.data : []
            this.mapData = distributeStats
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllImplementData() { // 获取实施排名
      const element = this.pageElement['getImplementationList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.rateData = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    }
  //   getMapData(mapName, mapType, params) { // 地图内部点击事件
  //     const that = this
  //     that.paramsJson = params
  //     that.mapLoading = true
  //     this.$httpRequest({
  //       type: 'post',
  //       uri: '/dashboard/dataView/getComfortInfo',
  //       payload: params,
  //       callback: mapData => {
  //         that.mapLoading = false
  //         const distributeStats = mapData.data ? mapData.data : []
  //         that.mapData = distributeStats
  //         that.allList = mapData.data
  //         that.nameActive = mapName
  //         this.flag = true
  //       }
  //     })
  //   },
  }
}
</script>
<style lang="scss" scoped>
 .main{
   width: 100%;
   height: calc(100vh - 128px);
   color: #fff;
   font-size: .75rem;
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .con-left{
      height: 100%;
      width: 22.78%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .con-left-1{
        width: 100%;
        height: 20.08%;
      }
      .con-left-2{
        width: 100%;
        height: 20.08%;
      }
      .con-left-3{
        width: 100%;
        height: 34.02%;
      }
      .con-left-4{
        width: 100%;
        height: 19.47%;
      }
    }
    .con-center{
      height: 100%;
      width: 58.99%;
      .inner{
        height: 100%;
        width: 100%;
      }
      .center-top{
        height: 11%;
        width: 100%;
        // color: #fff;
        @include font_color('mainFontColor2');
        display: flex;
        flex-direction: row;
        justify-content: start;
        .center-top-title{
          width: 100%;
          height: 30%;
          font-size: 1rem;
        }
        .center-top-num{
          width: 100%;
          height: 70%;
          .c-t-n-con{
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            // justify-content: center;
          }
          .c-t-n-con-r{
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            // justify-content: center;
          }
          .c-t-n-con-f{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 2.875rem;
            font-size: 2.25rem;
            font-weight: 700;
            margin-right: .875rem;
            // background: linear-gradient(180deg, rgba(81,137,255, 1) 0%,rgba(8,20,62, 0) 100%);
            // @include background_color('viewBackGround2');
            @include background_color1("viewBackGround2");
            @include font_color('mainFontColor2');
          }
        }
        .center-top-l{
          margin-left: 1.25rem;
          width: 40%;
          height: 100%;
        }
        .center-top-c{
          width: 3px;
          height: 100%;
          background: #142e74;
          margin-left: 1.25rem;
          margin-right: 1.25rem;
        }
        .center-top-r{
          width: 50%;
          height: 100%;
        }
      }
      .map-list{
        height: 89%;
        width: 100%;
        .map-con{
          height: 100%;
          width: 100%;
          // border: .0625rem solid pink;
        }
      }
    }
    .con-right{
      height: 100%;
      width: 18.23%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .con-right-1{
        width: 100%;
        height: 31.66%;
      }
    }
  }
 }
 .public-style{
    // background: rgba(28,28,95,0.2);
    @include background_color('viewBackGround');
    padding: .625rem;
    // border: .0625em solid #6498ff;
    border: .0625em solid;
    @include border_color('viewBorderColor');
    border-radius: .25em;
    // box-shadow: 0px 0px .9375em 0px #1c63ff inset;
    @include box_shadow('viewBoxShadow');
 }
</style>
