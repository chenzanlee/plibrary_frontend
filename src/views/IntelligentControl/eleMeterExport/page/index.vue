<template>
  <div class="home">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { derive, getRegionAreaFieldRoomTypeUnitV2 } from '@/http/api/siteLog.js'

const navFormInfo = (that) => {
  return {
    navFormInfo: {
      data: {
        area: [],
        pushStatus: '',
        workSection: '',
        unit: '',
        time: []
      },
      fieldList: {
        left: {
          inpLists: [
            {
              key: 'area',
              type: 'cascader',
              className: 'shadow',
              placeholder: '大区 / 区域 / 场区 / 工段 / 单元',
              options: [],
              customLabel: 'title',
              customValue: '',
              checkStrictly: false
            },
            {
              key: 'time',
              type: 'dateTime',
              className: 'shadow',
              dateType: 'datetimerange',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间'
            }
          ],
          btnLists: [
            {
              innerText: '导出',
              className: 'btn-blue',
              authCode: 'EleMeter:getEleMeterStatusList',
              handleClick: () => {
                const obj = {
                  unitId: that.search.unitId,
                  startTime: that.search.fromTime,
                  endTime: that.search.toTime
                }
                if (that.search.regionId === '') {
                  that.$message({
                    message: '请先选择导出区域！',
                    type: 'warning'
                  })
                  return
                }
                console.log(that.navFormInfo.data.time, 'exportDate')
                if (that.navFormInfo.data.time === [] || that.navFormInfo.data.time === null || that.navFormInfo.data.time.length === 0) {
                  that.$message({
                    message: '请先选择时间段！',
                    type: 'warning'
                  })
                  return
                }
                derive('/api/unit_evc/eleMeter/export', obj)
              }
            }
          ]
        },
        right: {

        }
      }
    }
  }
}
export default {
  components: {
    navForm
    // ChartBar
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
      navFormInfo: {
        data: {
          area: [],
          time: ''
        }},
      submit: {
        areaId: '',
        fieldId: '',
        roomTypeId: '',
        unitId: '',
        deviceId: '',
        deviceVersionId: '',
        deviceVersionName: '',
        equipmentId: '',
        equiptypeId: '',
        equiptypeName: '',
        deviceName: ''
      },
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      ...navFormInfo(this),
      // 表单对应列表
      listTypeInfo: {
        typeList: [
        ]
      },
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      tableData: [],
      chartOneData: [],
      chartTwoData: [],
      chartThreeData: [],
      chartFourData: [],
      xNameList: [],
      seriesList1: [],
      seriesList2: [],
      seriesList3: [],
      seriesList4: [],
      defaultValue: [] // 默认选中
    }
  },
  watch: {
    // 赋值搜索条件
    'navFormInfo.data': {
      handler: function(n) {
        if (n.time || n.time !== null) {
          this.search.fromTime = n.time[0]
          this.search.toTime = n.time[1]
        }
        console.log(n.area, 223222333)
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
        if (n.area.length === 6) {
          this.search.block = n.area[3] || ''
          this.search.roomTypeId = n.area[4] || ''
          this.search.unitId = n.area[5] || ''
        }
        if (n.area.length !== 6) {
          this.search.roomTypeId = n.area[3] || ''
          this.search.unitId = n.area[4] || ''
        }
        if (n.area.length !== 6 && n.area[3] && n.area[3].indexOf('_') > -1) {
          this.search.roomTypeId = n.area[4] || ''
          this.search.unitId = ''
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
      let json = ''
      await getRegionAreaFieldRoomTypeUnitV2().then((data) => {
        json = data.data
      })
      this.navFormInfo.fieldList.left.inpLists[0].options = await evcJsonh2Tree(
        json
      )
    }
  }
}
</script>
<style lang="scss">
.el-cascader-node.in-active-path{
  background-color: #034c90;
}
</style>
