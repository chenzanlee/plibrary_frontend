<template>
  <div>
    <div v-if="echartsShow" ref="myEchart" :style="returnCss()" />
    <div v-if="!echartsShow" ref="myEchartPro" :style="returnCss()" />
    <!-- <div ref="myEchartCity" :style="returnCss()" ></div> -->
  </div>
</template>
<script>
// import echarts from 'echarts'
// import "./map.js";

export default {
  name: 'Echarts',
  props: ['allList'],
  data() {
    return {
      chart: null,
      listArr: [], // 城市json
      max: '', // 最大value值
      min: '', // 最小value值
      echartsShow: true,
      provinceName: '平顶山', // 省
      height: 300 // 高度
    }
  },
  watch: {
    echartsShow() {
      if (this.echartsShow === true) {
        setTimeout(
          function() {
            this.chinaConfigure()
          }.bind(this),
          50
        )
      } else {
        setTimeout(
          function() {
            this.DrawMap()
          }.bind(this),
          50
        )
      }
    }
  },
  mounted() {
    var that = this
    document.oncontextmenu = function() {
      if (that.echartsShow === false) {
        that.echartsShow = true
      }
      return false
    }
    console.log(document.getElementsByClassName('app-main')[0].offsetWidth)
    this.height = document.getElementsByClassName('app-main')[0].offsetHeight
    setTimeout(
      function() {
        this.chinaConfigure()
        // this.drawCity();
      }.bind(this),
      100
    )
    // this.DrawMap();
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    returnCss() {
      return (
        'height:' +
        this.height +
        'px;width:100%;padding-bottom:200px;box-sizing:border-box;'
      )
    },
    drawCity() {
      // var myChart = echarts.init(this.$refs.myEchartCity)
      var myChart = this.$echarts.init(this.$refs.myEchartCity)

      var itemStyle = {
        normal: {
          label: {
            show: true,
            formatter: '{b}',
            textStyle: {
              fontSize: 20,
              fontWeight: 'bold'
            }
          }
        },
        emphasis: {
          label: {
            show: true
          }
        }
      }

      var option = {
        title: {
          text: '2012 World GDP Top 8',
          subtext: 'from baike （Billion $）',
          sublink: 'http://www.cmono.net',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function(params) {
            var value = params.value + ''
            value = value.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
            return params.seriesName + '<br/>' + value + ' Billion'
          }
        },
        dataRange: {
          orient: 'horizontal',
          x: 'center',
          y: 'center',
          min: 2000,
          max: 16000,
          splitNumber: 0, // 分割段数，默认为5
          text: ['16,000B', '2,000B'],
          calculable: true,
          itemWidth: 40,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        series: [{
          name: 'China',
          type: 'map',
          mapType: 'world|China',
          mapLocation: {
            x: '30%',
            y: '10%',
            width: '22%',
            height: '35%'
          },
          itemStyle: itemStyle,
          data: [{
            name: 'China',
            value: 8227
          }]
        }, {
          name: '广东',
          type: 'map',
          mapType: 'china|广东',
          mapLocation: {
            x: '76%',
            y: '65%',
            width: '22%',
            height: '35%'
          },
          itemStyle: itemStyle,
          data: [{
            name: '广东',
            value: 2021.9
          }]
        }]
      }

      // 为echarts对象加载数据
      myChart.setOption(option)
    },
    DrawMap() {
      console.log(this.echartsShow)
      const _this = this

      // const myChart8 = echarts.init(this.$refs.myEchartPro)
      const myChart8 = this.$echarts.init(this.$refs.myEchartPro)
      myChart8.on(
        'click',
        function(data) {
          this.echartsShow = !this.echartsShow
          myChart8.clear()

          // setTimeout
        }.bind(this)
      )
      myChart8.setOption({
        visualMap: {
          min: _this.min,
          max: _this.max,
          show: false,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        geo: {
          roam: true
        },
        series: [
          {
            type: 'map',
            map: this.provinceName,
            itemStyle: {
              normal: { label: { show: true }},
              emphasis: {
                label: { show: true },
                areaColor: '#67C23A' // 鼠标进入时的颜色
              }
            },
            data: [
              {
                name: '玉溪市',
                value: 1
              }
            ]
          }
        ]
      })
    },
    chinaConfigure() {
      const that = this
      // const myChart = echarts.init(this.$refs.myEchart) // 这里是为了获得容器所在位置
      const myChart = this.$echarts.init(this.$refs.myEchart) // 这里是为了获得容器所在位置
      myChart.on(
        'click',
        function(data) {
          this.echartsShow = false
          myChart.clear()
          console.log(data.name)

          this.provinceName = data.name
        }.bind(this)
      )
      window.onresize = myChart.resize
      myChart.setOption({
        // 进行相关配置
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
        tooltip: {}, // 鼠标移到图里面的浮动提示框
        dataRange: {
          show: false,
          min: 0,
          max: 1000,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        grid: {
          x: '40%',
          y: 45,
          x2: 380,
          y2: '20%',
          borderWidth: 1,
          containLabel: true
        },
        geo: {
          // 这个是重点配置区
          map: 'china', // 表示中国地图
          roam: false,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,0.4)'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo' // 对应上方配置
          },
          {
            name: '启动次数', // 浮动框的标题
            type: 'map',
            geoIndex: 0,
            data: that.allList
          }
        ]
      })
    }
  }
}
</script>
