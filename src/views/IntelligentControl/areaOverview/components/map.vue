<template>
  <div class="map">
    <div id="mainMap" v-loading="isLoading" element-loading-text="地图拼命加载中" element-loading-background="transparent" style="height: 100%" />
    <div class="mapTitle">(最舒适 + 舒适 + 次舒适) / (绑定环控器的单元数 - (离线 / 空圈 / 刷圈单元))</div>
  </div>
</template>
<script>
import { debounce } from '@/lib/utils'
import { getUnitEvc } from '@/utils/overtService'
export default {
  name: 'Echarts',
  props: ['allList', 'region', 'area', 'field', 'getMapData', 'paramsJson', 'choose', 'mapData'],

  data() {
    return {
      mapdata: {},
      myMapChart: null,
      geoJson: {},
      isLoading: true,
      flag: false,
      flag1: false
    }
  },
  computed: {
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'choose'(N, O) {
      this.getMapDataJson(N, this.mapData)
    },
    'allStyles.flag'(newValue, oldValue) {
      this.chartResize() // 自己绘制echarts的方法
    }
  },
  created() {
    // 当前页面的元素权限
    this.getMapJson()
  },
  mounted() {
    setTimeout(() => {
      // this.drawChart('全国', [])
      this.getMapDataJson(this.choose, this.mapData)
      window.addEventListener('resize', debounce(this.chartResize, 300))
    }, 1000)
  },
  beforeDestroy() {},
  methods: {
    chartResize() {
      this.myMapChart.resize()
    },
    getMapJson() {
      this.$httpRequest({
        type: 'get',
        uri: '/dashboard/mapData/getMapMappingData',
        payload: {},
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.mapdata = data.data.content
          }
        }
      })
    },
    getMapDataJson(N, mapData) {
      this.flag = false
      this.$httpRequest({
        type: 'get',
        uri: '/dashboard/mapData/getMapData',
        payload: this.paramsJson,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.geoJson = data.data.content
            this.drawChart(N, mapData)
            this.flag = true
            this.flag1 = true
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
    getWarn(regionId, data, name, type) {
      let value = 0
      if (type === 1) {
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.regionId === regionId) {
              value = item.comfortRate * 100
            }
          })
        }
      } else if (type === 2) {
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.areaId === regionId) {
              value = item.comfortRate * 10000
            }
          })
        }
      } else if (type === 3) {
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.fieldId === regionId) {
              value = item.comfortRate * 100
            }
          })
        }
      }
      return value
    },
    // 转化鼠标悬浮所需的数据
    initRegionData(regionId, data, type) {
      const value = {
        'id': regionId,
        'totalUnitCount': 0,
        'unComfortCount': 0,
        'unComfortRate': 0,
        'comfortCount': 0,
        'comfortRate': 0
      }
      if (type === 1) {
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.regionId === regionId) {
              value.totalUnitCount = item.totalUnitCount || 0
              value.unComfortCount = item.unComfortCount || 0
              value.unComfortRate = item.unComfortRate || 0
              value.comfortCount = item.comfortCount || 0
              value.comfortRate = item.comfortRate || 0
            }
          })
        }
      } else if (type === 2) {
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.areaId === regionId) {
              value.totalUnitCount = item.totalUnitCount || 0
              value.unComfortCount = item.unComfortCount || 0
              value.unComfortRate = item.unComfortRate || 0
              value.comfortCount = item.comfortCount || 0
              value.comfortRate = item.comfortRate || 0
            }
          })
        }
      } else if (type === 3) {
        if (data && data.length > 0) {
          data.map((item) => {
            if (item.fieldId === regionId) {
              value.totalUnitCount = item.totalUnitCount || 0
              value.unComfortCount = item.unComfortCount || 0
              value.unComfortRate = item.unComfortRate || 0
              value.comfortCount = item.comfortCount || 0
              value.comfortRate = item.comfortRate || 0
            }
          })
        }
      }
      return value
    },

    drawChina(myMapChart, distributeStats, powerRegion, powerArea, powerField) {
      const that = this
      const option = this.initOption()// 初始化绘制全国地图配置
      const d = []
      const data = this.geoJson
      that.isLoading = true
      const dataArray = this.mapData
      for (let i = 0; i < data.features.length; i++) {
        d.push({
          name: data.features[i].properties.name,
          value: this.isCompanyName(data.features[i].properties.name) ? this.getWarn(data.features[i].properties.regionId, dataArray, data.features[i].properties.name, 1) : -1,
          data: this.initRegionData(data.features[i].properties.regionId, dataArray, 1),
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
          'data': this.initRegionData(item.properties.areaId, values, 2),
          'parentName': item.properties.parentName,
          'value': item.geometry.coordinates.concat(Number(this.initRegionData(item.properties.areaId, values, 2).comfortRate)),
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
          'data': this.initRegionData(item.properties.fieldId, values),
          'parentName': item.properties.parentName,
          'value': item.geometry.coordinates,
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
        const statRegionData = this.allList
        const data_json = this.geoJson
        const data = _this.convertMapJson(data_json)
        const point = _this.convertPointData(data_json, statRegionData)
        this.$echarts.registerMap(name, data)
        var d = []
        for (var i = 0; i < point.length; i++) {
          d.push({
            name: point[i].name,
            value: _this.isCompanyName(point[i].name) ? _this.getWarn(point[i].areaId, statRegionData, '', 2) : -1,
            data: _this.initRegionData(point[i].areaId, statRegionData, 2),
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
        const statRegionData = this.allList
        const data_json = this.geoJson
        const data = _this.convertMapJson(data_json)
        const points = _this.convertPointData(data_json, statRegionData)
        this.$echarts.registerMap(name, data)
        var p = []
        for (var j = 0; j < data.features.length; j++) {
          p.push({
            name: data.features[j].properties.name,
            value: _this.isCompanyName(data.features[j].properties.name) ? _this.getWarn(data.features[j].properties.areaId, statRegionData, 3) : -1,
            data: _this.initRegionData(data.features[j].properties.areaId, statRegionData, 3),
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
              areaColor: '#2B98ED'// 鼠标移到区域时的背景颜色
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
        } else if (Object.keys(area).indexOf(params.name) !== -1) {
          if (params.componentType === 'geo') {
            return
          }
          // 显示区域地图
          const noArea = powerArea.indexOf(params.data.areaId.toString()) === -1
          if (noArea) {
            return
          }
          const val = {
            regionId: params.data.regionId,
            regionName: params.data.parentName,
            areaId: params.data.areaId,
            name: params.data.name
          }
          _this.goToReviewPage(val)
        } else {
          if (Object.keys(area).indexOf(params.seriesName) !== -1) {
            const noField = powerField.indexOf(params.data.fieldId.toString()) === -1
            if (noField) {
              return
            }
          }
        }
      })
      const dom = document.getElementById('mainMap')// 去除鼠标默认右键菜单
      dom.oncontextmenu = function() {
        return false
      }
      this.myMapChart.off('contextmenu')
      this.myMapChart.on('contextmenu', function(params) {
        if (Object.keys(region).indexOf(params.seriesName) !== -1) {
          return false
        } else if (Object.keys(area).indexOf(params.name) !== -1) {
          const parentName = _this.mapdata.areaParent[params.name].parentName
          const parentId = _this.mapdata.areaParent[params.name].parentId
          _this.getMapData(parentName, 'region', { regionId: parentId })
        } else if (Object.keys(area).indexOf(params.seriesName) !== -1) {
          const parentName = _this.mapdata.areaParent[params.seriesName].parentName
          const parentId = _this.mapdata.areaParent[params.seriesName].parentId
          _this.getMapData(parentName, 'region', { regionId: parentId })
        }
      })
    },
    goToReviewPage(val) { // 跳转到下一级
      const dropRegions = {
        name: val.name,
        areaId: val.areaId,
        regionId: val.regionId,
        regionName: val.regionName
      }
      getUnitEvc({
        areaId: dropRegions.areaId
      })
      sessionStorage.setItem('unitDataOverviewAreas', JSON.stringify(dropRegions))
      this.$router.push({
        path: 'regionView'
      })
    },
    initOption() {
      // 初始化地图配置
      const option = {
        title: {
          // text: '点击进入下一级，右键返回上一级，点击场区进入详情页',
          subtext: '',
          left: 'center',
          y: '96%',
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
          min: 1.6,
          max: 1.8
        },
        bmap: {
          // center: [10%, 50%]
        },
        // center: [104.114129, 33.9269104], // 初始化位置
        layoutCenter: ['50%', '70%'],
        layoutSize: '80%',
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
      // 初始化地图配置
      const option = {
        title: {
          // text: '点击进入下一级，右键返回上一级，点击场区进入详情页',
          subtext: '',
          left: 'center',
          y: '96%',
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
      // 初始化地图配置
      const option = {
        title: {
          // text: '点击进入下一级，右键返回上一级，点击场区进入详情页',
          subtext: '',
          left: 'center',
          y: '96%',
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
      const powerRegion = this.region; const powerArea = this.area; const powerField = this.field
      const { name, data } = params
      const showData = data && data.data ? data.data : null
      const show = name + '<br/>' +
        '单元总数：' + (showData && showData.totalUnitCount) + '<br/>' +
        '非舒适单元数：' + (showData && showData.unComfortCount) + '<br/>' +
        '非舒适单元占比：' + (showData && showData.unComfortRate + '%') + '<br/>' +
        '舒适单元数：' + (showData && showData.comfortCount) + '<br/>' +
        '舒适单元占比：' + (showData && showData.comfortRate + '%')
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
              fieldId: params.data.fieldId,
              regionName: params.data.regionName,
              areaName: params.data.areaName,
              name: params.data.name
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
        const parent = this.mapdata.areaParent
        if (params.name in region || params.seriesName in region) {
          _this.props.areaChange('全国')
          _this.getMapData({ })
          _this.props.getWeather({})
        } else if (params.name in parent || params.seriesName in area) {
          const parentName = parent[params.name].parentName
          const parentId = parent[params.name].parentId
          _this.props.areaChange(parentName)
          _this.getMapData({ regionId: parentId })
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
      if (map === 'china') {
      // if (!(points.length > 0)) {
        option.visualMap = {
          type: 'piecewise',
          // show:false,
          pieces: [
            { min: 99, max: 100, label: '99%-100%', color: '#13EEA5' },
            { min: 84, max: 99, label: '84%-99%', color: '#2D3AEB' },
            { min: 60, max: 84, label: '60%-84%', color: '#1A77E6' },
            { min: 30, max: 60, label: '30%-60%', color: '#4F9FFF' },
            { min: 10, max: 30, label: '10%-30%', color: '#9CD6FF' },
            { min: 0, max: 10, label: '0%-10%', color: '#FF520C' },
            { value: -1, label: '暂无业务', color: '#7FA4E3' } // 表示 value 等于 123 的情况。
          ],
          itemWidth: '16',
          itemHeight: '16',
          align: 'top',
          bottom: '0px',
          orient: 'vertical',
          calculable: false,
          textStyle: {
            color: '#cdd8f7'
          }
        }
      } else {
        option.visualMap = {
          min: 0,
          max: 100,
          textGap: 30,
          itemHeight: 220,
          calculable: true,
          text: ['', '单元舒适区占比分布(%)'],
          orient: 'horizontal',
          left: 0,
          bottom: 20,
          inRange: {
            color: ['#FF520C', '#9CD6FF', '#4F9FFF', '#1A77E6', '#2D3AEB', '#13EEA5']
          },
          textStyle: {
            color: '#00CEFF'
          }
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
                if (name in region || name in area) {
                  return name
                } else {
                  return ''
                }
              }
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
      option.visualMap.textStyle.color = this.allStyles.mapFontColor
      this.myMapChart.setOption(option, true)
      that.isLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.map {
  height: 100%;
  position: relative;
  .mapTitle {
    height: 1.25rem;
    position: absolute;
    bottom: 0px;
    z-index: 9999;
    font-size: 12px;
    color: #00CEFF;
  }
  .southSeaMap {
    width: 10%;
    height: 10%;
    background: url('~@/assets/image/southSeaMap.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    bottom: 8%;
    right: 18%;
  }
}
</style>
