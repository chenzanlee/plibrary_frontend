<template>
  <div class="onLine-back">
    <searchForm
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    >
      <template v-slot:right>
        <div class="nav-right-div">
          <div class="item">
            <!-- <img src="@/assets/image/fieldUnlock0.svg" alt="" srcset=""> -->
            <svg-icon class="iconfont or" icon-class="fieldUnlock0" />
            <span class="text">当前锁定总数</span>
            <span class="number or">{{ judgeBoolean(countObj.lockCount) }}</span>
          </div>
          <div class="item">
            <!-- <img src="@/assets/image/fieldUnlock1.svg" alt="" srcset=""> -->
            <svg-icon class="iconfont gr" icon-class="fieldUnlock1" />
            <span class="text">今日解锁数量</span>
            <span class="number gr">{{ judgeBoolean(countObj.unlockCount) }}</span>
          </div>
          <div class="item">
            <!-- <img src="@/assets/image/fieldUnlock2.svg" alt="" srcset=""> -->
            <svg-icon class="iconfont bl" icon-class="fieldUnlock2" />
            <span class="text">解锁比例</span>
            <span class="number bl">{{ judgeBoolean(countObj.unlockRate) === '---' ? '---' : judgeBoolean(countObj.unlockRate) + '%' }}</span>
          </div>
        </div>
      </template>
    </searchForm>
    <mychartCircle ref="mychartCircle" :json="navFormInfo.data" />
  </div>
</template>
<script>
import searchForm from '@/components/commonComponent/navForm'
import mychartCircle from '../../components/fieldUnlock/index'
import { getConfigElement } from '@/utils/overtService'
// import {
//   treeForRegionArea
// }
//   from '@/http/api/exportData/fieldUnlock'
import moment from 'moment'

export default {
  components: {
    searchForm,
    mychartCircle
  },
  data() {
    return {
      pageElement: [], // 页面数据权限
      countObj: { // 三个统计数据
        lockCount: '',
        unlockCount: '',
        unlockRate: ''
      },
      labelWidth: '100%',
      defaultValue: [], // 默认选中
      search: {
        fromTime: '',
        toTime: ''
      },
      navFormInfo: {
        data: {
          area: [], // 五级联动
          time: '', // 日期时间选择器
          radio: '1'
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                customLabel: 'regionName',
                customValue: 'regionNum',
                checkStrictly: true,
                className: 'shadow',
                clearable: true,
                placeholder: '大区 /区域',
                options: []
              },
              {
                key: 'time',
                type: 'date',
                className: 'shadow',
                dateType: 'daterange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              }

            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.$refs.mychartCircle.setEchart()
                  this.getCounObj()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  // this.$refs['navForm'].resetFields()
                  this.navFormInfo.data.area = []
                  // if (this.navFormInfo.data.area.length) {
                  this.$refs.mychartCircle.setEchart()
                  this.getCounObj()
                  // }
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
    this.pageElement = getConfigElement('UnitUnlockStatistics')
  },
  mounted() {
    this.setOption()
  },
  methods: {
    judgeBoolean(flag) {
      if (flag === undefined || flag === null || flag === '') return '---'
      else return flag
    },
    getCounObj() { // 获取三个统计数据
      const element = this.pageElement['queryTopInfo']
      const { area, time } = this.navFormInfo.data
      const params = {
        areaId: area[1] || null,
        endDate: time[0],
        regionId: area[0] || null,
        startDate: time[1]
      }
      this.$httpRequest({
        type: element && element.method,
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.countObj = res.data
          } else {
            // this.$message.error(res.message)
          }
        }
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
      const params = {}
      const pageElement = getConfigElement('unit-evcDataInterface')
      this.$httpRequest({
        type: 'GET',
        payload: params,
        uri: pageElement && pageElement.treeForRegionArea && pageElement.treeForRegionArea.uri,
        callback: data => {
          if (data.status === 200 && data.data.rows) {
            this.navFormInfo.fieldList.left.inpLists[0].options = data.data.rows
          }
        }
      })
      // await treeForRegionArea({}).then((data) => {
      //   if (data.data.rows === null) {
      //     return
      //   }
      //   this.navFormInfo.fieldList.left.inpLists[0].options = data.data.rows
      // })
      this.navFormInfo.data.time = [moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      this.$nextTick(() => {
        this.$refs.mychartCircle.setEchart()
      })
      this.getCounObj()
      // await this.defaultValueMe(this.navFormInfo.fieldList.left.inpLists[0].options)
      // this.navFormInfo.data.area = this.defaultValue
    }
  }
}
</script>
<style lang="scss">
.nav-right-div{
 height: 36px;
 display: flex;
 align-items: center;
 flex: 1;
 justify-content: flex-end;
//  color: #fff;
 @include font_color('mainFontColor2');
}
.nav-right-div .item{
  display: flex;
  align-items: center;
  font-size: 14px;
}
.nav-right-div .item:not(:last-child){
  margin-right: 20px;
}
.nav-right-div .item .text{
  padding: 0 4px;
}
.nav-right-div .or{
  // color: #F9EA42;
  color: #E31717;
}
.nav-right-div img{
  position: relative;
  top:1px;
}
.nav-right-div .number{
  position: relative;
  top:1px;
}
.nav-right-div .gr{
  // color: #1FFFA0;
  color: #00DC8E;
}
.nav-right-div .bl{
  // color: #1FBFFF;
  color: #FFBC45;
}
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
