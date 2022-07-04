<template>
  <div class="onLine-back environment">
    <!-- <div class="formPosition"> -->
    <searchForm
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    />
    <!-- </div> -->
    <environment :mess="mess" :json="json" :reload="reload" />
  </div>
</template>
<script>
import environment from '../../components/environment/environment'
import searchForm from '@/components/commonComponent/navForm'
import { evcJsonh2Tree } from '@/components/tree/evcJsonh2Tree'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    environment,
    searchForm
  },
  data() {
    return {
      total: [],
      online: [],
      json: {
        unitId0: '',
        unitId1: '',
        unitId2: '',
        unitId3: '',
        unitId4: '',
        startTime: '',
        endTime: '',
        lineType: 'DAY_LINE'
      },
      reload: true,
      defaultTime: [], // 默认时间
      // 搜索参数列表
      search: {
        regionId: '',
        areaId: '',
        brand: ''
      },
      brandData: [10, 10], // 在线离线数对比
      list: [],
      mess: [],
      labelWidth: '50px',
      navFormInfo: {
        labelWidth: '50px',
        data: {
          cascader5: '', // 大区区域场区
          cascader1: '',
          cascader2: '',
          cascader3: '',
          cascader4: '',
          time: '', // 设备型号
          radio: '实时'
        },
        fieldList: {
          right: {
            inpLists: [
              {
                key: 'cascader1',
                type: 'cascader',
                customLabel: 'title',
                customValue: '',
                label: '单元1',
                width: '310px',
                className: 'shadow',
                placeholder: '请选择单元',
                clearable: true,
                options: [],
                handleChange: (e) => {
                }
              },
              {
                key: 'cascader2',
                type: 'cascader',
                width: '310px',
                label: '单元2',
                customLabel: 'title',
                customValue: '',
                className: 'shadow',
                clearable: true,
                placeholder: '请选择单元',
                options: [],
                handleChange: (e) => {
                  console.log(e)
                }
              },
              {
                key: 'cascader3',
                type: 'cascader',
                label: '单元3',
                width: '310px',
                customLabel: 'title',
                customValue: '',
                clearable: true,
                className: 'shadow',
                placeholder: '请选择单元',
                options: [],
                handleChange: (e) => {
                  console.log(e)
                }
              },
              {
                key: 'cascader4',
                type: 'cascader',
                label: '单元4',
                width: '310px',
                customLabel: 'title',
                customValue: '',
                clearable: true,
                className: 'shadow',
                placeholder: '请选择单元',
                options: [],
                handleChange: (e) => {
                  console.log(e)
                }
              },
              {
                key: 'time',
                // label: '时间',
                // width: '500px',
                type: 'date',
                className: 'shadow',
                dateType: 'daterange',
                clearable: false,
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间'
              }
            ],
            btnLists: [
              {
                label: '操作',
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  if (!this.json.unitId0 && !this.json.unitId1 && !this.json.unitId2 && !this.json.unitId3 && !this.json.unitId4) {
                    return this.$message.error('请至少选择一个单元')
                  }
                  this.reload = !this.reload
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.json.startTime = this.$moment().subtract(2, 'months').format('YYYY-MM-DD')
                  this.json.endTime = this.$moment().format('YYYY-MM-DD')
                  this.defaultTime = [this.json.startTime, this.json.endTime]
                  this.navFormInfo.data.time = [this.json.startTime, this.json.endTime]
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
    'navFormInfo.data.cascader1': {
      handler: function(n) {
        this.json.unitId0 = n[n.length - 1] || ''
      },
      deep: true
    },
    'navFormInfo.data.cascader2': {
      handler: function(n) {
        this.json.unitId1 = n[n.length - 1] || ''
      },
      deep: true
    },
    'navFormInfo.data.cascader3': {
      handler: function(n) {
        this.json.unitId2 = n[n.length - 1] || ''
      },
      deep: true
    },
    'navFormInfo.data.cascader4': {
      handler: function(n) {
        this.json.unitId3 = n[n.length - 1] || ''
      },
      deep: true
    },
    'navFormInfo.data.cascader5': {
      handler: function(n) {
        this.json.unitId4 = n[n.length - 1] || ''
      },
      deep: true
    },
    'navFormInfo.data.time': {
      handler: function(n) {
        if (n === null) {
          this.json.startTime = this.defaultTime[0] + ' 00:00:00'
          this.json.endTime = this.defaultTime[1] + ' 00:00:00'
          return
        }
        this.json.startTime = n[0] + ' 00:00:00' || ''
        this.json.endTime = n[1] + ' 00:00:00' || ''
      },
      deep: true
    }
  },
  mounted() {},
  created() {
    const pageElement = getConfigElement('unit-evcDataInterface')
    this.$httpRequest({
      type: 'GET',
      payload: { isBuilding: false },
      uri: pageElement && pageElement.getRegionAreaFieldRoomTypeUnitV2 && pageElement.getRegionAreaFieldRoomTypeUnitV2.uri,
      callback: data => {
        if (data.data) {
          const arr = evcJsonh2Tree(
            data.data
          )
          for (var i = 0; i < 5; i++) {
            this.navFormInfo.fieldList.right.inpLists[i].options = arr
          }
          this.json.startTime = this.$moment().subtract(2, 'months').format('YYYY-MM-DD')
          this.json.endTime = this.$moment().format('YYYY-MM-DD')
          this.defaultTime = [this.json.startTime, this.json.endTime]
          this.navFormInfo.data.time = [this.json.startTime, this.json.endTime]
        }
      }
    })
  },
  methods: {
    returnZero(data) {
      if (data === null) {
        return 0
      } else {
        return data
      }
    }
  }
}
</script>
<style lang="scss">
.environment{
  .el-cascader{
    width: 256px!important;

  }
}
.gutter {
  display: none !important;
}
.el-cascader-node.is-selectable.in-active-path {
  color: #fff !important;
}

</style>
<style lang="css" scoped>
.formPosition {
  width: 100%;
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
}
</style>
