<template>
  <div class="echarts">
    <el-drawer
      title="更多信息"
      :append-to-body="true"
      :visible.sync="drawer"
      size="500px"
      direction="rtl"
    >
      <div class="top5">
        <facility v-loading="faciliytLoading" :list="top5List" />
      </div>
      <div v-loading="isLoading" class="weather-condition">
        <div class="weather-condition-title">
          <div class="condition">天气状况</div>
          <div class="orderWeather" @click="off=!off">定制天气</div>
        </div>
        <div v-if="allWeatherList.length>0" class="weather-condition-list overfolw">
          <div v-for="(weather, index) in allWeatherList" :key="index" class="weather-condition-item">
            <div class="area">
              {{ weather.companyname || weather.companyName }}
            </div>
            <div class="weather-icon">
              <img :src="weatherIcons(weather.weather)">
            </div>
            <div class="weather-text">
              {{ weather.weather }}
            </div>
            <div class="weather-item">
              <svg-icon class="temperatureIcon" icon-class="temperature" fill="#10EA8E" />温度：{{ weather.lowertemp }} ~ {{ weather.lowertemp }}°c
            </div>
            <div class="weather-item">
              <svg-icon class="humidityIcon" icon-class="humidity" fill="#10EA8E" />湿度：{{ weather.humidity || "- -" }}%
            </div>
            <div class="weather-item">
              <svg-icon class="windIcon" icon-class="wind" fill="#10EA8E" />风力：{{ weather.windlevel || weather.windLevel }}
            </div>
          </div>
        </div>
        <div v-else class="nodata">
          <img :src="noData | noDataFile('noData', 'svg') " alt="">
        </div>
      </div>
    </el-drawer>
    <div class="allContent">
      <div class="mapContent">
        <mapChina
          v-if="flag"
          v-loading="faciliytLoading"
          :all-list="allList"
          :weather-all="[]"
          :weather-all-list="[]"
          :choose="nameActive"
          :map-data="mapData"
          :region="region"
          :area="area"
          :field="field"
          :params-json="paramsJson"
          :get-map-data="getMapData"
        />
      </div>
      <div class="right">
        <div class="moreIcon">
          <div class="moreButton" @click="drawer=true">
            <img src="../../../../assets/image/more.svg">更多信息
          </div>
        </div>
        <div class="topNumber">
          <div class="topLi">
            <div class="topLiCon">
              <div class="mapIconbg">
                <svg-icon class="mapIcon" icon-class="map-total" fill="#CDD8F7" />
              </div>
              <div class="numNam">
                <span>{{ topJson.bindedNum || 0 }}</span>
                <span>总数</span>
              </div>
            </div>
          </div>
          <div class="topLi">
            <div class="topLiCon">
              <div class="mapIconbg">
                <svg-icon class="mapIcon" icon-class="map-online" fill="#CDD8F7" />
              </div>
              <div class="numNam">
                <span>{{ topJson.onlineNum || 0 }}</span>
                <span>在线</span>
              </div>
            </div>
          </div>
          <div class="topLi">
            <div class="topLiCon">
              <div class="mapIconbg">
                <svg-icon class="mapIcon" icon-class="map-outline" fill="#CDD8F7" />
              </div>
              <div class="numNam">
                <span>{{ topJson.offlineNum || 0 }}</span>
                <span>离线</span>
              </div>
            </div>
          </div>
          <div class="topLi">
            <div class="topLiCon">
              <div class="mapIconbg">
                <svg-icon class="mapIcon" icon-class="map-warn" fill="#CDD8F7" />
              </div>
              <div class="numNam">
                <span style="color:#FF2727;">{{ topJson.warnNum || 0 }}</span>
                <span>报警</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <delog :off="off" :attention-all-list="attentionAllList" @setStatus="setStatus" />
  </div>
</template>
<script>
import mapChina from '../components/map.vue'
import facility from '../components/Facility.vue'
import delog from '../components/customizationWeather'
import { getConfigElement } from '@/utils/overtService'
import weatherService from '@/lib/service/weather-service'

export default {
  name: 'Echarts',
  components: {
    mapChina,
    facility,
    delog
  },
  data() {
    return {
      noData: '',
      pageElement: [], // 页面权限数组
      dataInterface: [], // 数据接口权限数组
      drawer: false,
      flag: false,
      region: '',
      area: '',
      field: '',
      mapName: '地图名字',
      isLoading: true,
      faciliytLoading: true,
      nameActive: '', // 展示地图区域名
      mapData: [], // 地图数据
      top: 0,
      paramsJson: {
        regionId: '',
        areaId: ''
      },
      attentionAllList: [], // 用户定制天气的场区
      allList: [], // 所有地区设备信息
      allWeatherList: [
        {
          companyname: '',
          lowertemp: '',
          hightemp: '',
          windlevel: '',
          weather: '',
          humidity: ''
        }
      ],
      off: false,
      top5List: [],
      attentionList: [],
      timeHeight: null,
      topJson: {
        totalNum: '',
        onlineNum: '',
        offlineNum: '',
        warnNum: '',
        bindedNum: ''
      }
    }
  },
  watch: {
  },
  created() {
    // 当前页面的元素权限
    this.pageElement = getConfigElement('devicesDistributedMap')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
    // console.log('ccccccccccccccccccccccccc', this.pageElement)
    // console.log('ddddddddddddddddddddddddd', this.dataInterface)
  },
  mounted() {
    this.getAttentionList(this.paramsJson) // 获取天气列表信息
    this.getAllDviceMess(this.paramsJson) // 获取所有设备状态信息
    this.getRegionAreaField()
  },
  beforeDestroy() {},
  methods: {
    getRegionAreaField() {
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
    weatherIcons(weather) {
      return weatherService.getWeatherImg(weather)
    },
    returnRand() {
      return Math.random() * 100
    },
    // getConfigElement(pageName) {
    //   if (localStorage.info && localStorage.info !== 'undefined') {
    //     // const elements = JSON.parse(localStorage.info);
    //     const elements = areaData
    //     const pageElement = {}
    //     if (elements.status === 2100003) {
    //       resetLocal()
    //       window.location.reload()
    //     } else if (elements && !elements.elements) {
    //       resetLocal()
    //       window.location.reload()
    //     } else {
    //       elements.elements.forEach((item) => {
    //         if (item.code.split(':')[0] === pageName) {
    //           pageElement[item.code.split(':')[1]] = item
    //         }
    //       })
    //       return pageElement
    //     }
    //   } else {
    //     return {}
    //   }
    // },
    getMapData(mapName, mapType, params) {
      const element = this.pageElement['getDeviceStats']
      const that = this
      that.paramsJson = params
      this.getAttentionList(this.paramsJson) // 获取天气列表信息
      that.faciliytLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: mapData => {
          that.faciliytLoading = false
          this.flag = true
          const distributeStats = mapData.data && mapData.data.distributeStats ? mapData.data.distributeStats : []
          that.mapData = distributeStats
          that.allList = mapData.data.distributeStats
          that.top5List = mapData.data.distributeStats
          that.topJson = mapData.data.stats
          that.nameActive = mapName
        }
      })
      // getDeviceStats(params).then((mapData) => {
      //   that.faciliytLoading = false
      //   this.flag = true
      //   const distributeStats = mapData.data && mapData.data.distributeStats ? mapData.data.distributeStats : []
      //   that.mapData = distributeStats
      //   that.allList = mapData.data.distributeStats
      //   that.top5List = mapData.data.distributeStats
      //   that.topJson = mapData.data.stats
      //   that.nameActive = mapName
      // })
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
    setStatus() {
      this.allWeatherList = []
      this.getAttentionList()
    },
    async getAttentionList() {
      const that = this
      let allWeather = []
      that.allWeatherList = []
      that.attentionList = []
      that.isLoading = true
      const dataInterface = this.dataInterface['getAllSubCompanyWeather']
      await this.$httpRequest({
        type: dataInterface.method,
        uri: dataInterface.uri,
        payload: that.paramsJson,
        callback: data => {
          // console.log('🚀 ~ file: chineseMap.vue ~ line 298 ~ getAttentionList ~ data', data)
          for (var item in data) {
            if (data[item].length !== 0) {
              allWeather = allWeather.concat(data[item])
              that.allWeatherList = allWeather
            }
          }
        }
      }, true)
      const element = this.pageElement['getUserConcernAreas']
      await this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: that.paramsJson,
        callback: data => {
          console.log('🚀 ~ file: chineseMap.vue ~ line 313 ~ getAttentionList ~ data', data)
          that.attentionAllList = data.data
          for (var j = 0; j < data.data.length; j++) {
            that.attentionList.push(data.data[j].subcompanyName)
          }
          let allWeatherAgency = []
          if (that.attentionList.length === 0) {
            allWeatherAgency = allWeather
            that.allWeatherList = allWeatherAgency
          } else {
            allWeather.map(item => {
              if (that.attentionList.indexOf(item.companyname) !== -1) {
                allWeatherAgency.push(item)
              }
            })
          }
          that.allWeatherList = allWeatherAgency
          that.isLoading = false
        }
      })
      // await attentionArea(that.paramsJson).then((data) => {
      //   that.attentionAllList = data.data
      //   for (var j = 0; j < data.data.length; j++) {
      //     that.attentionList.push(data.data[j].subcompanyName)
      //   }
      //   let allWeatherAgency = []
      //   if (that.attentionList.length === 0) {
      //     allWeatherAgency = allWeather
      //     that.allWeatherList = allWeatherAgency
      //   } else {
      //     allWeather.map(item => {
      //       if (that.attentionList.indexOf(item.companyname) !== -1) {
      //         allWeatherAgency.push(item)
      //       }
      //     })
      //   }
      //   that.allWeatherList = allWeatherAgency
      //   that.isLoading = false
      // })
    },
    getAllDviceMess() {
      const element = this.pageElement['getDeviceStats']
      const that = this
      this.faciliytLoading = true
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: that.paramsJson,
        callback: data => {
          this.faciliytLoading = false
          this.flag = true
          this.allList = data.data.distributeStats
          this.top5List = data.data.distributeStats
          this.topJson = data.data.stats
          const distributeStats = data.data && data.data.distributeStats ? data.data.distributeStats : []
          this.mapData = distributeStats
        }
      })
      // getDeviceStats(that.paramsJson).then((data) => {
      //   this.faciliytLoading = false
      //   this.flag = true
      //   this.allList = data.data.distributeStats
      //   this.top5List = data.data.distributeStats
      //   this.topJson = data.data.stats
      //   const distributeStats = data.data && data.data.distributeStats ? data.data.distributeStats : []
      //   this.mapData = distributeStats
      // })
    }

    // conditionScroll() {
    //   const dom = document.getElementsByClassName('weather-condition-list')[0]
    //   const bgheight = document.getElementsByClassName('condition-list-bg')[0]
    //     .offsetHeight
    //   if (bgheight <= 442) {
    //     return
    //   }
    //   this.timeHeight = setInterval(
    //     function() {
    //       this.top += 1
    //       dom.scrollTop = this.top
    //       if (dom.scrollHeight - dom.scrollTop === 442) {
    //         this.top = 0
    //       }
    //     }.bind(this),
    //     20
    //   )
    // }
  }
}
</script>
<style lang="scss">
.nodata{
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    width: 60%;
  }
}
.condition{
  @include font_color('mainBorderColor18');
}
.mapIconbg{
  @include background_color('mainMapIconBackGroundColor');
}
.moreButton{
  @include font_color('mainFontColor2');
  @include background_color('moreButBkColor');
}
.el-drawer__header{
  padding: 20px;
  background: #173566;
  margin-bottom: 0;
  color: #CDD8F7;
  span:focus{
    outline: 0;
  }
}
.el-drawer__body{
  background: #092148;
  @include background_color('drawerBodyBkColor');
  padding: 20px;
}
.weather-condition-item{
  @include background_color('waBkColor');
}
.area, .weather-text, .weather-item{
  @include font_color('mainFontColor1');
}
</style>
<style type="text/css" scoped>
.allContent {
  display: flex;
  overflow: hidden;
  height: 100%;
}
.mapContent {
  width: 80%;
  min-height: calc(100vh - 186px);
  /* overflow: hidden; */
  /* width: 1000px!important; */
  /* height: 1000px; */
  /* background-color: red; */
}
.top5{
  width: 100%;
  /* height: 30vh; */
  height: 300px;
  margin-bottom: 20px;
}
.moreIcon{
  display: flex;
  justify-content: flex-end;
}
.moreButton{
  padding: 6px 14px;
  font-size: 12px;
  color: #CDD8F7;
  border: 1px solid rgba(205,216,247,0.3);
  border-radius: 15px;
  cursor: pointer;
}
.messHint{
  width: 80%;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #CDD8F7;
  position: absolute;
  bottom: 100px;
}
.mapIconbg{
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.topLi:nth-child(1)>.topLiCon>.mapIconbg{
  /* border:2px solid #0B477D; */
  border: 1px solid rgba(205,216,247,0.3);
  color:  #CDD8F7;
}
.topLi:nth-child(2)>.topLiCon>.mapIconbg{
  /* border:2px solid #0B595D; */
  border: 1px solid rgba(205,216,247,0.3);
  color:  #CDD8F7;
}
.topLi:nth-child(3)>.topLiCon>.mapIconbg{
  /* border:2px solid #0B5276; */
  border: 1px solid rgba(205,216,247,0.3);
  color:  #CDD8F7;
}
.topLi:nth-child(4)>.topLiCon>.mapIconbg{
  /* border:2px solid #4A2D4D; */
  border: 1px solid rgba(205,216,247,0.3);
  color:  #CDD8F7;
}
.topLi:nth-child(5)>.topLiCon>.mapIconbg{
  /* border:2px solid #505C58; */
  border: 1px solid rgba(205,216,247,0.3);
  color:  #CDD8F7;
}
.mapIcon{
  width: 19.4px;
  height:  19.4px;
}
.mapBtm {
  width: 100%;
  height: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 53px;
}
.mapBtmB {
  width: 70%;
  display: flex;
  justify-content: space-around;
}
.colorDiv {
  flex: 1;
  display: flex;
}
.condition-list-bg {
  width: 100%;
  height: auto;
}
.colorDiv > div {
  width: 20px;
  height: 20px;
  background: #163467;
  border-radius: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.colorDiv:nth-child(1) > div {
  background-color: #7FA4E3;
}
.colorDiv:nth-child(2) > div {
  background-color: #004ed2;
}
.colorDiv:nth-child(3) > div {
  background-color: #ead291;
}
.colorDiv:nth-child(4) > div {
  background-color: #d29f11;
}
.colorDiv:nth-child(5) > div {
  background-color: #ff2727;
}
.colorDiv > span {
  font-size: 12px;
  color: #cdd8f7;
}
.mapBtmTop {
  font-size: 14px;
  color: #cdd8f7;
}
.numNam {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* font-family: 'Arial, Verdana, sans'; */
}
.numNam > span:nth-child(1) {
  font-size: 40px;
  line-height: 40px;
  font-family: SofiaPro-Bold;
  font-weight: 600;
  color: #10AEFF;
}
.numNam > span:nth-child(2) {
  font-size: 16px;
  line-height: 26px;
  font-family: SourceHanSansCN-Medium;
  color: #6E83BE;
}
.topIcon {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 50%;
}
.right {
  width: 30%;
}
.topLi {
  flex: 1;
  height: 100%;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}
.topLiCon {
  display: flex;
  height: 100%;
  display: flex;
  align-items: center;
}
.topLi:before {
  content: "";
}
/* .topLi:after {
  content: "";
  width: 1px;
  height: 24px;
  background-color: #6482a2;
} */
.topLi:last-child:after {
  content: "";
  width: 0px;
}
.topNumberPo{
  width: 100%;
  height: 60px;
  /* position: fixed; */
  /* top:100px; */
}
.topNumber {
  position: absolute;
  top: 15%;
  right: 0;
  width: 20%;
  /* margin-right: 100px; */
  height: 70%;
  /* padding-right: 100px; */
  box-sizing: border-box;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.sort {
  width: 404px;
  height: 492px;
  position: absolute;
  right: 0;
  top: 113px;
}
.juSb {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 22px;
  align-items: flex-start;
}
.juSb > span {
  width: 42%;
  display: flex;
  justify-content: flex-start;
}
.app-breadcrumb {
  display: none;
}
.echarts {
  width: 100%;
  height: 100%;
  position: relative;
}
.width {
  width: 300px;
  height: 300px;
}
.condition-list {
  width: 100%;
  height: 88px;
  display: flex;
  flex-direction: row;
  padding-top: 15px;
  box-sizing: border-box;
  padding-right: 10px;
}
.condition-list-i {
  width: 2px;
  height: 9px;
  background-color: #cdd8f7;
  margin-right: 8px;
  margin-top: 3px;
}
.condition-list-li {
  flex: 1;
  height: 100%;
  border-bottom: 1px solid #1a3166;
  box-sizing: border-box;
  font-size: 12px;
  color: #cdd8f7;
  line-height: 18px;
  padding-bottom: 15px;
}
/* 天气样式 */
.weather-condition {
  width: 100%;
}
.weather-condition-title {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 5px;
  margin-top: 40px;
}
.condition {
  font-size: 14px;
  color: #cdd8f7;
  font-weight: bold;
  line-height: 20px;
}
.orderWeather {
  font-size: 14px;
  color: #10aeff;
  line-height: 21px;
  cursor: pointer;
}
.weather-condition-list {
  width: 100%;
  /* height: 70vh; */
  /* height: 100vh-1000px; */
  height: calc(100vh - 455px);
  overflow: auto;
  /* flex: 1; */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.nodata{
  width: 100%;
  height: calc(100vh - 455px);
}
.weather-condition-item {
  width: 31.5%;
  max-height: 200px;
  margin-bottom: 10px;
  padding: 10px 13px;
  background-color: #153361;
  border-radius: 4px;
}
.weather-condition-item:nth-child(3n+2){
  margin-left: 10px;
  margin-right: 10px;
}
.area {
  font-size: 12px;
  color: #CDD8F7;
}
.weather-icon {
  text-align: center;
}
.weatherIcon {
  width: 40px;
  height: 40px;
}
.weather-text {
  color: #CDD8F7;
  text-align: center;
  font-size: 12px;
}
.weather-item {
  color: #CDD8F7;
  font-size: 12px;
  margin: 0 auto;
  margin-top: 10px;
}
.temperatureIcon {
  width: 11px;
  height: 12px;
  margin-right: 5px;
}
.humidityIcon {
  width: 11px;
  height: 12px;
  margin-right: 5px;
}
.windIcon {
  width: 11px;
  height: 12px;
  margin-right: 5px;
}
</style>
