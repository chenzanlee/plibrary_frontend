<template>
  <div class="onLine-back">
    <div class="formPosition">
      <searchForm
        ref="navForm"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
      >
        <span slot="right" style="margin-right:10px" @click="exportHandle">
          <el-button class="btn-blue">
            <svg-icon icon-class="newExport" />
            导出
          </el-button>
        </span>
        <span slot="right" @click="exportdetailHandle">
          <el-button class="btn-blue">
            导出明细
          </el-button>
        </span>
      </searchForm>
      <div class="comfor_updateTime" style="margin-bottom: 10px">
        报表生成时间：{{ updateTime }}（每整点生成一次）
      </div>
    </div>
    <div style="width:100%;height:100%;">
      <situation v-loading="isLoading" :mess="mess" />
    </div>
  </div>
</template>
<script>
import situation from '../../components/onlineCondition/situation_comfor'
import searchForm from '@/components/commonComponent/navForm'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('comfortableReport')
const fieldDeviceOverview = getConfigElement('unit-evcDataInterface')
export default {
  components: {
    situation,
    searchForm
  },
  data() {
    return {
      isLoading: false,
      // 搜索参数列表
      search: {
        regionId: '',
        areaId: ''
      },
      updateTime: '2020-12-12 12:00:00',
      mess: [],
      labelWidth: '100%',
      navFormInfo: {
        data: {
          area: [], // 大区区域场区
          type: [] // 设备型号
        },
        fieldList: {
          left: {},
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                customLabel: 'regionName',
                customValue: 'regionNum',
                checkStrictly: true,
                clearable: true,
                className: 'shadow',
                placeholder: '大区 / 区域',
                options: []
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'fieldDeviceOnlineStats:getDistributedDeviceStats',
                handleClick: () => {
                  const json = {
                    regionId: '',
                    areaId: ''
                  }
                  if (this.navFormInfo.data.area.legnth > 0) {
                    json.regionId = Number(this.navFormInfo.data.area[0])
                  } else {
                    json.regionId = Number(this.navFormInfo.data.area[0])
                    json.areaId = Number(this.navFormInfo.data.area[1])
                  }
                  this.search = json
                  this.setChart(this.search)
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.search = {}
                  this.setChart(this.search)
                }
              }
              // {
              //   innerText: '导出明细',
              //   className: 'btn-blue',
              //   authCode: '',
              //   handleClick: () => {
              //     const json = {
              //       regionId: '',
              //       areaId: ''
              //     }
              //     if (this.navFormInfo.data.area.length > 0) {
              //       json.regionId = this.navFormInfo.data.area[0] || ''
              //       json.areaId = this.navFormInfo.data.area[1] || ''
              //     }
              //     const uri = pageElement && pageElement.exportComfortInfoDetail && pageElement.exportComfortInfoDetail.uri
              //     this.$httpExport({
              //       uri,
              //       payload: json
              //     })
              //     // derive('/api/unit_evc/tempSensor/unitTempSeneorTypeDetailedExport', json)
              //   }
              // }
            ]
          }
        }
      }
    }
  },
  mounted() {
    this.setChart()
  },
  created() {

  },
  methods: {
    exportHandle() {
      const json = {
        regionId: '',
        areaId: ''
      }
      if (this.navFormInfo.data.area.length > 0) {
        json.regionId = this.navFormInfo.data.area[0] || ''
        json.areaId = this.navFormInfo.data.area[1] || ''
      }
      this.search = json
      console.log(this.search)
      this.$httpExport({
        uri: pageElement && pageElement.exportComfortInfo && pageElement.exportComfortInfo.uri,
        payload: this.search
      })
    },
    exportdetailHandle() {
      const json = {
        regionId: '',
        areaId: ''
      }
      if (this.navFormInfo.data.area.length > 0) {
        json.regionId = this.navFormInfo.data.area[0] || ''
        json.areaId = this.navFormInfo.data.area[1] || ''
      }
      const uri = pageElement && pageElement.exportComfortInfoDetail && pageElement.exportComfortInfoDetail.uri
      this.$httpExport({
        uri,
        payload: json
      })
    },
    returnZero(data) {
      if (data === null) {
        return 0
      } else {
        return data
      }
    },

    setChart(json = {}) {
      const that = this
      this.$httpRequest({
        type: 'GET',
        payload: json,
        uri: fieldDeviceOverview && fieldDeviceOverview.getTreeForRegionArea && fieldDeviceOverview.getTreeForRegionArea.uri,
        callback: data => {
          if (data.data && Array.isArray(data.data.rows)) {
            that.navFormInfo.fieldList.right.inpLists[0].options = data.data.rows
          }
        }
      })
      this.$httpRequest({
        type: 'POST',
        payload: json,
        uri: pageElement && pageElement.getOtherInfo && pageElement.getOtherInfo.uri,
        callback: res => {
          if (res.status === 200) {
            this.updateTime = res.data.updateTime
          }
        }
      })

      const arr = [[], [], [], [], [], [], [], []]
      this.isLoading = true
      this.$httpRequest({
        type: 'POST',
        payload: json,
        uri: pageElement && pageElement.getComfortInfo && pageElement.getComfortInfo.uri,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            const { data } = res
            for (var i = 0; i < data.length; i++) {
              const name = data[i].areaName ? data[i].fieldName ? data[i].fieldName : data[i].areaName : data[i].regionName
              arr[0].push(name)
              arr[1].push(data[i].totalUnitCount)
              arr[2].push(data[i].comfortCount)
              arr[3].push(data[i].comfortRate)
              arr[4].push(data[i].unComfortCount)
              arr[5].push(data[i].unComfortRate)
              arr[6].push(data[i].emptySweepUnitCount)
              arr[7].push(data[i].offlineUnitCount)
            }
            that.mess = arr
          }
        }
      })
    }

  }
}
</script>
<style lang="scss" >

.gutter{
  display: none!important;
}
.el-cascader-node.is-selectable.in-active-path {
  color: #fff !important;
}
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar{
  display: none!important;
  background-color: transparent!important;
}
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb{
   display: none;
   height:50px;
   outline-offset:-2px;
   outline:2px solid #fff;
   border-radius:4px;
   border: 2px solid #fff;
}
.el-table--scrollable-y{
  background-color: var(--border)!important;
}
.comfor_updateTime{
  color: #fff;
  @include font_color('comfor_updateTime')
}
</style>
<style lang="scss" scoped>
.onLine-back {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.formPosition {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
</style>
