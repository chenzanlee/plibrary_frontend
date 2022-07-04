<template>
  <!-- 集团概览页面 -->
  <div class="main">
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" @cascaderEvent="cascaderEvent" />
    <article class="container">
      <div class="con-left">
        <div class="con-left-1 public-style">
          <facility :tip-title="showImpMsc" :list-data="impRate" :name="name1">
            <div slot="title"><span>环控实施概况</span></div>
            <div slot="name"><span>单元实施率</span></div>
          </facility>
        </div>
        <div class="con-left-2 public-style">
          <facility :tip-title="showOnLineMsc" :list-data="onlineRate" :name="name2">
            <div slot="title"><span>环控在线概况</span></div>
            <div slot="name"><span>单元在线率</span></div>
          </facility>
        </div>
        <div class="con-left-3 public-style">
          <facility-more :list-data="overviewData">
            <div slot="title"><span>单元舒适度概况</span></div>
          </facility-more>
        </div>
      </div>
      <div class="con-center">
        <div class="inner">
          <el-row :gutter="10" style="width:100%;margin-left:0;margin-right:0;">
            <el-col v-for="(item) in allFielData" :key="item.fieldId" :sm="24" :md="12" :lg="8" :xl="8">
              <div class="inner-con">
                <card-detail :list-data="item" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="con-right">
        <div class="con-right-1 public-style">
          <ranking-list-imp :list-data="rateData">
            <div slot="title">
              各场区智能环控实施排名
            </div>
          </ranking-list-imp>
        </div>
        <div class="con-right-1 public-style">
          <ranking-list :list-data="onlineData">
            <div slot="title">
              各场区智能环控在线排名
            </div>
          </ranking-list>
        </div>
      </div>
    </article>
  </div>
</template>
<script>
import { getConfigElement } from '@/utils/overtService'
const fieldDeviceOverview = getConfigElement('unit-evcDataInterface')

import rankingList from '@/views/IntelligentControl/regionOverview/components/rankingList'
import rankingListImp from '@/views/IntelligentControl/regionOverview/components/rankingListImp'
import facility from '@/views/IntelligentControl/regionOverview/components/facility'
import facilityMore from '@/views/IntelligentControl/regionOverview/components/facilityMore'
import cardDetail from '@/views/IntelligentControl/regionOverview/components/cardDetail'
import navForm from '@/components/commonComponent/navForm'
export default {
  name: 'GroupOverview',
  components: {
    rankingList,
    rankingListImp,
    facility,
    facilityMore,
    cardDetail,
    navForm
  },
  data() {
    return {
      name1: '实施率',
      name2: '在线率',
      initData: {
        regionId: '',
        areaId: ''
      },
      navFormInfo: {
        data: {
          area: [],
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                // checkStrictly: true,
                customLabel: 'regionName',
                customValue: 'regionNum',
                className: 'shadow',
                placeholder: '大区/区域',
                options: []
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  if (!this.navFormInfo.data.area) {
                    this.$message.error('请选择正确的区域')
                    return
                  }
                  this.init(this.initData)
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.initData.areaId = 13902
                  this.initData.regionId = 2
                  this.navFormInfo.data.area = ['2', '13902']
                  this.init(this.initData)
                }
              }
            ]
          }
        }
      },
      pageElement: '',
      headers: '',
      areaTree: [], // 区域树
      onlineData: [], // 在线率
      allFielData: [], // 区域所有场区
      rateData: [], // 实施率
      overviewData: {}, // 所有概况
      impRate: 0, // 环控实施概况
      onlineRate: 0, // 环控在线概况
      showImpMsc: '区域已接入智能环控的单元数/区域单元总数',
      showOnLineMsc: '区域已接入智能环控在线单元数/区域已接入环控单元总数'
    }
  },
  watch: {

  },

  created() {
    this.headers = {
      appCode: 'unit-evc',
      Authorization: localStorage.getItem('MY-Admin-Token'),
      'X-Requested-With': 'XMLHttpRequest'
    }
    this.pageElement = getConfigElement('dataView')
    this.getTree()
    this.isRouterJump()
  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {
    cascaderEvent(value, val2, val3) { // 区域树事件
      if (value.length === 0) {
        this.regionId = ''
        this.areaId = ''
      } else if (value.length === 1) {
        this.regionId = value[0]
      } else if (value.length === 2) {
        this.regionId = value[0]
        this.areaId = value[1]
        this.initData.regionId = value[0]
        this.initData.areaId = value[1]
      }
    },
    init(val) { // 初始化获取所有
      this.getAllOverData(val)
      this.getAllLineData(val)
      this.getAllField(val)
      this.getAllImplementData(val)
    },
    isRouterJump() { // 判断处理路由跳转事件
      const data = sessionStorage.getItem('unitDataOverviewAreas') ? JSON.parse(sessionStorage.getItem('unitDataOverviewAreas')) : {}
      if (data && data.areaId) {
        this.initData.regionId = data.regionId
        this.initData.areaId = data.areaId
        this.navFormInfo.data.area = [data.regionId, data.areaId]
        // console.log('+++++++++')
      } else {
        // const regions = sessionStorage.getItem('unitEvcRegions') ? JSON.parse(sessionStorage.getItem('unitEvcRegions')) : {}
        // if (regions.value) {
        //   this.regionId = regions.value
        // }
        // const areas = sessionStorage.getItem('unitEvcAreas') ? JSON.parse(sessionStorage.getItem('unitEvcAreas')) : {}
        // if (areas.value) {
        //   this.selectedArea.name = areas.name
        //   this.selectedArea.value = areas.value
        // }
        sessionStorage.setItem('unitEvcAreas', JSON.stringify(this.selectedArea))
        this.initData.areaId = 13902
        this.initData.regionId = 2
        this.navFormInfo.data.area = ['2', '13902']
      }
      // console.log('🚀 ~ file: index.vue ~ line 200 ~ isRouterJump ~ this.initData', this.initData)
      this.init(this.initData)
    },
    getTree() { // 获取区域树
      this.$httpRequest({
        type: 'GET',
        uri: fieldDeviceOverview && fieldDeviceOverview.getTreeForRegionArea && fieldDeviceOverview.getTreeForRegionArea.uri,
        callback: res => {
          if (res.status === 200) {
            this.navFormInfo.fieldList.left.inpLists[0].options = res.data.rows
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllOverData(par) { // 获取所有概况数据
      const element = this.pageElement['getOverview']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par && par.regionId || '',
        areaId: par && par.areaId || ''
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.overviewData = res.data
            this.impRate = res.data && res.data.impRate !== null ? res.data.impRate : 0
            this.onlineRate = res.data && res.data.onlineRate !== null ? res.data.onlineRate : 0
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllLineData(par) { // 获取在线排名
      const element = this.pageElement['getOnlineInfoList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par && par.regionId || '',
        areaId: par && par.areaId || ''
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.onlineData = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllImplementData(par) { // 获取实施排名
      const element = this.pageElement['getImplementationList']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par && par.regionId || '',
        areaId: par && par.areaId || ''
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.rateData = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    getAllField(par) { // 获取区域所有场区信息
      const element = this.pageElement['getFieldOverview']
      if (!element) {
        this.$message.error('用户权限不足')
        return
      }
      const params = {
        regionId: par && par.regionId || '',
        areaId: par && par.areaId || ''
      }
      this.$httpRequest({
        type: element.method,
        uri: element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.allFielData = res.data
          } else {
            this.$message.error(res.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
 .main{
   width: 100%;
  //  height: calc(100vh - 128px);
   height: calc(100vh - 185px);
   color: #fff;
   font-size: .75rem;
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    // border: 1px solid red;
    .con-left{
      height: 100%;
      width: 22.78%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .con-left-1{
        width: 100%;
        height: 28%;
      }
      .con-left-2{
        width: 100%;
        height: 28%;
      }
      .con-left-3{
        width: 100%;
        height: 40%;
      }
    }
    .con-center{
      height: 100%;
      width: 57.66%;
      .inner{
        height: 100%;
        width: 100%;
        overflow-y: auto;
        .inner-con{
          height: 14.5625rem;
          margin-bottom: .625rem;
        }
      }

    }
    .con-right{
      height: 100%;
      width: 18.23%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .con-right-1{
        width: 100%;
        height: 49%;
      }
    }
  }
 }
 .public-style{
    // background: rgba(28,28,95,0.5);
    @include background_color('viewBackGround1');
    padding: .625rem;
    // border: .0625em solid #6498ff;
    border: .0625em solid;
    @include border_color('viewBorderColor');
    border-radius: .25em;
    // box-shadow: 0px 0px .9375em 0px #1c63ff inset;
    @include box_shadow('viewBoxShadow');
 }
</style>
