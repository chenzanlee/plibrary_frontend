<template>
  <div class="onLine-back">
    <!-- <div class="formPosition"> -->
    <searchForm
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    >
      <span slot="right" v-hasAuth="'humiTemperatureTable:exportHumidityCurveLinePoints'" class="export-img-box" @click="exportHandle">
        <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
          <img src="@/assets/image/export.png">
        </el-tooltip> -->
        <el-button class="btn-blue">
          <svg-icon icon-class="newExport" />
          导出
        </el-button>
      </span>
    </searchForm>
    <!-- </div> -->
    <situation v-loading="isLoading" :mess="messTem" :line-type="json.lineType" />
    <humidity v-loading="isLoading" :mess="messHum" :line-type="json.lineType" />
    <el-dialog
      title="导出数据"
      width="520px"
      :visible.sync="dialogTableVisible"
      :modal-append-to-body="false"
    >

      <div style="color:#CDD8F7;margin-bottom:20px;">请选择导出内容</div>
      <div class="customForm">
        <div class="submit">
          <el-button type="primary" @click="choose(0)">温度</el-button>
          <el-button type="primary" @click="choose(1)">湿度</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import situation from '../../components/humiture/Temperature'
import humidity from '../../components/humiture/humidity'
import searchForm from '@/components/commonComponent/navForm'
import { getConfigElement } from '@/utils/overtService'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
const pageElement = getConfigElement('humiTemperatureTable')
export default {
  components: {
    situation,
    searchForm,
    humidity
  },
  data() {
    return {
      total: [],
      online: [],
      isLoading: false,
      json: {
        unitId: '',
        startTime: '',
        endTime: '',
        lineType: 'REAL_TIME'
      },
      defaultValue: [], // 默认值
      dialogTableVisible: false,
      // 搜索参数列表
      search: {
        regionId: '',
        areaId: '',
        brand: ''
      },
      brandData: [10, 10], // 在线离线数对比
      list: [],
      messHum: [],
      messTem: [],
      labelWidth: '100%',
      navFormInfo: {
        data: {
          cascader: [], // 大区区域场区
          roomtypeUnit: [],
          time: '', // 设备型号
          radio: '实时'
        },
        fieldList: {
          left: {},
          right: {
            inpLists: [
              {
                key: 'cascader',
                type: 'cascader',
                className: 'shadow',
                customLabel: 'title',
                clearable: true,
                customValue: '',
                placeholder: '大区 / 区域 / 场区',
                valueKey: 0,
                width: '200px',
                options: [],
                handleChange: (v1) => {
                  if (v1.length === 3) {
                    getRootTypeUnitTreeV2({ fieldId: v1[2], isBuilding: false }).then(data => {
                      if (data.status === 200) {
                        this.navFormInfo.fieldList.right.inpLists[1].options = data.data
                      } else {
                        this.navFormInfo.fieldList.right.inpLists[1].options = []
                      }
                    })
                    this.navFormInfo.data.roomtypeUnit = []
                  } else {
                    this.navFormInfo.fieldList.right.inpLists[1].options = []
                    this.navFormInfo.data.roomtypeUnit = []
                  }
                }
              },
              {
                key: 'roomtypeUnit',
                type: 'cascader2',
                customLabel: 'title',
                className: 'shadow',
                width: '200px',
                placeholder: '猪舍类型 / 单元',
                clearable: true,
                valueKey: 1,
                options: []
              },
              {
                key: 'time',
                type: 'date1',
                className: 'shadow',
                clearable: false,
                dateType: 'datetimerange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              },
              {
                key: 'radio',
                type: 'radio',
                customLabel: 'name',
                width: '125px',
                customVal: 'val',
                optList: [{
                  name: '实时',
                  val: '实时'
                }, {
                  name: '日线',
                  val: '日线'
                }]
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.setEchart()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                }
              }
              // {
              //   innerText: '导出',
              //   className: 'btn-blue',
              //   handleClick: () => {
              //     this.exportHandle()
              //   }
              // }
            ]
          }
        }
      }
    }
  },
  watch: {
    'navFormInfo.data.radio': {
      handler: function() {
        if (this.navFormInfo.data.radio !== '日线') {
          this.navFormInfo.fieldList.right.inpLists[2].type = 'date1'
          this.json.lineType = 'REAL_TIME'
        } else {
          this.navFormInfo.fieldList.right.inpLists[2].type = 'dateTime'
          this.json.startTime = this.$moment().subtract(2, 'months').format('YYYY-MM-DD') + ' 00:00:00'
          this.json.endTime = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
          this.navFormInfo.data.time = [this.json.startTime, this.json.endTime]
          this.json.lineType = 'DAY_LINE'
        }
      },
      deep: true
    },
    'navFormInfo.data.cascader': {
      handler: function(n) {
        this.json.unitId = n[n.length - 1] || ''
        if (n.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    },
    'navFormInfo.data.roomtypeUnit': {
      handler: function(n) {
        this.json.unitId = n[n.length - 1] || ''
      },
      deep: true
    },
    'navFormInfo.data.time': {
      handler: function(n) {
        this.json.startTime = n[0] || ''
        this.json.endTime = n[1] || ''
      },
      deep: true
    }
    // json: {
    //   handler: function(n) {
    //     // this.setEchart()
    //   },
    //   deep: true
    // }
  },
  async mounted() {
    let json = ''
    getRegionAreaFieldTree({ isBuilding: false }).then(data => {
      if (data.status === 200 && data.rel) {
        json = data.data
        this.navFormInfo.fieldList.right.inpLists[0].options = json
        this.defaultValueMe(this.navFormInfo.fieldList.right.inpLists[0].options)
        this.json.startTime = this.$moment().subtract(2, 'months').format('YYYY-MM-DD') + ' 00:00:00'
        this.json.endTime = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
        this.navFormInfo.data.time = [this.json.startTime, this.json.endTime]
      } else {
        this.navFormInfo.fieldList.right.inpLists[0].options = []
      }
    })
    // const pageElement = getConfigElement('getRegionAreaFieldTree')
    // let json = ''
    // this.$httpRequest({
    //   type: 'GET',
    //   payload: { isBuilding: false },
    //   uri: pageElement && pageElement.getRegionAreaFieldRoomTypeUnitV2 && pageElement.getRegionAreaFieldRoomTypeUnitV2.uri,
    //   callback: data => {
    //     if (data.data) {
    //       json = data.data
    //       this.navFormInfo.fieldList.right.inpLists[0].options = json
    //       this.defaultValueMe(this.navFormInfo.fieldList.right.inpLists[0].options)
    //       this.json.startTime = this.$moment().subtract(2, 'months').format('YYYY-MM-DD') + ' 00:00:00'
    //       this.json.endTime = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
    //       this.navFormInfo.data.time = [this.json.startTime, this.json.endTime]
    //     }
    //   }
    // })
  },
  created() {
  },
  methods: {
    exportHandle() {
      if (this.json.unitId === '') {
        this.$message.error('请选择单元')
        return
      }
      this.dialogTableVisible = true
    },
    // 默认值递归
    defaultValueMe(arr) {
      if (arr.length !== 0) {
        this.defaultValue.push(arr[0].value)
      } else {
        return
      }
      if (arr[0].children) {
        this.defaultValueMe(arr[0].children)
      }
    },
    choose(status) {
      let url = pageElement && pageElement.exportTemperatureCurveLinePoints && pageElement.exportTemperatureCurveLinePoints.uri
      if (status !== 0) {
        url = pageElement && pageElement.exportHumidityCurveLinePoints && pageElement.exportHumidityCurveLinePoints.uri
      }
      this.$httpExport({
        uri: url,
        payload: {
          endTime: this.navFormInfo.data.radio !== '日线' ? this.$moment().format('YYYY-MM-DD HH:mm:ss') : this.json.endTime,
          lineType: this.json.lineType,
          startTime: this.navFormInfo.data.radio !== '日线' ? this.$moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss') : this.json.startTime,
          unitId: this.json.unitId
        }
      })
      this.dialogTableVisible = false
    },
    returnZero(data) {
      if (data === null) {
        return 0
      } else {
        return data
      }
    },
    ForwardRankingDate(data, p) {
      for (var i = 0; i < data.length - 1; i++) {
        for (var j = 0; j < data.length - 1 - i; j++) {
          if (Date.parse(data[j][p]) < Date.parse(data[j + 1][p])) {
            var temp = data[j]
            data[j] = data[j + 1]
            data[j + 1] = temp
          }
        }
      }
      return data
    },
    setEchart() {
      if (this.json.unitId === '') {
        return this.$message.error('请选择单元')
      }
      const search = {}
      if (this.json.lineType === 'REAL_TIME') {
        for (var i in this.json) {
          search[i] = this.json[i]
        }
        search.startTime = this.$moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        search.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      } else {
        search.lineType = 'DAY_LINE'
        search.unitId = this.json.unitId
        search.startTime = this.navFormInfo.data.time[0]
        search.endTime = this.navFormInfo.data.time[1]
      }
      this.isLoading = true
      this.$httpRequest({
        type: 'GET',
        payload: search,
        uri: pageElement && pageElement.getTemperatureCurveLineDataPoints && pageElement.getTemperatureCurveLineDataPoints.uri,
        callback: data => {
          this.isLoading = false
          if (data) {
            this.messTem = data.data
          }
        }
      })
      this.$httpRequest({
        type: 'GET',
        payload: search,
        uri: pageElement && pageElement.getHumidityCurveLineDataPoints && pageElement.getHumidityCurveLineDataPoints.uri,
        callback: data => {
          this.isLoading = false
          if (data) {
            this.messHum = data.data
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.onLine-back{
  .el-form-item {
    min-width: 0px!important;
  }
}
.gutter {
  display: none !important;
}
.el-cascader-node.is-selectable.in-active-path {
  color: #fff !important;
}
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  display: none !important;
  background-color: transparent !important;
}
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  display: none;
  height: 50px;
  outline-offset: -2px;
  outline: 2px solid #fff;
  border-radius: 4px;
  border: 2px solid #fff;
}
.el-table--scrollable-y {
  background-color: var(--border) !important;
}
</style>
<style lang="css" scoped>
.formPosition {
  width: 70%;
  position: fixed;
  right: 0;
  top: 80px;
}
.onlineMess {
  width: 100%;
  height: 80px;
  display: flex;
  margin-bottom: 20px;
}
.onlineMessDiv {
  width: 185px;
  height: 100%;
  border-radius: 4px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.onlineMessDiv:nth-of-type(1) {
  background-image: linear-gradient(46deg, #ff7134 0%, #ff5988 100%);
}
.onlineMessDiv:nth-of-type(2) {
  background-image: linear-gradient(46deg, #cb63d3 0%, #1c6df8 100%);
}
.onlineMessDiv:nth-of-type(3) {
  background-image: linear-gradient(46deg, #619aff 0%, #c346ff 100%);
}
.onlineMessDiv:nth-of-type(4) {
  background-image: linear-gradient(46deg, #15e0f8 0%, #007ef9 100%);
}
.icon {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}
.onlineMess-number {
  width: 60px;
  display: flex;
  flex-direction: column;
  height: 40px;
  justify-content: space-between;
  align-items: flex-start;
  color: #fff;
}
.onlineMess-number > span:nth-child(1) {
  font-size: 20px;
}
.onlineMess-number > span:nth-child(2) {
  font-size: 12px;
}
.onLine-back {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* border-top: 1px solid #313c82; */
}
</style>
