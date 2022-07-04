<template>
  <div class="map">
    <div id="mainMap" v-loading="isLoading" element-loading-text="地图拼命加载中" element-loading-background="transparent" style="height: 100%" />
  </div>
</template>
<script>
// import echarts from 'echarts'
// import geoJson from '@/components/map//myChina.json' // 初始化地图参数
// import mapdata from '@/components/map/mapData.json'
import { getConfigElement } from '@/utils/overtService'
import { debounce } from '@/lib/utils'
// import {
//   getDeviceData
// } from '@/http/api/mapMess'
export default {
  name: 'Echarts',
  props: ['weatherAllList', 'weatherAll',
    'region', 'area', 'field', 'getMapData', 'paramsJson', 'choose', 'mapData'],
  // props:{

  //   },
  data() {
    return {
      pageElement: [], // 页面权限数组
      mapdata: {},
      geoJson: {},
      myMapChart: null,
      height: '',
      width: '',
      isLoading: true
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'choose'(N, O) {
      // this.getMapJson()
      this.getMapDataJson(N, this.mapData)
    },
    'allStyles.flag'(newValue, oldValue) {
      this.chartResize() // 自己绘制echarts的方法
    }
  },
  created() {
    // 当前页面的元素权限
    this.pageElement = getConfigElement('devicesDistributedMap')
    this.getMapJson()
    // this.getMapDataJson()
    //   getDeviceData()
  },
  mounted() {
    // this.height = document.getElementsByClassName('app-main')[0].offsetHeight
    // this.width = document.getElementsByClassName('app-main')[0].offsetWidth * 0.8
    this.width = document.getElementsByClassName('map')[0].offsetWidth
    this.height = document.getElementsByClassName('map')[0].offsetHeight
    setTimeout(() => {
      // this.drawChart('全国', [])
      this.getMapDataJson('全国', [])
    }, 1000)
    window.addEventListener('resize', debounce(this.chartResize, 500))
  },
  beforeDestroy() {},
  methods: {
    chartResize() {
      this.myMapChart && this.myMapChart.resize()
    },
    getMapJson() {
      const element = this.pageElement['getMapMappingData']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: {},
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.mapdata = data.data.content
          }
        }
      })
    },
    getMapDataJson(N, mapData) {
      const element = this.pageElement['getMapData']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: this.paramsJson,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.geoJson = data.data.content
            this.drawChart(N, mapData)
          }
        }
      })
    },
    // 判断是否是公司业务区域
    isCompanyName(name) {
      const region = this.mapdata.region
      const area = this.mapdata.area
      if (name in region || name in area) {
        return true
      } else {
        return false
      }
    },
    // 将报警信息赋值value以便区分颜色显示
    getWarn(regionId, data, name) {
      let value = 0
      if (data && data.length > 0) {
        data.map((item) => {
          if (item.areaCode === regionId) {
            value = item.warnNum ? item.warnNum : 0
          }
        })
      }
      return value
    },
    // 转化鼠标悬浮所需的数据
    initRegionData(regionId, data) {
      const value = {
        'id': regionId,
        'totalNum': 0,
        'onlineNum': 0,
        'offlineNum': 0,
        'troubleNum': 0,
        'warnNum': 0
      }
      if (data && data.length > 0) {
        data.map((item) => {
          if (item.areaCode === regionId) {
            value.totalNum = item.totalNum || 0
            value.onlineNum = item.onlineNum || 0
            value.offlineNum = item.offlineNum || 0
            value.troubleNum = item.troubleNum || 0
            value.warnNum = item.warnNum || 0
          }
        })
      }
      return value
    },

    drawChina(myMapChart, distributeStats, powerRegion, powerArea, powerField) {
      const that = this
      const option = this.initOption()// 初始化绘制全国地图配置
      const d = []
      // const f = []
      // const srt = ['']
      // const statRegionData = distributeStats
      const data = this.geoJson
      // let dataArray = chinaMapData.data.distributeStats;
      that.isLoading = true
      // getDeviceData({}).then((chinaMapData) => {
      const dataArray = this.mapData
      for (let i = 0; i < data.features.length; i++) {
        d.push({
          name: data.features[i].properties.name,
          value: this.isCompanyName(data.features[i].properties.name) ? this.getWarn(data.features[i].properties.regionId, dataArray, data.features[i].properties.name) : -1,
          data: this.initRegionData(data.features[i].properties.regionId, dataArray),
          regionId: data.features[i].properties.regionId || '',
          parentName: data.features[i].properties.parentName || ''
        })
      }
      this.$echarts.registerMap('china', data) // 注册地图
      this.renderMap('china', d, [], option, this.myMapChart)// 绘制地图
    // })
    },
    convertMapJson(data) {
      const { type, features } = data
      const arr = features.filter((item) => {
        return String(item.geometry.type) === 'Polygon' || String(item.geometry.type) === 'MultiPolygon'
      })
      const obj = {
        type: type,
        features: arr
      }
      return obj
    },
    convertPointData(data, values) {
      const { features } = data
      // const { type, features } = data
      const arr = features.filter((item) => {
        return String(item.geometry.type) === 'Point'
      })
      const points = []
      let obj = {}
      arr.map((item) => {
        obj = {
          'name': item.properties.name,
          // 'value': this.getWarn(item.properties.fieldId, values),
          'data': this.initRegionData(item.properties.areaId, values),
          'parentName': item.properties.parentName,
          'value': item.geometry.coordinates.concat(Number(this.initRegionData(item.properties.areaId, values).warnNum)),
          'regionId': item.properties.regionId,
          'areaId': item.properties.areaId
        }
        points.push(obj)
      })
      return points
    },
    convertPointData1(data, values) {
      const { features } = data
      // const { type, features } = data
      const arr = features.filter((item) => {
        return String(item.geometry.type) === 'Point'
      })
      const points = []
      let obj = {}
      arr.map((item) => {
        obj = {
          'name': item.properties.name,
          // 'value': this.getWarn(item.properties.fieldId, values),
          'data': this.initRegionData(item.properties.fieldId, values),
          'parentName': item.properties.parentName,
          'value': item.geometry.coordinates.concat(Number(this.initRegionData(item.properties.fieldId, values).warnNum)),
          'regionId': item.properties.regionId,
          'areaId': item.properties.areaId,
          'fieldId': item.properties.fieldId
        }
        points.push(obj)
      })
      return points
    },
    async drawChart(name, distributeStats) {
      const _this = this
      this.myMapChart = this.$echarts.init(document.getElementById('mainMap'))
      this.myMapChart.clear()
      const region = this.mapdata.region // region对应的文件名(某个大区所有的区域地图文件)
      const area = this.mapdata.area // area对应的文件名(某个区域所有的场区地图文件)
      let option = _this.initOption() // 初始化option

      if (name === '全国') {
        _this.drawChina(this.myMapChart, distributeStats)
      } else if (name in region) {
        option = _this.initOptionMedium()
        const statRegionData = distributeStats
        // await this.getMapDataJson()
        // const data = this.geoJson
        const data_json = this.geoJson
        const data = _this.convertMapJson(data_json)
        // const data = this.geoJson
        // const data = require('@/components/map/region/sichuan.json')
        const point = _this.convertPointData(data_json, statRegionData)
        this.$echarts.registerMap(name, data)
        var d = []
        for (var i = 0; i < point.length; i++) {
          d.push({
            name: point[i].name,
            value: _this.isCompanyName(point[i].name) ? _this.getWarn(point[i].areaId, statRegionData) : -1,
            data: _this.initRegionData(point[i].areaId, statRegionData),
            regionId: point[i].regionId || '',
            areaId: point[i].areaId || '',
            parentName: point[i].parentName
          })
        }
        option.geo = { // 散点地图相关配置
          map: name, //  “china”是注册地图时使用的名称
          roam: true, // 地图是否可以缩放
          itemStyle: { // 地图区域的配置
            normal: {
              areaColor: '#274F94', // 绘制的每一个轮廓的背景颜色
              borderColor: '#81CDF6'
            },
            emphasis: {
              areaColor: '#376FBD'// 鼠标移到区域时的背景颜色
            }
          }
        }
        _this.renderMap(name, d, point, option, this.myMapChart)
      } else if (name in area) {
        option = _this.initOptionMin()
        // 显示县级地图
        const statRegionData = distributeStats
        const data_json = this.geoJson
        const data = _this.convertMapJson(data_json)
        const points = _this.convertPointData1(data_json, statRegionData)
        this.$echarts.registerMap(name, data)
        var p = []
        for (var j = 0; j < data.features.length; j++) {
          p.push({
            name: data.features[j].properties.name,
            value: _this.isCompanyName(data.features[j].properties.name) ? _this.getWarn(data.features[j].properties.areaId, statRegionData) : -1,
            data: _this.initRegionData(data.features[j].properties.areaId, statRegionData),
            regionId: data.features[j].properties.regionId || '',
            areaId: data.features[j].properties.areaId || '',
            parentName: data.features[j].properties.parentName
          })
        }
        option.geo = { // 散点地图相关配置
          map: name, //  “china”是注册地图时使用的名称
          roam: true, // 地图是否可以缩放
          itemStyle: { // 地图区域的配置
            normal: {
              areaColor: '#274F94', // 绘制的每一个轮廓的背景颜色
              borderColor: '#81CDF6'
            },
            emphasis: {
              areaColor: '#376FBD'// 鼠标移到区域时的背景颜色
            }
          }
        }
        _this.renderMap(name, p, points, option, this.myMapChart)
      }
      this.myMapChart.off('click')
      this.myMapChart.on('click', function(params) {
        const powerRegion = _this.region
        const powerArea = _this.area
        const powerField = _this.field
        if (Object.keys(region).indexOf(params.name) !== -1) {
          const noRegion = powerRegion.indexOf(params.data.regionId.toString()) === -1
          if (noRegion) {
            return
          }
          _this.getMapData(params.name, 'region', { regionId: params.data.regionId })
          // _this.props.getStatistic({ regionId: params.data.regionId });

          // _this.props.getWeather({ regionId: params.data.regionId });
        } else if (Object.keys(area).indexOf(params.name) !== -1) {
          if (params.componentType === 'geo') {
            return
          }
          // 显示区域地图
          const noArea = powerArea.indexOf(params.data.areaId.toString()) === -1
          if (noArea) {
            return
          }
          _this.getMapData(params.name, 'area', { regionId: params.data.regionId, areaId: params.data.areaId })
        } else {
          if (Object.keys(area).indexOf(params.seriesName) !== -1) {
            const noField = powerField.indexOf(params.data.fieldId.toString()) === -1
            if (noField) {
              return
            }
            const val = {
              regionId: params.data.regionId,
              areaId: params.data.areaId,
              fieldId: params.data.fieldId
            }
            _this.goToReviewPage(val)
          }
        }
      })
      const dom = document.getElementById('mainMap')// 去除鼠标默认右键菜单
      dom.oncontextmenu = function() {
        // if(name!='全国'){
        return false

        // }
      }
      this.myMapChart.off('contextmenu')
      this.myMapChart.on('contextmenu', function(params) {
        if (!_this.paramsJson.regionId) {
          return
        } else if (!_this.paramsJson.areaId) {
          _this.getMapData('全国', 'all', {})
        } else if (_this.paramsJson.areaId) {
          if (Object.keys(area).indexOf(params.name) !== -1) {
            const parentName = _this.mapdata.areaParent[params.name].parentName
            const parentId = _this.mapdata.areaParent[params.name].parentId
            _this.getMapData(parentName, 'region', { regionId: parentId })
          } else if (Object.keys(area).indexOf(params.seriesName) !== -1) {
            const parentName = _this.mapdata.areaParent[params.seriesName].parentName
            const parentId = _this.mapdata.areaParent[params.seriesName].parentId
            _this.getMapData(parentName, 'region', { regionId: parentId })
          }
        }
        // const option = _this.initOption();
        // if (Object.keys(region).indexOf(params.name) !== -1 || Object.keys(region).indexOf(params.seriesName) !== -1) {
        // if (Object.keys(region).indexOf(params.seriesName) !== -1) {
        //   _this.getMapData('全国', 'all', {})
        //   // _this.props.getStatistic({});
        //   // _this.props.getWeather({});
        // } else if (Object.keys(area).indexOf(params.name) !== -1) {
        //   const parentName = _this.mapdata.areaParent[params.name].parentName
        //   const parentId = _this.mapdata.areaParent[params.name].parentId
        //   _this.getMapData(parentName, 'region', { regionId: parentId })
        //   // _this.props.getStatistic({ regionId: parentId });
        //   // _this.props.getWeather({ regionId: parentId });
        // } else if (Object.keys(area).indexOf(params.seriesName) !== -1) {
        //   const parentName = _this.mapdata.areaParent[params.seriesName].parentName
        //   const parentId = _this.mapdata.areaParent[params.seriesName].parentId
        //   _this.getMapData(parentName, 'region', { regionId: parentId })
        //   // _this.props.getStatistic({ regionId: parentId });
        //   // _this.props.getWeather({ regionId: parentId });
        // }
      })
    },
    goToReviewPage(val) {
      this.$router.push({
        name: 'fieldDeviceOverview',
        params: {
          regionId: val.regionId,
          areaId: val.areaId,
          fieldId: val.fieldId
        }
      })
    },
    initOption() {
      const textHeight = this.height - 50
      // 初始化地图配置
      const option = {
        title: {
          // text: '点击进入下一级，右键返回上一级，点击场区进入详情页',
          subtext: '',
          left: 'center',
          y: textHeight + 'px',
          textStyle: {
            color: '#CDD8F7',
            fontSize: 14,
            fontWeight: 'normal'
            // fontFamily: 'Microsoft YaHei'
          }
        }, // 标题
        grid: {
          top: '4%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        scaleLimit: { // 滚轮缩放的极限控制
          min: 1.2,
          max: 1.6
        },
        bmap: {
          // center: [10%, 50%]
        },
        // center: [104.114129, 33.9269104], // 初始化位置
        layoutCenter: ['50%', '65%'],
        layoutSize: '100%',
        // center: ['40%', '40%'],
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          },
          iconStyle: {
            normal: {
              color: '#fff'
            }
          }
        }, // 工具栏
        animationDuration: 1000,
        animationEasing: 'cubicOut', // 立方体缓冲
        animationDurationUpdate: 1000
      }
      return option
    },
    initOptionMedium() {
      const textHeight = this.height - 50
      // 初始化地图配置
      const option = {
        title: {
          // text: '点击进入下一级，右键返回上一级，点击场区进入详情页',
          subtext: '',
          left: 'center',
          y: textHeight + 'px',
          textStyle: {
            color: '#CDD8F7',
            fontSize: 14,
            fontWeight: 'normal'
            // fontFamily: 'Microsoft YaHei'
          }
        }, // 标题
        grid: {
          top: '4%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        scaleLimit: { // 滚轮缩放的极限控制
          min: 1
        },
        bmap: {
          // center: [10%, 50%]
        },
        // center: [104.114129, 33.9269104], // 初始化位置
        layoutCenter: ['50%', '50%'],
        layoutSize: '100%',
        // center: ['40%', '40%'],
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          },
          iconStyle: {
            normal: {
              color: '#fff'
            }
          }
        }, // 工具栏
        animationDuration: 1000,
        animationEasing: 'cubicOut', // 立方体缓冲
        animationDurationUpdate: 1000
      }
      return option
    },
    initOptionMin() {
      const textHeight = this.height - 50
      // 初始化地图配置
      const option = {
        title: {
          // text: '点击进入下一级，右键返回上一级，点击场区进入详情页',
          subtext: '',
          left: 'center',
          y: textHeight + 'px',
          textStyle: {
            color: '#CDD8F7',
            fontSize: 14,
            fontWeight: 'normal'
            // fontFamily: 'Microsoft YaHei'
          }
        }, // 标题
        grid: {
          top: '4%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        scaleLimit: { // 滚轮缩放的极限控制
          min: 1.1
        },
        bmap: {
          // center: [10%, 50%]
        },
        // center: [104.114129, 33.9269104], // 初始化位置
        layoutCenter: ['50%', '50%'],
        layoutSize: '70%',
        // center: ['40%', '40%'],
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          },
          iconStyle: {
            normal: {
              color: '#fff'
            }
          }
        }, // 工具栏
        animationDuration: 1000,
        animationEasing: 'cubicOut', // 立方体缓冲
        animationDurationUpdate: 1000
      }
      return option
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true
      } else {
        return false
      }
    },
    isExist(value) {
      if (value === '' || value === null || value === undefined) {
        return false
      } else {
        return true
      }
    },

    formatterToolTip(params) {
      // const weatherAllList = this.weatherAllList
      // const weatherAll = this.weatherAll
      const powerRegion = this.region; const powerArea = this.area; const powerField = this.field
      const { name, data } = params
      const showData = data && data.data ? data.data : null
      // let obj
      // if (showData && showData.id) {
      //   if (showData.id === data.regionId) {
      //     if (weatherAll && weatherAll[showData.id] && weatherAll[showData.id][0]) {
      //       obj = {
      //         hightemp: Math.max(...weatherAll[showData.id].map(item => item.hightemp).filter(item => this.isNumber(item))),
      //         lowertemp: Math.min(...weatherAll[showData.id].map(item => item.lowertemp).filter(item => this.isNumber(item))),
      //         humidity: weatherAll[showData.id].map(item => item.humidity)[0]
      //       }
      //     }
      //   } else {
      //     obj = weatherAllList.find(item => {
      //       return item.companyname.indexOf(data.name) > -1
      //     })
      //   }
      // }
      const show = name + '<br/>' +
        '总数：' + (showData && showData.totalNum) + '<br/>' +
        '离线：' + (showData && showData.offlineNum) + '<br/>' +
        '在线：' + (showData && showData.onlineNum) + '<br/>' +
        '报警：' + (showData && showData.warnNum) + '<br/>' +
        '故障：' + (showData && showData.troubleNum)
      // const show = name+'<br/>'
      //     +'最高温度：'+(obj && this.isExist(obj.hightemp) ? obj.hightemp+'℃' : '---')+'<br/>'
      //     +'最低温度：'+(obj && this.isExist(obj.lowertemp) ? obj.lowertemp+'℃' : '---')+'<br/>'
      //     +'湿度：'+(obj && this.isExist(obj.humidity) ? obj.humidity+'%' : '---')
      const keys = showData ? Object.keys(data) : ''
      const isField = keys.indexOf('fieldId') !== -1
      const isArea = keys.indexOf('areaId') !== -1
      const isRegion = keys.indexOf('regionId') !== -1
      if (isField) {
        const noField = powerField.indexOf(showData.id && showData.id.toString()) === -1
        if (noField) {
          return `暂无${name}权限`
        } else {
          return show
        }
      } else if (isArea) {
        const noArea = powerArea.indexOf(showData.id && showData.id.toString()) === -1
        if (noArea) {
          if (showData.id) {
            return `暂无${name}权限`
          } else {
            return `${name}暂无业务`
          }
        } else {
          return show
        }
      } else if (isRegion) {
        const noRegion = powerRegion.indexOf(showData.id && showData.id.toString()) === -1
        if (noRegion) {
          if (showData.id) {
            return `暂无${name}权限`
          } else {
            return `${name}暂无业务`
          }
        } else {
          return show
        }
      } else {
        return `${name}暂无业务`
      }
    },
    regionChart() {
      const _this = this
      this.myMapChart = this.$echarts.init(document.getElementById('mainMap'))
      const region = this.mapdata.region
      const area = this.mapdata.area
      this.drawChina(this.myMapChart, null)
      this.myMapChart.on('click', function(params) {
        if (params.name in region) {
          _this.props.areaChange(params.name)
          _this.getMapData({ regionId: params.data.regionId })
          // _this.props.getStatistic({ regionId: params.data.regionId });
          _this.props.getWeather({ regionId: params.data.regionId })
        } else if (params.name in area) {
          if (params.componentType === 'geo') {
            return
          }
          // 显示县级地图
          _this.props.areaChange(params.name)
          _this.getMapData({ regionId: params.data.regionId, areaId: params.data.areaId })
        } else {
          if (params.seriesName in area) {
            const val = {
              regionId: params.data.regionId,
              areaId: params.data.areaId,
              fieldId: params.data.fieldId
            }
            _this.goToReviewPage(val)
          }
        }
      })
      const dom = document.getElementById('mainMap')// 去除鼠标默认右键菜单
      dom.oncontextmenu = function() {
        return false
      }
      this.myMapChart.on('contextmenu', function(params) {
        // const option = _this.initOption()
        const parent = this.mapdata.areaParent
        if (params.name in region || params.seriesName in region) {
          _this.props.areaChange('全国')
          _this.getMapData({ })
          // _this.props.getStatistic({});
          _this.props.getWeather({})
        } else if (params.name in parent || params.seriesName in area) {
          const parentName = parent[params.name].parentName
          const parentId = parent[params.name].parentId
          _this.props.areaChange(parentName)
          _this.getMapData({ regionId: parentId })
          // _this.props.getStatistic({ regionId: parentId });
          _this.props.getWeather({ regionId: parentId })
        }
      })
    },

    renderMap(map, data, points, option, myMapChart) {
      const that = this
      const region = this.mapdata.region
      const area = this.mapdata.area
      option.tooltip = {
        trigger: 'item',
        formatter: (params) => {
          return this.formatterToolTip(params)
        },
        textStyle: {
          extraCssText: 'width:120px; white-space:pre-wrap;'
        }
      }
      // if (!(points.length > 0)) {
      option.visualMap = {
        min: 0,
        max: 25,
        textGap: 30,
        itemHeight: 280,
        calculable: true,
        text: ['', '报警数'],
        orient: 'horizontal',
        left: 0,
        inRange: {
          color: ['#2D3AEB', '#1A77E6', '#4F9FFF', '#EAD291', '#D29F11', '#FF2727']
        },
        outOfRange: {
          color: ['#274F94']
        },
        textStyle: {
          color: '#00CEFF'
        }
      }
      if (map === 'china') {
        option.series = [
          {
            name: map,
            type: 'map',
            mapType: map,
            zoom: 1.2,
            roam: true,
            data: data,
            nameMap: {
              china: '中国'
            },
            label: { // 区域地图文本
              show: true,
              fontSize: 12,
              color: '#fff',
              formatter: (params) => {
                const { name } = params
                // let area2 = ["新疆维吾尔自治区","青海省","西藏自治区","宁夏","重庆市","福建","台湾"];

                // if(area2.indexOf(name)!=-1){
                //     return name
                // }
                if (name in region || name in area) {
                  return name
                } else {
                  return ''
                }
              }
            // 可以设置地图默认显示字
            // normal: {
            //     show: true
            // },
            // emphasis: {
            //     show: true
            // }
            },
            itemStyle: {
              areaColor: '#274F94',
              borderColor: '#001D4E'// 区域地图边界颜色
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                color: '#fff',
                formatter: (params) => {
                  const { name } = params
                  if (name in region || name in area) {
                    return name
                  } else {
                    return ''
                  }
                }
              },
              itemStyle: {
                areaColor: '#2B98ED', // 地图区域高亮颜色
                borderColor: '#868C8D'// 区域地图边界颜色
              }
            }
          }]
      } else {
        option.series = []
      }
      // option.series = points.length > 0 ? [] : [
      //   {
      //     name: map,
      //     type: 'map',
      //     mapType: map,
      //     zoom: 1.2,
      //     roam: true,
      //     data: data,
      //     nameMap: {
      //       china: '中国'
      //     },
      //     label: { // 区域地图文本
      //       show: true,
      //       fontSize: 12,
      //       color: '#fff',
      //       formatter: (params) => {
      //         const { name } = params
      //         // let area2 = ["新疆维吾尔自治区","青海省","西藏自治区","宁夏","重庆市","福建","台湾"];

      //         // if(area2.indexOf(name)!=-1){
      //         //     return name
      //         // }
      //         if (name in region || name in area) {
      //           return name
      //         } else {
      //           return ''
      //         }
      //       }
      //       // 可以设置地图默认显示字
      //       // normal: {
      //       //     show: true
      //       // },
      //       // emphasis: {
      //       //     show: true
      //       // }
      //     },
      //     itemStyle: {
      //       areaColor: '#7FA4E3',
      //       borderColor: '#001D4E'// 区域地图边界颜色
      //     },
      //     emphasis: {
      //       label: {
      //         show: true,
      //         fontSize: 12,
      //         color: '#fff',
      //         formatter: (params) => {
      //           const { name } = params
      //           if (name in region || name in area) {
      //             return name
      //           } else {
      //             return ''
      //           }
      //         }
      //       },
      //       itemStyle: {
      //         areaColor: '#2B98ED', // 地图区域高亮颜色
      //         borderColor: '#868C8D'// 区域地图边界颜色
      //       }
      //     }
      //   }]
      if (points.length > 0) {
        const obj = {
          name: map,
          type: 'scatter', // 散点图
          coordinateSystem: 'geo', // 坐标系
          data: points,
          symbolSize: 10,
          label: {
            show: true,
            color: '#626E7B',
            normal: {
              color: '#fff',
              formatter: '{b}', // {a}、{b}、{c}，分别表示系列名，数据名，数据值。
              position: 'right', // 标签位置
              show: true// 是否显示标签
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#FFFFFF',
              borderColor: '#868C8D', // 散点地图边界颜色
              areaColor: '#FFEB00'
            }
          }
        }
        option.series.push(obj)
      }
      // option.visualMap.textStyle.color = this.allStyles.mapFontColor
      this.myMapChart.setOption(option, true)
      that.isLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>
