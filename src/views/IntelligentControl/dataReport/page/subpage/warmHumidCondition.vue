<template>
  <div class="onLine-back">
    <searchForm
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
      @cascaderEvent="cascaderEvent"
    >
      <span slot="right" class="export-img-box" @click="exportHandle">
        <el-button class="btn-blue">
          <svg-icon icon-class="newExport" />
          导出
        </el-button>
      </span>
    </searchForm>
    <mychartCircle ref="mychartCircle" :json="navFormInfo.data" />
  </div>
</template>
<script>
import searchForm from '@/components/commonComponent/navForm'
import mychartCircle from '../../components/warmHumid/index'
import { getConfigElement } from '@/utils/overtService'
const unitPageElement = getConfigElement('UnitTempSeneorType')
export default {
  components: {
    searchForm,
    mychartCircle
  },
  data() {
    return {
      labelWidth: '100%',
      defaultValue: [], // 默认选中
      search: {},
      navFormInfo: {
        data: {
          area: [], // 五级联动
          scopeName: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                checkStrictly: true,
                customLabel: 'regionName',
                customValue: 'regionNum',
                clearable: true,
                className: 'shadow',
                placeholder: '大区 /区域',
                options: []
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.$refs.mychartCircle.setEchart()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.search = []
                  this.$refs['navForm'].resetFields()
                  this.$refs.mychartCircle.setEchart()
                }
              },
              {
                innerText: '导出明细',
                className: 'btn-blue',
                authCode: '',
                handleClick: () => {
                  const json = {
                    regionId: this.navFormInfo.data.area[0] || '',
                    areaId: this.navFormInfo.data.area[1] || ''
                  }
                  const uri = unitPageElement && unitPageElement.unitTempSeneorTypeDetailedExportV2 && unitPageElement.unitTempSeneorTypeDetailedExportV2.uri
                  this.$httpExport({
                    uri,
                    payload: json
                  })
                }
              }
            ]
          },
          right: {

          }
        }
      }

    }
  },
  created() {
    this.setOption()
  },
  methods: {
    cascaderEvent(value, labels) {
      this.search = labels
    },
    exportHandle() {
      const regionName = this.search[0] || ''
      const areaName = this.search[1] || ''
      const json = {
        regionId: this.navFormInfo.data.area[0] || '',
        regionName: regionName || '',
        areaId: this.navFormInfo.data.area[1] || '',
        areaName: areaName || ''
      }
      const uri = unitPageElement && unitPageElement.unitTempSeneorTypeExportV2 && unitPageElement.unitTempSeneorTypeExportV2.uri
      this.$httpExport({
        uri,
        payload: json
      })
    },
    async setOption() {
      const pageElement = getConfigElement('unit-evcDataInterface')
      this.$httpRequest({
        type: 'GET',
        payload: {},
        uri: pageElement && pageElement.treeForRegionArea && pageElement.treeForRegionArea.uri,
        callback: data => {
          if (data.status === 200 && data.data.rows) {
            this.navFormInfo.fieldList.left.inpLists[0].options = data.data.rows
          }
        }
      })
    }
  }
}
</script>
<style lang="css">

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
<style lang="css" scoped>
.formPosition {
  width: 50%;
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
  /* padding-bottom: 10px; */
  box-sizing: border-box;
}
</style>
