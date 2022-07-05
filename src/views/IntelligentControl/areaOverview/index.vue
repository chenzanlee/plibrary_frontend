<template>
  <!-- 大区概览页面 -->
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
            <div class="titlebk">
              <el-dropdown class="drop-parent-limit" @command="dropdownEvent">
                <span class="el-dropdown-link">
                  {{ dropRegions.name }}
                  <i class="el-icon-caret-bottom" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(regin) in regionTree" :key="regin.regionNum" :command="{'value':regin.regionNum, 'name': regin.regionName}">{{ regin.regionName }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="map-list">
            <div class="map-con">
              <china-map
                v-if="flag"
                v-loading="mapLoading"
                :all-list="allList"
                :choose="nameActive"
                :map-data="mapData"
                :region="region"
                :area="area"
                :field="field"
                :params-json="paramsJson"
                :get-map-data="getMapData"
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
import { getUnitEvc } from '@/utils/overtService'

import rankingList from '@/views/IntelligentControl/areaOverview/components/rankingList'
import rankingListCom from '@/views/IntelligentControl/areaOverview/components/rankingListCom'
import rankingListImp from '@/views/IntelligentControl/areaOverview/components/rankingListImp'
import facility from '@/views/IntelligentControl/areaOverview/components/facility'
import facilityMore from '@/views/IntelligentControl/areaOverview/components/facilityMore'
import facilityDetail from '@/views/IntelligentControl/areaOverview/components/facilityDetail'
import chinaMap from '@/views/IntelligentControl/areaOverview/components/map'
export default {
  name: 'AreaOverview',
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
      pageElement: '',
      dataInterface: '',
      headers: '',
      flag: false,
      mapLoading: false, // 地图加载动画
      nameActive: '', // 地图展示的区域
      allList: [], // 地图中hover展示的数据
      paramsJson: {
        regionId: '2',
        areaId: ''
      },
      dropRegions: { // 区域树选中
        name: '南阳',
        value: '2'
      },
      mapData: [], // 地图中颜色变化
      region: '', // 地图中对应区域权限
      area: '', // 地图中对应区域权限
      field: '', // 地图中对应区域权限
      regionTree: [], // 大区树
      onlineData: [], // 在线率
      comfortableData: [], // 舒适度
      rateData: [], // 实施率
      overviewData: {}, // 所有概况
      impRate: 0, // 环控实施概况
      onlineRate: 0, // 环控在线概况
      showImpMsc: '大区已接入智能环控的单元数/大区单元总数',
      showOnLineMsc: '大区已接入智能环控在线单元数/大区已接入环控单元总数'
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
    this.getTree()
    this.isRouterJump()
  },
  mounted() {
    this.init(this.dropRegions.value, this.dropRegions.name)
  },
  beforeDestroy() {

  },
  methods: {
    init(val, name) { // 初始化获取所有
      this.getRegionAreaField()
      this.getAllOverData(val)
      this.getAllLineData(val)
      this.getAllComfortableData(val, name)
      this.getAllImplementData(val)
    },
    isRouterJump() { // 判断处理路由跳转事件
      const data = sessionStorage.getItem('unitDataOverviewRegions') ? JSON.parse(sessionStorage.getItem('unitDataOverviewRegions')) : {}
      if (data && data.name) {
        this.nameActive = data.name
        this.dropRegions.name = data.name
        this.dropRegions.value = data.value
        this.paramsJson.regionId = data.value
      } else {
        const regions = sessionStorage.getItem('unitEvcRegions') ? JSON.parse(sessionStorage.getItem('unitEvcRegions')) : {}
        console.log('🚀 ~ file: index.vue ~ line 175 ~ isRouterJump ~ regions', regions)
        if (regions.value) {
          this.dropRegions = regions
          this.nameActive = regions.name
          this.paramsJson.regionId = regions.value
        }
        sessionStorage.setItem('unitEvcRegions', JSON.stringify(this.dropRegions))
      }
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
    getPowerData(arr) { // 处理权限数组
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
    getTree() { // 获取大区树
      const element = this.pageElement['getRegions']
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
            this.regionTree = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    dropdownEvent(obj) { // 区域树下拉事件
      this.dropRegions = obj
      this.paramsJson = {
        regionId: obj.value,
        areaId: ''
      }
      getUnitEvc({
        regionId: obj.value
      })
      this.init(obj.value, obj.name)
      // this.nameActive = obj.namere
    },
    getAllOverData(par) { // 获取所有概况数据
      const element = this.pageElement['getOverview']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par || ''
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.overviewData = res.data
            this.impRate = res.data && res.data.impRate !== null ? res.data.impRate : 0
            this.onlineRate = res.data && res.data.onlineRate !== null ? res.data.onlineRate : 0
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllLineData(par) { // 获取在线排名
      const element = this.pageElement['getOnlineInfoList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par || ''
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
    getAllComfortableData(par, mapName) { // 获取舒适度排名
      const element = this.pageElement['getComfortInfoList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par || ''
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.comfortableData = res.data
            this.mapLoading = false // 处理地图内数据
            const distributeStats = res.data ? res.data : []
            this.mapData = distributeStats
            this.allList = res.data
            this.nameActive = mapName
            this.flag = true
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllImplementData(par) { // 获取实施排名
      const element = this.pageElement['getImplementationList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par || ''
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
  }
}
</script>
<style scoped>
.el-dropdown-menu {
  max-height: 300px;
  overflow-y: scroll;
}
.el-dropdown-menu__item {
  color: #FFF;
}
</style>
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
        display: flex;
        flex-direction: row;
        justify-content: start;
        .titlebk {
          width: 100%;
          height: 100%;
          text-align: center;
          // background-image: url('~@/assets/image/dataCenter/compOview/titleBk.png');
          background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
          background-position: center;
          span {
            display: inline-block;
            background-image:-webkit-linear-gradient(bottom,#4992FF,#50F2FF);
            font-weight: bold;
            font-size: 1.5rem;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
          }
          .el-icon-caret-bottom{
            font-size: 30px;
          }
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
