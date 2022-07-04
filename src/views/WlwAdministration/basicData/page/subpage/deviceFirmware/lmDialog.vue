<!-- 设备固件管理 批次管理弹框 -->
<template>
  <!-- 升级 dialog -->
  <div class="up-dialog">
    <el-tabs v-model="activeName" class="tabs-container" style="margin-top:0!important;" @tab-click="handleClick">
      <el-tab-pane label="设备列表" name="first">
        <div class="body">
          <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
        </div>
        <div>
          <el-scrollbar class="radio-scrollbar">
            <div class="radio">
              <el-button
                v-for="(j, k) in item"
                :key="k"
                :class="{ active: currentSort == k }"
                @click="active(j, k)"
              >
                {{ j.name }}  ({{ j.number }})</el-button>
            </div>
          </el-scrollbar>
        </div>
        <div>
          <tablePage
            ref="tablePage"
            :is-loading="isLoading"
            :columns="columns"
            :data-source="tableData"
            :options="options"
            :pagination="pagination"
            @handleSizeChange="handleSizeChange"
            @handleIndexChange="handleIndexChange"
            @selection-change="handleSelectionChange"
            @child-removeRow="childRemoveRow"
            @child-slotStatusPop="childSlotStatusPop"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="批次信息" name="second">
        <div class="tables1">
          <div class="right">
            <div class="right-top">
              <div class="top1 bkg">
                <div>批次ID</div>
                <div>任务类型</div>
                <div>状态</div>
                <div>设备范围</div>
                <div>定时升级时间</div>
              </div>
              <div class="top2">
                <div>{{ rowData.id || '---' }}</div>
                <div>{{ batchType[rowData.batchType] || '---' }}</div>
                <div>{{ status[rowData.status] || '---' }}</div>
                <div class="device-range" :style="{paddingTop: rowData.deviceIds ? (rowData.deviceIds.split(',').length > 1 ?'24px' : '0') : '0'}">{{ rowData.deviceIds || '---' }}</div>
                <div>{{ rowData.upgradeTime || '---' }}</div>
              </div>
              <div class="top3 bkg">
                <div>固件版本</div>
                <div>升级策略</div>
                <div>设备类型</div>
                <div>升级区域</div>
                <div>失败重试时间间隔</div>
              </div>
              <div class="top4">
                <div>{{ rowData.firmwareVersion || '---' }}</div>
                <div>{{ strategy[rowData.strategy] || '---' }}</div>
                <div>{{ rowData.equipTypeName || '---' }}</div>
                <!-- 只有区域升级时 才有升级区域 -->
                <div>{{ rowData.scope === 'AREA' ? `${rowData.regionName} / ${rowData.areaName} / ${rowData.fieldName}` : '---' }}</div>
                <div>{{ repeatType[rowData.repeatType] || '---' }}</div>
              </div>
              <div class="top3 bkg">
                <div>待升级版本号</div>
                <div>升级范围</div>
                <div>设备型号</div>
                <div>升级时间</div>
                <div>失败重试次数</div>
              </div>
              <div class="top4">
                <div>{{ rowData.upgradedVersions || '---' }}</div>
                <div>{{ scope[rowData.scope] || '---' }}</div>
                <div>{{ rowData.deviceVersionName || '---' }}</div>
                <div>{{ upgradeTimeType[rowData.upgradeTimeType] || '---' }}</div>
                <div>{{ rowData.repeatTime || '---' }}</div>
              </div>
            </div>
            <div class="right-top" style="flex: initial;">
              <div class="top5 bkg">
                <div>固件推送速率</div>
              </div>
              <div class="top6">
                <div>{{ rowData.numPerMin || '---' }}</div>
              </div>
              <div class="top5 bkg">
                <div>超时时间</div>
              </div>
              <div class="top6">
                <div>{{ rowData.timeOut || '---' }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import { getConfigElement } from '@/utils/overtService'
const dataInterfacePageElement = getConfigElement('my_equipment_firmware_version')
export default {
  components: {
    navForm,
    tablePage
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      batchType: {
        VERIFICATION: '验证升级',
        BATCH: '批量升级'
      },
      strategy: {
        STATIC: '静态升级',
        DYNAMIC: '动态升级'
      },
      scope: {
        ALL: '全部设备',
        AREA: '区域升级',
        DIRECT: '定向升级'
      },
      upgradeTimeType: {
        INSTANT: '立即升级',
        SCHEDULED: '定时升级'
      },
      repeatType: {
        DO_NOT_REPEAT: '不重试',
        REPEAT_INSTANT: '立即重试',
        REPEAT_AFTER_HALF_HOUR: '30分钟后重试',
        REPEAT_AFTER_ONE_HOUR: '1小时后重试',
        REPEAT_AFTER_ONE_DAY: '24小时后重试'
      },
      status: {
        WAIT: '待升级',
        UPGRADING: '升级中',
        FINISH: '已完成',
        CANCELLED: '已取消'
      },
      item: [
        { name: '全部', number: '0', type: '' },
        { name: '待升级', number: '0', type: 'WAIT' },
        { name: '正在升级', number: '0', type: 'UPGRADING' },
        { name: '升级成功', number: '0', type: 'SUCCESS' },
        { name: '升级失败', number: '0', type: 'FAIL' }
      ],
      currentSort: '',
      selection: [], // 复选框数组
      isLoading: false,
      tableData: [],
      activeName: 'first',
      navFormInfo: {
        data: {
          keyWord: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'keyWord',
                type: 'input',
                width: '400px',
                className: 'shadow',
                clearable: 'clearable',
                placeholder: '请输入设备ID'
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.getTableData()
                }
              },
              {
                innerText: '刷新',
                className: 'btn-border',
                handleClick: () => {
                  this.getTableData()
                }
              },
              {
                innerText: '批量重升级',
                className: 'btn-blue',
                authCode: 'my_equipment_firmware_version:reUpgrade',
                isDisabled: true,
                handleClick: () => {
                  this.batchUpgrade()
                }
              }
            ]
          }
        }
      },
      columns: [
        {
          longData: true,
          prop: 'unit',
          label: '单元',
          width: '220',
          render: (h, scope) => {
            const { fieldName, segmentName, unit, type, areaTxt } = scope.row
            if (type === 'PiggeryShower') { // 喷淋特殊处理
              return h('div', {
                class: 'no-warp'
              }, areaTxt || '---')
            }
            if (unit) {
              return h('div', {
                class: 'no-warp'
              }, fieldName + segmentName + unit + '单元')
            } else if (segmentName) {
              return h('div', {
                class: 'no-warp'
              }, fieldName + segmentName)
            } else if (fieldName) {
              return h('div', {
                class: 'no-warp'
              }, fieldName)
            } else {
              return h('span', '---')
            }
          }
        },
        {
          longData: true,
          width: '180',
          prop: 'deviceId',
          label: '设备ID'
        },
        {
          width: '140',
          prop: 'equiptypeName',
          label: '设备类型'
        },
        {
          longData: true,
          width: '160',
          prop: 'deviceVersionName',
          label: '设备型号'
        },
        {
          width: '100',
          prop: 'firmwareVersion',
          label: '固件版本'
        },
        {
          width: '80',
          prop: 'status',
          label: '状态',
          rule: {
            FAIL: '升级失败',
            WAIT: '待升级',
            UPGRADING: '升级中',
            SUCCESS: '升级成功'
          }
        },
        {
          width: '160',
          prop: 'updTime',
          label: '状态更新时间'
        },
        {
          width: '160',
          prop: 'statusOnLine',
          label: '是否在线',
          rule: {
            0: '离线',
            1: '在线'
          }
        },
        {
          width: '200',
          prop: 'reason',
          label: '升级失败原因'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          show: 'status',
          width: '180', // 操作按钮宽度
          group: [
            {
              name: '重升级',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:reUpgrade',
              size: 'auto',
              title: '确定重升级该设备吗？',
              click: 'remove',
              status: 'FAIL'
            },
            {
              name: '取消',
              class: 'btn-blue',
              authCode: 'my_equipment_firmware_version:cancelSingleDeviceOTA',
              size: 'auto',
              title: '确定取消升级该设备吗？',
              click: 'slotStatusPop',
              status: 'WAIT'
            }
          ]
        }
      ],
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      }
    }
  },
  watch: {
    selection: {
      handler(n) {
        if (n.length > 0) {
          this.navFormInfo.fieldList.left.btnLists[2].isDisabled = false
        } else {
          this.navFormInfo.fieldList.left.btnLists[2].isDisabled = true
        }
      },
      deep: true
    },
    'rowData': {
      handler: function(n) {
        console.log(n, 1111)
        this.currentSort = 0
        this.getTableData()
      },
      deep: true
    }
  },
  methods: {
    handleClick() {},
    // 获取列表
    getTableData() {
      console.log(this.rowData)
      const obj = {
        keyword: this.navFormInfo.data.keyWord || '',
        deviceVersionId: this.rowData.deviceVersionId || '',
        mainId: this.rowData.id || '',
        page: this.pagination.pageIndex,
        limit: this.pagination.limit,
        status: this.item[this.currentSort].type
      }
      this.isLoading = true
      this.$httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getDevicesUpgradingStatusV2 && dataInterfacePageElement.getDevicesUpgradingStatusV2.uri,
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          if (res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows || []
            this.item[0].number = res.data.hashDto.total ? res.data.hashDto.total : 0
            this.item[1].number = res.data.hashDto.waitNum ? res.data.hashDto.waitNum : 0
            this.item[2].number = res.data.hashDto.upgradingNum ? res.data.hashDto.upgradingNum : 0
            this.item[3].number = res.data.hashDto.successNum ? res.data.hashDto.successNum : 0
            this.item[4].number = res.data.hashDto.failNum ? res.data.hashDto.failNum : 0
            this.$refs['tablePage'].$children[0].clearSelection()
          }
        }
      })
    },
    // 重升级
    childRemoveRow(row, index) {
      console.log('row---', row)
      const obj = [{
        deviceId: row.deviceId,
        taskId: this.rowData.id
      }]
      this.$httpRequest({
        type: 'post',
        uri: dataInterfacePageElement.reUpgrade && dataInterfacePageElement.reUpgrade.uri,
        payload: obj,
        callback: (res) => {
          if (res.status === 200) {
            this.$message({
              message: '重升级任务下发成功',
              type: 'success'
            })
            this.getTableData()
          }
        }
      })
    },
    // 批量重升级
    batchUpgrade() {
      if (this.selection.length === 0) {
        this.$message({
          message: '请至少选择一个设备进行重升级!',
          type: 'warning'
        })
        return
      }
      const arr = this.selection.filter(item => {
        return (item.strategy === 'STATIC' && item.status === 'FAIL')
      })
      if (arr.length === 0 || arr.length < this.selection.length) {
        this.$message.warning('只能对升级策略为静态升级并且升级失败的设备进行重升级操作!')
        return false
      }
      console.log('arr---', arr)
      const params = []
      arr.forEach(item => {
        params.push({
          deviceId: item.deviceId,
          taskId: this.rowData.id
        })
      })
      this.$httpRequest({
        type: 'post',
        uri: dataInterfacePageElement.reUpgrade && dataInterfacePageElement.reUpgrade.uri,
        payload: params,
        callback: (res) => {
          if (res.status === 200) {
            this.$message({
              message: '重升级任务下发成功',
              type: 'success'
            })
            this.getTableData()
          }
        }
      })
    },
    // 取消升级
    childSlotStatusPop(row, index) {
      const obj = {
        ids: row.id
      }
      this.$httpRequest({
        type: 'put',
        uri: dataInterfacePageElement.cancelSingleDeviceOTA && dataInterfacePageElement.cancelSingleDeviceOTA.uri + `?ids=${obj.ids}`,
        payload: obj,
        callback: (res) => {
          if (res.status === 200 && res.rel) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getTableData()
            this.$emit('initRefresh') // 触发一下父组件的刷新操作
          }
        }
      })
    },
    active(item, index) {
      console.log('状态的点击事件', item, index)
      this.currentSort = index
      this.pagination.pageIndex = 1
      this.pagination.limit = 10
      const obj = {
        deviceVersionId: this.rowData.deviceVersionId || '',
        keyword: this.navFormInfo.data.keyWord,
        mainId: this.rowData.id || '',
        status: item.type,
        page: this.pagination.pageIndex,
        limit: this.pagination.limit
      }
      this.isLoading = true
      this.$httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getDevicesUpgradingStatusV2 && dataInterfacePageElement.getDevicesUpgradingStatusV2.uri,
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          if (res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows || []
          }
        }
      })
    },
    // 复选框
    handleSelectionChange(selection) {
      this.selection = selection
    },
    // 分页器
    handleIndexChange(current) {
      this.pagination.page = current
      this.getTableData()
    },
    handleSizeChange(size) {
      this.pagination.limit = size
      this.getTableData()
    }
  }
}
</script>
<style lang="scss">
  .radio-scrollbar {
    padding-left: 10px;
    padding-right: 10px;
    .el-scrollbar__view {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .option {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .layout {
        cursor: pointer;
        margin: 0 10px;
      }
      .full-screen {
        cursor: pointer;
      }
    }
  .el-scrollbar__wrap{
      overflow: auto;
  }
  }
  .radio {
  height: 40px;
  display: flex;
  justify-content: end;
  // margin-bottom: 10px;
  button[type='button'] {
    padding: 3px 7px;
    font-size: 12px;
    background: transparent;
    border: 1px solid #42548b;
    @include border_color('taskTagBorderColor');
    color: #7894e3;
    @include font_color('taskTagFontColor');
    padding: 0 5px;
    height: 24px;
  }
  button.active[type='button'] {
    color: #1fbfff!important;
    background: rgba(9, 30, 64, 0);
    // border: 1px solid #1fbfff;
    // box-shadow: inset 0 0 10px 0 #217bfc;
    // @include box_shadow('spBoxShadow1');
  }
}
.tables1{
    border: 1px solid #43619F;
    @include border_color('wlwBorderColor');
    border-left: none;
    border-bottom: none;
    display:flex;height: 400px;
    @include font_color('spFontColor2');
    .left{width:200px;display: flex;justify-content: space-around;flex-direction: column;padding-left: 20px;}
    .right{flex:1;display: flex;flex-direction: column;
        &-top{flex:1;display: flex;
        div{display: flex;flex-direction: column;justify-content: space-around;}
        .top{
            &1,&3{width:150px;border-bottom: 1px solid #43619F;
            @include border_color('wlwBorderColor');
            div{flex: 1;padding-left: 20px;}
            }
            &0,&2,&4{flex: 1;
            div{flex: 1;padding-left: 20px; border-bottom: 1px solid #43619F ;@include border_color('wlwBorderColor');}
            }
        }
        }
        &-bottom{padding-left: 20px;height: 60px;line-height: 60px;}
        .top5{
            width:320px;
            height: 80px;
            border-bottom: 1px solid #43619F;
            @include border_color('wlwBorderColor');
            div{flex: 1;padding-left: 20px;}
        }
        .top6{
           flex: 1;
           height: 80px;
            div{flex: 1;padding-left: 20px; border-bottom: 1px solid #43619F ;@include border_color('wlwBorderColor');}
            }
        }
        .bkg{
        // background-color: #092B5B;
        @include background_color('wlwBackGroundColor');
        @include font_color('wlwFontColor');
        border-left: 1px solid #43619F ;
        border-right: 1px solid #43619F ;
        @include border_color('wlwBorderColor');
        }
        .device-range{
          max-height: 64px;
          overflow-y: scroll;
          // padding-top: 10px;
        }
}
</style>
