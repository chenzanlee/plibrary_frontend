<template>
  <div class="comforCont">
    <searchForm
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    >
      <div slot="left" class="top-tab-container">
        <el-button
          :class="{ active: activeTab === 'notBuliding', 'topBtn':true }"
          style="padding:12px;"
          @click="changeTopBtn('notBuliding')"
        >平房</el-button>
        <el-button
          :class="{ active: activeTab === 'isBuliding', 'topBtn':true }"
          style="padding:12px;"
          @click="changeTopBtn('isBuliding')"
        >楼房</el-button>
      </div>
    </searchForm>
    <div v-loading="loading" class="comforContent Highlight">
      <el-tabs v-model="activeName" class="comforTabs" @tab-click="tabhandleClick">
        <el-tab-pane label="待审核" name="0">
          <tableItems type="0" :list="list" @getinit="getinit" />
        </el-tab-pane>
        <el-tab-pane label="已通过" name="2">
          <tableItems type="2" :list="list" @getinit="getinit" />
        </el-tab-pane>
        <el-tab-pane label="未通过" name="1">
          <tableItems type="1" :list="list" @getinit="getinit" />
        </el-tab-pane>
      </el-tabs>
      <div v-if="list.length > 0" class="flex_r">
        <el-pagination
          class="buttons jurisdiction-distribution-r-head-pagin"
          background
          :page-sizes="[12]"
          layout="total, prev, pager, next, sizes,jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

</template>
<script>
import searchForm from '@/components/commonComponent/navForm'
import tableItems from './items'
import { getConfigElement } from '@/utils/overtService'
// import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import {
  getRegionAreaFieldTree,
  getRootTypeUnitTreeV2
} from '@/http/api/baseInfo/regionAreaField.js'
export default {
  components: {
    searchForm,
    tableItems
  },
  data() {
    return {
      activeTab: 'notBuliding',
      loading: false,
      total: 10,
      page: 1,
      limit: 12,
      online: [],
      pageElement: null,
      activeName: '0',
      list: [],
      navFormInfo: {
        labelWidth: '50px',
        data: {
          area: [], // 大区区域场区
          roomtypeUnit: [],
          time: '' // 设备型号
          // status: ''
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                checkStrictly: true,
                customLabel: 'title',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                clearable: true,
                valueKey: 0,
                options: [],
                handleChange: (v1) => {
                  if (v1.length === 3) {
                    getRootTypeUnitTreeV2({ fieldId: v1[2], isBuilding: this.activeTab !== 'notBuliding' }).then(data => {
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
                checkStrictly: true,
                customLabel: 'title',
                className: 'shadow',
                placeholder: '猪舍类型 / 单元',
                clearable: true,
                valueKey: 1,
                options: []
              },
              {
                key: 'time',
                // label: '时间',
                // width: '500px',
                type: 'dateTime',
                className: 'shadow',
                dateType: 'datetimerange',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              }
              // {
              //   key: 'status',
              //   type: 'radio',
              //   required: true,
              //   width: '220px',
              //   className: 'shadow',
              //   placeholder: '333',
              //   customLabel: 'name',
              //   customVal: 'val',
              //   optList: [{ name: '全部', val: '' }, { name: '已审核', val: 'AUDITED' }, { name: '未审核', val: 'NORMAL' }]
              // }
            ],
            btnLists: [
              {
                label: '操作',
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.page = 1
                  this.init()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.page = 1
                  this.init()
                }
              }
            ]
          },
          left: {}
        }
      }
    }
  },
  watch: {
    'navFormInfo.data.area': {
      handler: function(n) {
        if (n.length === 0) {
          this.navFormInfo.fieldList.right.inpLists[0].valueKey++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
          this.navFormInfo.fieldList.right.inpLists[1].valueKey++
        }
      },
      deep: true
    }
  },
  created() {
    this.pageElement = getConfigElement('comfortReview')
    this.getTree()
  },
  mounted() {
    this.init()
  },
  methods: {
    changeTopBtn(item) {
      if (this.activeTab === item) {
        return
      }
      if (item === 'isBuliding') {
        this.navFormInfo.fieldList.right.inpLists[1].placeholder = '楼座 / 猪舍类型 / 单元'
      } else {
        this.navFormInfo.fieldList.right.inpLists[1].placeholder = '猪舍类型 / 单元'
      }
      this.activeTab = item
      this.navFormInfo.data.area = []
      this.navFormInfo.data.roomtypeUnit = []
      this.getTree()
    },
    getTree() {
      getRegionAreaFieldTree({ isBuilding: this.activeTab !== 'notBuliding' }).then(data => {
        if (data.status === 200 && data.rel) {
          this.navFormInfo.fieldList.right.inpLists[0].options = data.data
        } else {
          this.navFormInfo.fieldList.right.inpLists[0].options = []
        }
      })
      // const pageElement = getConfigElement('unit-evcDataInterface')
      // const dataInterface = pageElement['getRegionAreaFieldRoomTypeUnitV2']
      // this.$httpRequest({
      //   type: dataInterface.method,
      //   uri: dataInterface.uri,
      //   payload: { isBuilding: false },
      //   callback: data => {
      //     const arr = evcJsonh2Tree(data.data)
      //     this.navFormInfo.fieldList.right.inpLists[0].options = arr
      //   }
      // })
    },
    init() {
      const { area, roomtypeUnit, time } = this.navFormInfo.data
      const params = {
        regionId: area && area[0] || null,
        areaId: area && area[1] || null,
        fieldId: area && area[2] || null,
        segmentId: roomtypeUnit && roomtypeUnit[0] || null,
        unitId: roomtypeUnit && roomtypeUnit[1] || null,
        startTime: time.length > 1 ? time[0] : null,
        endTime: time.length > 1 ? time[1] : null,
        status: Number(this.activeName),
        limit: this.limit,
        page: this.page
      }
      this.loading = true
      console.log(params, this.pageElement)
      const element = this.pageElement['pigInformationAuth']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element && element.uri,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            const { total, rows } = res.data
            this.total = total
            this.list = rows || []
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        }
      })
    },
    tabhandleClick() {
      // this.total = 0
      // this.list = []
      this.page = 1
      this.loading = true
      this.init()
    },
    getinit() {
      console.log('getInitgetInit')
      this.page = 1
      this.init()
    },
    handleSizeChange() {

    },
    handleCurrentChange(current) {
      this.page = current
      this.init()
    }

  }
}
</script>
<style lang="scss">
.comforCont {
  height: 100%;
  display: flex;
  flex-direction: column;
  .nav-form .top-tab-container {
    .topBtn[type='button'] {
      padding: 8px 5px;
      font-size: 12px;
      color: #1FBFFF;
      @include font_color('comforCont_topBtnFont');
      background: transparent;
      border: 1px solid;
      @include border_color('comforCont_topBtn');
      margin-right: 10px;
    }
    .topBtn.active[type='button'] {
      color: #1fbfff;
      @include font_color('comforCont_topBtnFont2');
      background: rgba(9, 30, 64, 0);
      border: 1px solid;
      @include border_color('comforCont_topBtnActive');
      box-shadow: inset 0 0 10px 0 #217bfc;
      @include box_shadow('comforCont_topBtnShadow');
      margin-right: 10px;
    }
  }
}
.comforContent {
  flex: 1;
  padding: 10px 20px;
  box-sizing: border-box;
  @include background("mainBackGroundColor");
  .comforTabs {
    @include border_bottom_color('mainTagBorderColor');
  }
  .flex_r {
    display: flex;
    justify-content: flex-end;
  }
}
.el-textarea__inner {
    background-color: #1A3166 !important;
    @include background("textareaInnerGroundColor");
    border: 1px solid transparent !important;
    color: rgb(173, 173, 173);
  }
</style>
