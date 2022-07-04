<template>
  <div class="onLine-back">
    <div class="formPosition">
      <searchForm
        ref="navForm"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
        @cascaderEvent="cascaderEvent"
      >
        <span slot="right" v-hasAuth="'fieldDeviceOnlineStats:fieldOverviewExport'" class="export-img-box" @click="exportHandle">
          <el-button class="btn-blue">
            <svg-icon icon-class="newExport" />
            导出
          </el-button>
          <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
            <img src="@/assets/image/export.png">
          </el-tooltip> -->
        </span>
      </searchForm>
    </div>
    <div class="onlineMess">
      <div class="onlineMessDiv">
        <div class="border">
          <svg-icon class="icon" icon-class="online-court" />
        </div>
        <div class="onlineMess-number">
          <span>{{ json.onlineFieldNum }}</span>
          <span>在线场区</span>
        </div>
      </div>
      <div class="onlineMessDiv">
        <div class="border">
          <svg-icon class="icon" icon-class="title-facility" />
        </div>
        <div class="onlineMess-number">
          <span>{{ json.totalNum }}</span>
          <span>设备总数</span>
        </div>
      </div>
      <div class="onlineMessDiv">
        <div class="border">
          <svg-icon class="icon" icon-class="online-facility" />
        </div>
        <div class="onlineMess-number">
          <span>{{ json.onlineNum }}</span>
          <span>在线设备</span>
        </div>
      </div>
      <div class="onlineMessDiv">
        <div class="border">
          <svg-icon class="icon" icon-class="online-rate" />
        </div>
        <div class="onlineMess-number">
          <span>{{ json.onlineRate +'%' }}</span>
          <!-- <span>{{ (json.onlineRate*100).toFixed(0)+'%' }}</span> -->
          <span>设备在线率</span>
        </div>
      </div>
    </div>
    <situation :mess="mess" />

    <div style="width:100%;height:auto;display:flex;margin-top:20px;flex:1;">
      <facility v-if="!search.brand" :total="total" :online="online" />
      <facilityOnline v-if="search.brand" v-loading="isLoading" :search="search" :brand-data="brandData" />
      <outLineRegion v-loading="isLoading" :list="list" />
    </div>
  </div>
</template>
<script>
import facility from '../../components/onlineCondition/facility'
import facilityOnline from '../../components/onlineCondition/facilityOnline'
import outLineRegion from '../../components/onlineCondition/outLineRegion'
import situation from '../../components/onlineCondition/situation'
import searchForm from '@/components/commonComponent/navForm'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('fieldDeviceOnlineStats')
const fieldDeviceOverview = getConfigElement('unit-evcDataInterface')
export default {
  components: {
    facility,
    outLineRegion,
    situation,
    searchForm,
    facilityOnline
  },
  data() {
    return {
      total: [],
      treeLabels: [],
      online: [],
      isLoading: false,
      json: {
        onlineFieldNum: '', // 在线场区
        onlineRate: '',
        onlineNum: '',
        totalNum: ''
      },
      // 搜索参数列表
      search: {
        regionId: '',
        areaId: '',
        brand: ''
      },
      brandData: [10, 10], // 在线离线数对比
      list: [],
      mess: [],
      labelWidth: '100%',
      navFormInfo: {
        data: {
          area: [], // 大区区域场区
          type: '' // 设备型号
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
              },
              {
                key: 'type',
                type: 'select',
                className: 'shadow',
                label: '',
                placeholder: '设备',
                clearable: 'clearable',
                list: []
                // list: [
                //   {
                //     key: '华诚设备',
                //     value: 'MCU_HUACHENG'
                //   },
                //   {
                //     key: '自研设备',
                //     value: 'MCU_ZIYAN'
                //   }
                // ]
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                authCode: 'fieldDeviceOnlineStats:getDistributedDeviceStats',
                handleClick: () => {
                  const json = {
                    regionId: this.navFormInfo.data.area[0],
                    areaId: this.navFormInfo.data.area[1],
                    brand: this.navFormInfo.data.type
                  }
                  if (this.navFormInfo.data.area.legnth > 0) {
                    json.regionId = this.navFormInfo.data.area[0]
                    json.brand = this.navFormInfo.data.type
                  } else {
                    json.regionId = this.navFormInfo.data.area[0]
                    json.areaId = this.navFormInfo.data.area[1]
                    json.brand = this.navFormInfo.data.type
                  }
                  this.search = json
                  this.setChart(this.search)
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.treeLabels = []
                  this.$refs['navForm'].resetFields()
                  this.setChart({})
                }
              }
              // {
              //   innerText: '导出',
              //   className: 'btn-blue',
              //   authCode: 'fieldDeviceOnlineStats:fieldOverviewExport',
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
  mounted() {
    this.setChart()
    this.getEquipmentTypes()
  },
  created() {

  },
  methods: {
    // 获取设备列表
    getEquipmentTypes() {
      const arr = []
      this.$httpRequest({
        type: 'GET',
        payload: {},
        uri: '/unit_evc/fieldOverview/getEquipmentTypes',
        callback: res => {
          this.isLoading = false
          if (res.status === 200 && res.rel) {
            console.log(res)
            res.data.map(ele => {
              arr.push(
                {
                  key: ele.title,
                  value: ele.code
                }
              )
            })
            this.navFormInfo.fieldList.right.inpLists[1].list = arr
          }
        }
      })
    },
    cascaderEvent(path, labels) {
      this.treeLabels = labels
    },
    exportHandle() {
      const { area, type } = this.navFormInfo.data
      const json = {
        regionId: area[0] || '',
        areaId: area[1] || '',
        regionName: this.treeLabels[0] || '',
        areaName: this.treeLabels[1] || '',
        equipmentType: type
      }
      this.$httpExport({
        // uri: pageElement && pageElement.fieldOverviewExport && pageElement.fieldOverviewExport.uri,
        uri: '/unit_evc/fieldOverview/exportV2',
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
    setField() {
      this.list = []
      const obj = {
        regionId: this.navFormInfo.data.area[0],
        areaId: this.navFormInfo.data.area[1],
        equipmentType: this.navFormInfo.data.type
      }
      this.$httpRequest({
        type: 'GET',
        payload: obj,
        uri: '/unit_evc/fieldOverview/getOfflineFieldsByEquipmentType',
        // uri: pageElement && pageElement.getOfflineFields && pageElement.getOfflineFields.uri,
        callback: data => {
          this.isLoading = false
          if (data.rel) {
            this.list = data.data
          }
        }
      })
    },
    setChart(json) {
      const that = this
      console.log(pageElement)
      let arr = []
      arr = [[], [], [], []]
      that.total = []
      that.online = []
      const obj = {
        regionId: this.navFormInfo.data.area[0],
        areaId: this.navFormInfo.data.area[1],
        equipmentType: this.navFormInfo.data.type
      }
      this.isLoading = true
      this.$httpRequest({
        type: 'GET',
        payload: obj,
        // uri: pageElement && pageElement.getDistributedDeviceStats && pageElement.getDistributedDeviceStats.uri,
        uri: '/unit_evc/fieldOverview/getDistributedDeviceStatsByEquipmentType',
        callback: data => {
          this.isLoading = false
          if (!data.rel) return
          that.json.onlineFieldNum = data.data.onlineFieldNum
          that.json.onlineRate = data.data.onlineRate
          that.json.onlineNum = data.data.onlineNum
          that.json.totalNum = data.data.totalNum
          // const sortArr = data.data.series
          // function sortId(a, b) {
          //   return b.totalNum - a.totalNum
          // }
          // sortArr.sort(sortId)
          // for (var i = 0; i < data.data.series.length; i++) {
          //   arr[0].push(data.data.series[i].areaName)
          //   arr[1].push(data.data.series[i].onlineNum)
          //   arr[2].push(data.data.series[i].totalNum)
          //   arr[3].push(data.data.series[i].onlineRate)
          //   // arr[3].push(sortArr[i].onlineRate * 100)
          // }
          data.data.series.map(ele => {
            arr[0].push(ele.areaName)
            arr[1].push(ele.onlineNum)
            arr[2].push(ele.totalNum)
            arr[3].push(ele.onlineRate)
          })
          console.log(arr)
          that.mess = arr
          if (!that.search.brand) {
            that.total = [
              that.returnZero(data.data.Building.totalNum),
              that.returnZero(data.data.Boar.totalNum),
              that.returnZero(data.data.PiggeryShower.totalNum),
              that.returnZero(data.data.Bungalow.totalNum)
            ]
            that.online = [
              that.returnZero(data.data.Building.onlineNum),
              that.returnZero(data.data.Boar.onlineNum),
              that.returnZero(data.data.PiggeryShower.onlineNum),
              that.returnZero(data.data.Bungalow.onlineNum)
            ]
          } else {
            const arr = []
            if (that.search.brand === 'Building') {
              arr[0] = data.data.Building.onlineNum
              arr[1] = data.data.Building.offlineNum
            } else if (that.search.brand === 'Bungalow') {
              arr[0] = data.data.Bungalow.onlineNum
              arr[1] = data.data.Bungalow.offlineNum
            } else if (that.search.brand === 'PiggeryShower') {
              arr[0] = data.data.PiggeryShower.onlineNum
              arr[1] = data.data.PiggeryShower.offlineNum
            } else if (that.search.brand === 'Boar') {
              arr[0] = data.data.Boar.onlineNum
              arr[1] = data.data.Boar.offlineNum
            } else {
              arr[0] = 0
              arr[1] = 0
            }
            // if (that.search.brand === 'MCU_HUACHENG') {
            //   arr[0] = data.data.huaCheng.onlineNum
            //   arr[1] = data.data.huaCheng.offlineNum
            // } else {
            //   arr[0] = data.data.ziYan.onlineNum
            //   arr[1] = data.data.ziYan.offlineNum
            // }
            that.brandData = arr
          }
        }
      })
      this.setField()
      // 设备在线情况多线图动态数据
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
      } return data
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
</style>
<style lang="scss" scoped>
.export-img-box {
    padding-right: 20px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
}
// .formPosition {
  // width: 50%;
  // position: fixed;
  // right: 0;
  // top: 73px;
// }
.onlineMess {
  width: 100%;
  height: 80px;
  display: flex;
  margin-top:5px;
  margin-bottom: 20px;
}
.onlineMessDiv {
  width: calc(100% - 80px);
  height: 100%;
  border-radius: 4px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.onlineMessDiv{
  .border{
    width: 50px;
    height:50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-right: 10px;
    svg{
      width: 24px;
      height: 24px;
    }
  }
}
.onlineMessDiv:nth-of-type(1) {
  background-image: linear-gradient(46deg, #ff7134 0%, #ff5988 100%);
  .border{
    border:1px solid white;
  }
}
.onlineMessDiv:nth-of-type(2) {

  background-image: linear-gradient(46deg, #cb63d3 0%, #1c6df8 100%);
  .border{
    border:1px solid white;
  }
}
.onlineMessDiv:nth-of-type(3) {
  border:1px solid #948ddd;
  background-image: linear-gradient(46deg, #619aff 0%, #c346ff 100%);
  .border{
    border:1px solid white;
  }
}
.onlineMessDiv:nth-of-type(4) {
  background-image: linear-gradient(46deg, #15e0f8 0%, #007ef9 100%);
  .border{
    border:1px solid white;
  }
  margin-right: 0;
}

.onlineMess-number {
  width: 60px;
  display: flex;
  flex-direction: column;
  height: 40px;
  justify-content: space-between;
  align-items: flex-start;
  color: #fff;
  font-weight:600;
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
  // padding-top: 20px;
  // border-top: 1px solid #313c82;
}
</style>
