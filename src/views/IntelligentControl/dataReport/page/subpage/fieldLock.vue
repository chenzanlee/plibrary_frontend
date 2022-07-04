<template>
  <div class="onLine-back">
    <searchForm
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    >
      <span slot="right" v-hasAuth="'fieldUnitLockStats:paramLockExport'" class="export-img-box" @click="exportHandle">
        <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
          <img src="@/assets/image/export.png">
        </el-tooltip> -->
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
import mychartCircle from '../../components/fieldLock/index'
// import { treeForRegionArea } from '@/http/api/exportData/cellLock'
// import { derive } from '@/http/api/exportData/export'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('fieldUnitLockStats')
export default {
  components: {
    searchForm,
    mychartCircle
  },
  data() {
    return {
      labelWidth: '100%',
      defaultValue: [], // 默认选中
      navFormInfo: {
        data: {
          cascader1: [], // 五级联动
          cascader2: [] // 日期时间选择器
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'cascader1',
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
                handleClick: () => {
                  this.$refs.mychartCircle.setMap()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.$refs.mychartCircle.setMap()
                }
              }
              // {
              //   innerText: '导出',
              //   className: 'btn-blue',
              //   authCode: 'fieldUnitLockStats:paramLockExport',
              //   handleClick: () => {
              //     this.exportHandle()
              //   }
              // }
            ]
          },
          right: {

          }
        }
      }

    }
  },
  mounted() {

  },
  created() {
    this.setOption()
  },
  methods: {
    exportHandle() {
      const json = {
      }
      if (this.navFormInfo.data.cascader1[0]) {
        json.regionId = this.navFormInfo.data.cascader1[0]
      }
      if (this.navFormInfo.data.cascader1[1]) {
        json.areaId = this.navFormInfo.data.cascader1[1]
      }
      const uri = pageElement && pageElement.paramLockExport && pageElement.paramLockExport.uri
      this.$httpExport({
        uri,
        payload: json
      })
    },
    // 默认选中
    defaultValueMe(arr) {
      if (!arr) {
        return
      }
      this.defaultValue.push(arr[0].regionNum)
      if (arr[0].children) {
        this.defaultValueMe(arr[0].children)
      }
    },
    async setOption() {
      // unit-evcDataInterface:treeForRegionArea
      const params = {}
      const pageElement = getConfigElement('unit-evcDataInterface')
      this.$httpRequest({
        type: 'GET',
        payload: params,
        uri: pageElement && pageElement.treeForRegionArea && pageElement.treeForRegionArea.uri,
        callback: data => {
          if (data.status === 200 && data.data.rows) {
            this.navFormInfo.fieldList.left.inpLists[0].options = data.data.rows
            this.$refs.mychartCircle.setMap()
          }
        }
      })
      // await treeForRegionArea({}).then((data) => {
      //   if (data.data.rows === null) {
      //     return
      //   }
      //   this.navFormInfo.fieldList.left.inpLists[0].options = data.data.rows
      //   this.$refs.mychartCircle.setMap()
      // })
      // await this.defaultValueMe(this.navFormInfo.fieldList.left.inpLists[0].options)
      // this.navFormInfo.data.cascader1 = this.defaultValue
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
