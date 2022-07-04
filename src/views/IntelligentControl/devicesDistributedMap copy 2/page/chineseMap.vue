<template>
  <div class="echarts">
    <!-- <el-drawer
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
        <div class="weather-condition-list overfolw">
          <div v-for="(weather, index) in allWeatherList" :key="index" class="weather-condition-item">
            <div class="area">
              {{ weather.companyname }}
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
              <svg-icon class="windIcon" icon-class="wind" fill="#10EA8E" />风力：{{ weather.windlevel }}
            </div>
          </div>
        </div>
      </div>
    </el-drawer> -->
    <div class="e-top-h">
      <div class="e-top-h-l">
        <div class="e-t-h-l-c">
          <div class="e-t-h-l-title"><span class="span-1">{{ topJson.onlineFieldNum || 0 }}</span><span class="span-2">在线场区(个)</span></div>
        </div>
        <div class="e-t-h-l-c">
          <div class="e-t-h-l-title"><span class="span-1">{{ topJson.onlineFieldRate || 0 }}</span><span class="span-2">场区在线率(%)</span></div>
        </div>
      </div>
      <div class="e-top-h-m" />
      <div class="e-top-h-r">
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
    <div class="allContent">
      <div class="allcontent-c">
        <div class="mapContent">
          <div class="mapContent-c">
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
        </div>
        <div class="right">
          <div class="moreIcon">
            <!-- <div class="moreButton" @click="drawer=true"> -->
            <div class="moreButton">
            <!-- <img src="../../../../assets/image/more.svg">更多信息 -->
            </div>
          </div>
          <div class="r-h-c">
            <div class="r-h-c-title">设备top5</div>
            <div class="r-h-c-e">
              <facility v-loading="faciliytLoading" :list="top5List" />
            </div>
          </div>
          <div class="r-f-c">
            <div v-loading="isLoading" class="weather-condition">
              <div class="weather-condition-title">
                <div class="condition">天气状况</div>
                <div class="orderWeather" @click="off=!off">定制天气</div>
              </div>
              <div class="weather-condition-list overfolw">
                <el-row v-if="allWeatherList.length > 0" :gutter="10" style="width:100%;margin-left:0;margin-right:0;">
                  <el-col v-for="(weather, index) in allWeatherList" :key="index" :sm="24" :md="12" :lg="8" :xl="8">
                    <div class="weather-condition-item public-style">
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
                  </el-col>
                </el-row>
                <div v-else class="default">
                  <img class="chartImg" :src="noData | noDataFile('noData', 'svg')" alt="暂无数据">
                </div>
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
  computed: {
  },
  watch: {
  },
  created() {
    this.initUrl()
    // 当前页面的元素权限
    this.pageElement = getConfigElement('devicesDistributedMap')
    this.dataInterface = getConfigElement('unit-evcDataInterface')
  },
  mounted() {
    this.getAttentionList(this.paramsJson) // 获取天气列表信息
    this.getAllDviceMess(this.paramsJson) // 获取所有设备状态信息
    this.getRegionAreaField()
  },
  beforeDestroy() {},
  methods: {
    initUrl() {
      this.noData = this.$getImgUrl('noData', 'svg')
    },
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
    }
  }
}
</script>
<style lang="scss">
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
  padding: 20px;
}
</style>
<style lang="scss" scoped>
.allContent {
  display: flex;
  overflow: hidden;
  /* height: 100%; */
  height: calc(100vh - 232px);
}
.allcontent-c{
  /* border: 1px solid red; */
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.mapContent {
  width: 70%;
  height: 100%;
  /* overflow: hidden; */
  /* width: 1000px!important; */
  /* height: 1000px; */
  /* background-color: red; */
}
.mapContent-c{
  height: 100%;
  width: 100%;
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
.r-h-c-title{
  width: 100%;
  height: 10%;
  // color: #CDD8F7;
  @include font_color('mainFontColor11');
  font-size: .875rem;
  font-weight: bold;
}
.r-h-c{
  width: 100%;
  height: 35%;
  /* border: 1px solid blue; */
}
.r-h-c-e{
  width: 100%;
  height: 90%;
}
.r-f-c{
  width: 100%;
  height: 63.2%;
  /* border: 1px solid red; */
  overflow: hidden;
}
.moreButton{
  padding: 6px 14px;
  font-size: 12px;
  color: #CDD8F7;
  /* border: 1px solid rgba(205,216,247,0.3); */
  border-radius: 15px;
  /* cursor: pointer; */
}
// .messHint{
//   width: 80%;
//   height: 18px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 14px;
//   color: #CDD8F7;
//   position: absolute;
//   bottom: 100px;
// }
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
  height: 100%;
  /* border: 1px solid pink; */
}
.topLi {
  width: 25%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
.e-top-h{
  /* height: 8.25rem; */
  height: 6.5rem;
  width: 100%;
  // background: rgba(0, 0, 0, 0.29);
  @include background('mapBackGround');
  padding: .625rem;
  display: flex;
  flex-direction: row;
}
.e-top-h-l{
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.e-t-h-l-c{
  width: 33%;
  height: 100%;
  // color: #ffffff;
  @include font_color('mainFontColor2');
  // background: url('~@/assets/image/IntelligentControl/house.png') no-repeat;
  @include background-image('mapBackGround2');
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.e-t-h-l-title{
  width: 60%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.span-1{
  font-size: 1.625rem;
  font-weight: 600;
}
.span-2{
  font-size: .875rem;
  font-weight: 500;
}
.e-top-h-m{
  width: 2px;
  height: 100%;
  // background: #404f6d;
  @include background('mapBackGround1');
}
.e-top-h-r{
  width: 59.5%;
  height: 100%;
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
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  line-height: 18px;
  padding-bottom: 15px;
}
/* 天气样式 */
.weather-condition {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.weather-condition-title {
  width: 100%;
  /* height: 30px; */
  height: 4.5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 5px;
  margin-top: 8px;
}
.condition {
  font-size: 14px;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
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
  height: 95%;
  overflow-y: auto;
  @include background('mainBackGroundColor');
 }
 .default{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img{width: 300px;}
}
.weather-condition-item {
  min-height: 225px;
  margin-bottom: 10px;
}
.area {
  font-size: 12px;
  // color: #CDD8F7;
  @include font_color('mainFontColor11');

}
.weather-icon {
  text-align: center;
}
.weatherIcon {
  min-width: 40px;
  min-height: 40px;
}
.weather-text {
  // color: #CDD8F7;
  @include font_color('mainFontColor11');
  text-align: center;
  font-size: 12px;
}
.weather-item {
  // color: #CDD8F7;
  @include font_color('mainFontColor11');
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
