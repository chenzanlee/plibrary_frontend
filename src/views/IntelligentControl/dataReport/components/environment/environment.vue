<template>
  <div class="facility titleHighlight">
    <div class="title">
      <div :class="show === 1 ? 'titleNav titleNavActive' : 'titleNav'" @click="show = 1">温度曲线比较</div>
      <div :class="show === 2 ? 'titleNav titleNavActive' : 'titleNav'" @click="show = 2">湿度曲线比较</div>
    </div>
    <div v-loading="isLoading" class="flexbg">
      <div class="chart">
        <tem class="chart-item" :class="{'is-active': show === 1}" :name-list="nameList" :data="dataTem" :time="time" />
        <hum class="chart-item" :class="{'is-active': show === 2}" :name-list="nameList" :data="dataHum" :time="time" />
      </div>
    </div>
  </div>
</template>
<script>
import hum from './hum'
import tem from './tem'
import { getConfigElement } from '@/utils/overtService'
// import {
//   getTemperatureCurveLinePoints,
//   getHumidityCurveLinePoints
// } from '@/http/api/exportData/humiture'
const pageElement = getConfigElement('humiTemperatureTable')
export default {
  components: {
    hum,
    tem
  },
  props: {
    json: {
      type: Object,
      default: () => { return {} }
    },
    reload: {
      type: Boolean
    }
  },
  data() {
    return {
      name: [[], [], [], []],
      dataList: [[], [], [], []],
      nameList: [],
      dataHum: [],
      dataTem: [],
      time: [],
      show: 1,
      isLoading: false
    }
  },
  watch: {
    reload() {
      this.realodEchart()
    },
    'json.unitId0': {
      handler: function(n, o) {
        this.setArr(n, o, ['单元1前温', '单元1后温'], 0)
      },
      deep: true
    },
    'json.unitId1': {
      handler: function(n, o) {
        this.setArr(n, o, ['单元2前温', '单元2后温'], 1)
      },
      deep: true
    },
    'json.unitId2': {
      handler: function(n, o) {
        this.setArr(n, o, ['单元3前温', '单元3后温'], 2)
      },
      deep: true
    },
    'json.unitId3': {
      handler: function(n, o) {
        this.setArr(n, o, ['单元4前温', '单元4后温'], 3)
      },
      deep: true
    },
    'json.startTime': {
      handler: function(n, o) {
        for (var i = 0; i < 3; ++i) {
          if (this.json['unitId' + i] !== '') {
            this.setArr(this.json['unitId' + i], this.json['unitId' + i], [
              '单元' + this.chinaNum(i + 1) + '前温',
              '单元' + this.chinaNum(i + 1) + '后温'
            ], i)
          }
        }
      },
      deep: true
    }
  },
  mounted() {},
  created() {},
  methods: {
    chinaNum(item) {
      if (item === 1) {
        return '一'
      } else if (item === 2) {
        return '二'
      } else if (item === 2) {
        return '三'
      } else {
        return '四'
      }
    },
    realodEchart() {
      // this.nameList = []
      // this.dataHum = []
      // this.dataTem = []
      // this.dataList = [[], [], [], []]
      // this.name = [[], [], [], []]
      this.isLoading = true
      for (var i = 0; i < 3; i++) {
        if (this.json['unitId' + i] !== '') {
          this.setArr(this.json['unitId' + i], this.json['unitId' + i], [
            '单元' + this.chinaNum(i + 1) + '前温',
            '单元' + this.chinaNum(i + 1) + '后温'
          ], i)
        }
      }
      this.isLoading = false
    },
    setSonData() {
      this.nameList = []
      this.dataHum = []
      this.dataTem = []
      this.name.forEach((item, index) => {
        if (item.length === 0) {
          // continue
        } else {
          this.nameList.push(item[0], item[1])
          if (this.dataList[index] === [[], []]) {
            this.dataHum.push([])
            this.dataTem.push([])
            return
          }
          this.dataHum.push(this.dataList[index][1][0])
          this.dataHum.push(this.dataList[index][1][1])
          this.dataTem.push(this.dataList[index][0][0])
          this.dataTem.push(this.dataList[index][0][1])
        }
      })
    },
    // 编辑数组
    setArr(n, o, arr, idx) {
      if (o === '') {
        // 如果old值为空（在数组里添加）
        this.name.splice(idx, 1, arr)
        this.dataList.splice(idx, 1, [[], []])
        this.setEchart(idx, true)
      } else {
        // old值不为空
        if (n === '') {
          // 如果new值为空
          this.name.splice(idx, 1, [])
          this.dataList[idx] = []
          this.setEchart(idx, false)
        } else {
          // 如果new不为空
          this.setEchart(idx, true)
        }
      }
    },
    async getData(idx) {
      this.isLoading = true
      const Tem = [[], []]
      const Hum = [[], []]
      let time = []
      const search = {
        unitId: this.json['unitId' + idx],
        startTime: this.json.startTime,
        endTime: this.json.endTime,
        lineType: this.json.lineType
      }
      const http1 = this.$httpRequest({
        type: 'GET',
        payload: search,
        uri: pageElement && pageElement.getTemperatureCurveLineDataPoints && pageElement.getTemperatureCurveLineDataPoints.uri,
        callback: data => {
          if (data.data.length !== 0) {
            data.data.forEach((item) => {
              // time.push(item.uploadTime.split(' ')[0])
              if (item.meanTemperatureInner1 || item.meanTemperatureInner1 === 0) {
                const meanTemperatureInner1 = item.meanTemperatureInner1 ? item.meanTemperatureInner1.toFixed(2) : '--℃'
                Tem[0].push(meanTemperatureInner1) // 前温meanTemperatureInner1
              } else {
                Tem[0].push(null) // 后温
              }
              if (item.meanTemperatureInner2 || item.meanTemperatureInner2 === 0) {
                const meanTemperatureInner2 = item.meanTemperatureInner2 ? item.meanTemperatureInner2.toFixed(2) : '--℃'
                Tem[1].push(meanTemperatureInner2) // 前温meanTemperatureInner1
              } else {
                Tem[1].push(null) // 后温
              }
            })
          }
        }
      })
      const http2 = this.$httpRequest({
        type: 'GET',
        payload: search,
        uri: pageElement && pageElement.getHumidityCurveLineDataPoints && pageElement.getHumidityCurveLineDataPoints.uri,
        callback: data => {
          if (data.data.length !== 0) {
            time = []
            data.data.forEach((item) => {
              time.push(item.uploadTime.split(' ')[0])
              if (item.meanHumiditieInner1 || item.meanHumiditieInner1 === 0) {
                const meanHumiditieInner1 = item.meanHumiditieInner1 ? item.meanHumiditieInner1.toFixed(2) : '--℃'
                Hum[0].push(meanHumiditieInner1)
              } else {
                Hum[0].push(null)
              }
              if (item.meanHumiditieInner2 || item.meanHumiditieInner2 === 0) {
                const meanHumiditieInner2 = item.meanHumiditieInner2 ? item.meanHumiditieInner2.toFixed(2) : '--℃'
                Hum[1].push(meanHumiditieInner2)
              } else {
                Hum[1].push(null)
              }
            })
          }
        }
      })
      return Promise.all([http1, http2]).then(values => {
        this.isLoading = false
        const response = {
          time: time,
          data: [Tem, Hum]
        }
        return response
      }, reason => {
        console.log(reason)
      })
    },
    setEchart(idx, off) {
      // 参数一为索引，参数二判断是否请求数据(true:请求，Fasle:不请求)
      if (off === false) {
        //   //如果不需要请求数据,只需要删除数组里的一些数据即可
        this.nameList = []
        this.dataHum = []
        this.dataTem = []
        if (
          this.json.unitId0 === '' &&
          this.json.unitId1 === '' &&
          this.json.unitId2 === '' &&
          this.json.unitId3 === '' &&
          this.json.unitId4 === ''
        ) {
          return
        }

        if (idx !== 'all') {
          // 删除变为空的单元数据
          this.setSonData()
        } else {
          // this.name=[];
          // this.dataList = [];
        }
      } else {
        if (idx !== 'all') {
          this.getData(idx).then((data) => {
            this.dataList[idx] = data.data
            if (data.time.length !== 0) {
              this.time = data.time
            }
            this.setSonData()
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  width: 100%;
  height: 58px;
  // border-bottom: 1px solid #3a4f9e;
  border-bottom: 1px solid;
  @include border_bottom_color('mainTagBorderColor');
  display: flex;
  margin-bottom: 20px;
}
.titleNav {
  width: 128px;
  height: 58px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  border-bottom: 3px solid transparent;
  margin-right: 15px;
  font-size: 18px;
  // color: #cdd8f7;
  @include font_color('mainFontColor11');
  cursor: pointer;
}
.titleNavActive {
  border-bottom: 3px solid #1fbfff;
  // color: #1fbfff;
  @include font_color('environmentTagActiveFontColor');
}
.flex {
  width: 100%;
  height: 280px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}
.facility {
  width: 100%;
  flex: 1;
  margin-top: 5px;
  margin-right: 20px;
}
.chart {
  width: 100%;
  height: 100%;
  position: absolute;
}
.flexbg {
  position: relative;
  width: 100%;
  height: calc(100% - 70px);
}
.chart-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.chart-item.is-active {
  opacity: 1;
  z-index: 99;
}
</style>
