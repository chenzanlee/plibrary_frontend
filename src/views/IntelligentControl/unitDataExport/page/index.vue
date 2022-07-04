<template>
  <div class="home unitData">
    <div style="padding-top: 40px;display:flex;justify-content:center;">
      <div class="eleMeter Highlight">
        <p>温度数据导出</p>
        <div class="computed">
          <div class="computerbg" style="width:94px;height:77px;">
            <img src="@/assets/image/temperature.png">
          </div>
        </div>
        <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
        <div :authCode="'EleMeter:getEleMeterStatusList'" style="margin-top:-10px;" class="nav-form logManagement" @click="temExport()">
          <el-button class="btn-blue">
            <svg-icon icon-class="newExport" />
            导出
          </el-button>
        </div>
      </div>
      <div class="temperature Highlight">
        <p>电表数据导出</p>
        <div class="computed">
          <div class="computerbg" style="width:94px;height:77px;">
            <img src="@/assets/image/eleMeter.png">
          </div>
        </div>
        <nav-form ref="navForm2" :data="navFormInfo2.data" :field-list="eleNavFormInfo.fieldList" />
        <div :authCode="'tempSensor:export'" style="margin-top:-10px;" class="nav-form logManagement" @click="eleExport()">
          <el-button class="btn-blue">
            <svg-icon icon-class="newExport" />
            导出
          </el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
// import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
// import { derive } from '@/http/api/siteLog.js'
import { getConfigElement } from '@/utils/overtService'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
// const pageElement = getConfigElement('unit-evcDataInterface')
// fieldDeviceOverview:getRegionAreaFieldRoomTypeUnitV2
const navFormInfo = (that) => {
  return {
    navFormInfo: {
      data: {
        area: [],
        roomtypeUnit: [],
        pushStatus: '',
        workSection: '',
        unit: '',
        time: []
      },
      fieldList: {
        right: {
          inpLists: [
            {
              key: 'area',
              type: 'cascader',
              className: 'shadow',
              placeholder: '大区 / 区域 / 场区',
              options: [],
              customLabel: 'title',
              customValue: '',
              checkStrictly: false,
              clearable: true,
              valueKey: 0,
              handleChange: (v1) => {
                if (v1.length === 3) {
                  getRootTypeUnitTreeV2({ fieldId: v1[2], isBuilding: false }).then(data => {
                    if (data.status === 200) {
                      that.navFormInfo.fieldList.right.inpLists[1].options = data.data
                    } else {
                      that.navFormInfo.fieldList.right.inpLists[1].options = []
                    }
                  })
                  that.navFormInfo.data.roomtypeUnit = []
                } else {
                  that.navFormInfo.fieldList.right.inpLists[1].options = []
                  that.navFormInfo.data.roomtypeUnit = []
                }
              }
            },
            {
              key: 'roomtypeUnit',
              type: 'cascader2',
              checkStrictly: false,
              customLabel: 'title',
              className: 'shadow',
              placeholder: '猪舍类型 / 单元',
              clearable: true,
              valueKey: 1,
              options: []
            },
            {
              key: 'time',
              type: 'dateTime',
              className: 'shadow',
              dateType: 'datetimerange',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间'
            }
          ]
          // btnLists: [
          //   {
          //     innerText: '导出',
          //     className: 'btn-blue',
          //     width: 400,
          //     authCode: 'EleMeter:getEleMeterStatusList',
          //     handleClick: () => {
          //       that.temExport()
          //     }
          //   }
          // ]
        },
        left: {}
      }
    }
  }
}
const eleNavFormInfo = (that) => {
  return {
    eleNavFormInfo: {
      data: {
        area: [],
        roomtypeUnit: [],
        pushStatus: '',
        workSection: '',
        unit: '',
        time: [],
        LegendName: ''
      },
      fieldList: {
        right: {
          inpLists: [
            {
              key: 'area',
              type: 'cascader',
              className: 'shadow',
              placeholder: '大区 / 区域 / 场区',
              options: [],
              customLabel: 'title',
              customValue: '',
              checkStrictly: false,
              clearable: true,
              valueKey: 0,
              handleChange: (v1) => {
                if (v1.length === 3) {
                  getRootTypeUnitTreeV2({ fieldId: v1[2], isBuilding: false }).then(data => {
                    if (data.status === 200) {
                      that.eleNavFormInfo.fieldList.right.inpLists[1].options = data.data
                    } else {
                      that.eleNavFormInfo.fieldList.right.inpLists[1].options = []
                    }
                  })
                  that.eleNavFormInfo.data.roomtypeUnit = []
                } else {
                  that.eleNavFormInfo.fieldList.right.inpLists[1].options = []
                  that.eleNavFormInfo.data.roomtypeUnit = []
                }
              }
            },
            {
              key: 'roomtypeUnit',
              type: 'cascader2',
              checkStrictly: false,
              customLabel: 'title',
              className: 'shadow',
              placeholder: '猪舍类型 / 单元',
              clearable: true,
              valueKey: 1,
              options: []
            },
            {
              key: 'time',
              type: 'dateTime',
              className: 'shadow',
              dateType: 'datetimerange',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间'
            }
          ]
          // btnLists: [
          //   {
          //     innerText: '导出',
          //     className: 'btn-blue',
          //     authCode: 'tempSensor:export',
          //     handleClick: () => {
          //       that.eleExport()
          //     }
          //   }
          // ]
        },
        left: {

        }
      }
    }
  }
}
export default {
  components: {
    navForm
  },
  data() {
    return {
      dialogFormVisible: false,
      title: '查看',
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      downlist: [],
      selection: '',
      row: '', // 当前选中行的数据
      search: {
        fromTime: '', // 开始时间
        toTime: '', // 结束时间
        regionId: '', // 大区ID
        areaId: '', // 区域ID
        fieldId: '', // 场区ID
        block: '', // A座 or B座
        roomTypeId: '', // 舍ID
        unitId: '' // 单元ID
        // pageIndex: '', // 页码
        // pageSize: '', // 页码显示数
        // type: 'PARAM_CHANGE'
      },
      eleSearch: {
        fromTime: '', // 开始时间
        toTime: '', // 结束时间
        regionId: '', // 大区ID
        areaId: '', // 区域ID
        fieldId: '', // 场区ID
        block: '', // A座 or B座
        roomTypeId: '', // 舍ID
        unitId: '' // 单元ID
        // pageIndex: '', // 页码
        // pageSize: '', // 页码显示数
        // type: 'PARAM_CHANGE'
      },
      navFormInfo: {
        data: {
          area: [],
          roomtypeUnit: [],
          time: []
        }},
      navFormInfo2: {
        data: {
          area: [],
          roomtypeUnit: [],
          time: []
        }},
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      ...navFormInfo(this),
      ...eleNavFormInfo(this),
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      tableData: [],
      defaultValue: [] // 默认选中
    }
  },
  watch: {
    // 赋值搜索条件
    'navFormInfo.data': {
      handler: function(n) {
        if (n.time) {
          this.search.fromTime = n.time[0]
          this.search.toTime = n.time[1]
        }
        this.search.regionId = n.area[0] || ''
        this.search.areaId = n.area[1] || ''
        this.search.fieldId = n.area[2] || ''
        // this.search.roomTypeId = n.area[3] || ''
        // this.search.unitId = n.area[4] || ''
        this.search.keyword = n.keyword || ''
        this.search.push = n.push
        this.search.type = n.type || ''
        if (this.search.block !== '') {
          this.search.block = ''
        }
        if (n.roomtypeUnit.length === 3) {
          this.search.block = n.roomtypeUnit[0] || ''
          this.search.roomTypeId = n.roomtypeUnit[1] || ''
          this.search.unitId = n.roomtypeUnit[2] || ''
        }
        if (n.roomtypeUnit.length !== 3) {
          this.search.roomTypeId = n.roomtypeUnit[0] || ''
          this.search.unitId = n.roomtypeUnit[1] || ''
        }
        if (n.roomtypeUnit.length !== 3 && n.roomtypeUnit[0] && n.roomtypeUnit[0].indexOf('_') > -1) {
          this.search.roomTypeId = n.roomtypeUnit[1] || ''
          this.search.unitId = ''
        }
        if (n.area.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    },
    'navFormInfo2.data': {
      handler: function(n) {
        if (n.time) {
          this.eleSearch.fromTime = n.time[0]
          this.eleSearch.toTime = n.time[1]
        }
        this.eleSearch.regionId = n.area[0] || ''
        this.eleSearch.areaId = n.area[1] || ''
        this.eleSearch.fieldId = n.area[2] || ''
        // this.eleSearch.roomTypeId = n.area[3] || ''
        // this.eleSearch.unitId = n.area[4] || ''
        this.eleSearch.keyword = n.keyword || ''
        this.eleSearch.push = n.push
        this.eleSearch.type = n.type || ''
        if (this.eleSearch.block !== '') {
          this.eleSearch.block = ''
        }
        if (n.roomtypeUnit.length === 3) {
          this.eleSearch.block = n.roomtypeUnit[0] || ''
          this.eleSearch.roomTypeId = n.roomtypeUnit[1] || ''
          this.eleSearch.unitId = n.roomtypeUnit[2] || ''
        }
        if (n.roomtypeUnit.length !== 3) {
          this.eleSearch.roomTypeId = n.roomtypeUnit[0] || ''
          this.eleSearch.unitId = n.roomtypeUnit[1] || ''
        }
        if (n.roomtypeUnit.length !== 3 && n.roomtypeUnit[0] && n.roomtypeUnit[0].indexOf('_') > -1) {
          this.eleSearch.roomTypeId = n.roomtypeUnit[1] || ''
          this.eleSearch.unitId = ''
        }
        if (n.area.length === 0) {
          this.eleNavFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.eleNavFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    }
  },
  created() {
    // this.getTabData()
  },
  mounted() {
    this.getTree()
  },
  methods: {
    handleChange() {
    },
    // 审核数据接口
    setReview(idArr) {
    },
    // 反审核数据接口
    setUnreview(idArr) {
    },
    // 获取正确的事件格式
    formatDate(dateValue) {
      var date = new Date(dateValue)
      var YY = date.getFullYear() + '-'
      var MM =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return YY + MM + DD + ' '
    },
    async getTree() {
      getRegionAreaFieldTree({ isBuilding: false }).then(data => {
        if (data.status === 200 && data.rel) {
          this.navFormInfo.fieldList.right.inpLists[0].options = data.data
          this.eleNavFormInfo.fieldList.right.inpLists[0].options = data.data
        } else {
          this.navFormInfo.fieldList.right.inpLists[0].options = []
          this.eleNavFormInfo.fieldList.right.inpLists[0].options = []
        }
      })
      // this.$httpRequest({
      //   type: 'GET',
      //   payload: {},
      //   uri: pageElement && pageElement.getRegionAreaFieldRoomTypeUnitV2 && pageElement.getRegionAreaFieldRoomTypeUnitV2.uri,
      //   callback: data => {
      //     if (data.status === 200) {
      //       json = data.data
      //       this.navFormInfo.fieldList.left.inpLists[0].options = evcJsonh2Tree(
      //         json
      //       )
      //       this.eleNavFormInfo.fieldList.left.inpLists[0].options = evcJsonh2Tree(
      //         json
      //       )
      //     }
      //   }
      // })
    },
    temExport() {
      const obj = {
        unitId: this.search.unitId,
        startTime: this.search.fromTime,
        endTime: this.search.toTime
      }
      if (this.search.unitId === '') {
        this.$message({
          message: '请先选择温度导出单元！',
          type: 'warning'
        })
        return
      }
      if (this.navFormInfo.data.time === [] || this.navFormInfo.data.time === null || this.navFormInfo.data.time.length === 0) {
        this.$message({
          message: '请先选择温度时间段！',
          type: 'warning'
        })
        return
      }
      // tempSensor:export
      const pageElement = getConfigElement('tempSensor')
      const uri = pageElement && pageElement.export && pageElement.export.uri
      this.$httpExport({
        uri: uri,
        payload: obj
      })
      // derive('/api/unit_evc/myEvcOperationDynamicsRealTime/exportHumitureStatus', obj)
    },
    eleExport() {
      const obj = {
        unitId: this.eleSearch.unitId,
        startTime: this.eleSearch.fromTime,
        endTime: this.eleSearch.toTime
      }
      if (this.eleSearch.regionId === '') {
        this.$message({
          message: '请先选择电表导出单元！',
          type: 'warning'
        })
        return
      }
      console.log(this.eleSearch)
      if (this.navFormInfo2.data.time === [] || this.navFormInfo2.data.time === null || this.navFormInfo2.data.time.length === 0) {
        this.$message({
          message: '请先选择电表时间段！',
          type: 'warning'
        })
        return
      }
      // EleMeter:getEleMeterStatusList
      const pageElement = getConfigElement('EleMeter')
      const uri = pageElement && pageElement.getEleMeterStatusList && pageElement.getEleMeterStatusList.uri
      this.$httpExport({
        uri: uri,
        payload: obj
      })
      // derive('/api/unit_evc/eleMeter/export', obj)
    }
  }
}
</script>
<style lang="scss">
.unitData{

  .temperature{
    width: 360px;
    height: 560px;
    @include background("mainBackGroundColor");
    p {
        // border-bottom: 1px solid #294fa7;
        border-bottom: 1px solid;
        @include border_color("formBorderHoverColor");
        height: 40px;
        line-height: 40px;
        // color: #fff;
        @include font_color('mainFontColor2');
        padding-left: 20px;
    }
}
    .logManagement{
        padding: 0 5%;
    }
    .nav-form .el-form-item{
        margin-bottom: 25px !important;
        margin-right: 0;
        width: 100%;
    }
    .nav-form .el-cascader{
        width: 100% !important;
    }
    .nav-form .el-button{
        width: 100%;
        margin-right: 0;
    }
    .nav-form .btn-group{
      width: 100%
    }
    .nav-form .el-input__inner{
      width: 100%
    }
    .el-date-editor .el-range-input{
      font-size: 13px
    }
}
.eleMeter{
    width: 360px;
    height: 560px;
    margin-right: 40px;
    @include background("mainBackGroundColor");
    p {
        // border-bottom: 1px solid #294fa7;
        border-bottom: 1px solid;
        @include border_color("formBorderHoverColor");
        height: 40px;
        line-height: 40px;
        // color: #fff;
        @include font_color('mainFontColor2');
        padding-left: 20px;
    }
}
.computer{
  width: 94px!important;
  height: 77px!important;
}
.computed {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}
.el-cascader-node.in-active-path{
  background-color: #034c90;
}
</style>
