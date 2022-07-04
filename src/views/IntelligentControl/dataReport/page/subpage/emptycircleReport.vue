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
    </div>
    <div style="width:100%;height:100%;">
      <emptyUnitReport v-loading="isLoading" :mess="mess" />
    </div>
  </div>
</template>
<script>
import emptyUnitReport from '../../components/emptycircleReport'
import searchForm from '@/components/commonComponent/navForm'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    searchForm,
    emptyUnitReport
  },
  data() {
    return {
      labelWidth: '100%',
      isLoading: false,
      pageElement: [], // 页面权限数组
      commonElement: [], // 数据接口权限数组
      mess: [],
      search: {
        regionId: '',
        areaId: ''
      },
      navFormInfo: {
        data: {
          area: [],
          type: []
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
                authCode: '',
                handleClick: () => {
                  const json = {
                    regionId: '',
                    areaId: ''
                  }
                  if (this.navFormInfo.data.area.legnth > 0) {
                    json.regionId = this.navFormInfo.data.area[0]
                  } else {
                    json.regionId = this.navFormInfo.data.area[0]
                    json.areaId = this.navFormInfo.data.area[1]
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
                  this.search = {
                    regionId: '',
                    areaId: ''
                  }
                  this.setChart(this.search)
                }
              }
            ]
          }
        }
      }
    }
  },
  mounted() {
    this.pageElement = getConfigElement('emptyUnitReport')
    this.commonElement = getConfigElement('unit-evcDataInterface')
    this.getTreeForRegionArea()
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
      const element = this.pageElement['exportEmptyUnitInfo']
      this.$httpExport({
        type: element.method ? element.method : '',
        uri: element.uri ? element.uri : '',
        payload: json
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
      this.search = json
      const element = this.pageElement['exportEmptyUnitInfoDetail']
      this.$httpExport({
        uri: element.uri ? element.uri : '',
        payload: this.search
      })
    },
    getTreeForRegionArea() {
      const element = this.commonElement['getTreeForRegionArea']
      this.$httpRequest({
        type: element.method ? element.method : '',
        uri: element.uri ? element.uri : '',
        callback: data => {
          if (data.status === 200 && data.data.rows) {
            this.navFormInfo.fieldList.right.inpLists[0].options = data.data.rows
          }
        }
      })
    },
    setChart(json = {}) {
      const element = this.pageElement['getEmptyUnitInfo']
      this.isLoading = true
      this.$httpRequest({
        type: element.method ? element.method : '',
        uri: element.uri ? element.uri : '',
        payload: json,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            const arr = [[], [], [], []]
            const { data } = res
            data.map((item, i) => {
              const name = data[i].areaName ? (data[i].fieldName ? data[i].fieldName : data[i].areaName) : data[i].regionName
              arr[0].push(name)
              arr[1].push(data[i].totalUnitCount)
              arr[2].push(data[i].emptyUnitCount)
              arr[3].push(data[i].emptyRate)
            })
            this.mess = arr
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
