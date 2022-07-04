<template>
  <div class="targetTree">
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="hint">
        提示：配置人员负责的区域时，只需勾选需要配置的最小粒度。例：配置负责“社旗九场”人员的告警区域时，只需勾选社
        旗九场，不需要勾选场区下面的工段和单元。
      </div>
      <div v-loading="treeLoading" class="chooseCheckBox">
        <el-tree
          ref="tree"
          :data="dataArray"
          show-checkbox
          :default-expand-all="false"
          :render-after-expand="true"
          node-key="key"
          :check-strictly="true"
          :default-expanded-keys="defaultArr"
          :default-checked-keys="defaultArr"
          :props="defaultProps"
          @check="check"
        />
      </div>
      <div class="checkbox">
        <template>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="故障报警" />
            <el-checkbox label="离线报警" />
            <el-checkbox label="参数变动" />
          </el-checkbox-group>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="width:100%;margin:0 auto;">
          <el-button class="btn-border" @click="cancelCheck">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" type="primary" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getNoticeAreaV3, noticeUserConfigSet } from '@/http/api/baseInfo/targetMaintenance.js'
export default {
  props: {
    dataArray: {
      type: Array,
      default: () => []
    },
    treeLoading: {
      type: Boolean
    },
    configuration: {
      type: Boolean
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkList: [],
      all: [],
      ifAll: false,
      isLoading: true,
      // 数据分级存储
      json: {
        region: [],
        area: [],
        field: [],
        roomType: [],
        unit: [],
        block: []
      },
      submit: {
        alarmNotice: 0,
        offlineNotice: 0,
        paramNotice: 0,
        myNoticeUserConfigs: []
      },
      setArr: [], // 可操作数组
      defaultArr: [], // 默认选中数组
      dialogFormVisible: false,
      status: 1,
      title: '报警通知区域配置',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      checkArr: []
    }
  },
  watch: {
    dialogFormVisible(flag) {
      if (!flag) {
        this.defaultArr = []
        this.$emit('treeDialogVisible', false)
      }
    },
    checkList(n) {
      if (n.indexOf('参数变动') !== -1) {
        this.submit.paramNotice = 1
      } else {
        this.submit.paramNotice = 0
      }
      if (n.indexOf('离线报警') !== -1) {
        this.submit.offlineNotice = 1
      } else {
        this.submit.offlineNotice = 0
      }
      if (n.indexOf('故障报警') !== -1) {
        this.submit.alarmNotice = 1
      } else {
        this.submit.alarmNotice = 0
      }
    },
    dataArray(n) {
      this.arrDispose(n)
    },
    configuration() {
      this.isLoading = true
      getNoticeAreaV3({
        id: this.id
      }).then((data) => {
        this.isLoading = false
        this.checkList = []
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([]) // CheckedArr 一个选中的数组element Ui的东西，关键是看$nextTick的用法
          this.defaultArr = data.data.areas
          // this.arr = data.data.areas
          this.ifAll = data.data.areas.indexOf('all') !== -1
          this.setArr = this.defaultArr
          if (data.data.alarmNotice === 1) {
            this.checkList.push('故障报警')
          }
          if (data.data.offlineNotice === 1) {
            this.checkList.push('离线报警')
          }
          if (data.data.paramNotice === 1) {
            this.checkList.push('参数变动')
          }
        })
      })
    }
  },
  created() {},
  methods: {
    cancelCheck() {
      this.dialogFormVisible = false
    },
    configAlarm() {
      const alarmNoticeList = this.dataArray[0].children
      const userId = this.id
      const appCode = 'unit-evc'
      const arr = []
      let regionId = null
      let regionName = null
      let areaId = null
      let areaName = null
      let fieldId = null
      let fieldName = null
      let block = null
      let roomTypeId = null
      let roomTypeName = null
      let unitId = null
      let unit = null
      if (this.ifAll) {
        arr.push({
          regionId: 'all',
          regionName: 'all',
          areaId: null,
          areaName: null,
          fieldId: null,
          fieldName: null,
          block: null,
          roomTypeId: null,
          roomTypeName: null,
          segmentId: null,
          segmentName: null,
          unitId: null,
          unit: null,
          userId,
          appCode
        })
      } else {
        Array.isArray(alarmNoticeList) && alarmNoticeList.forEach((item) => {
          if (this.hasKey(item.key)) { // 选了大区
            regionId = item.value
            regionName = item.title
            if (item.children) { // 大区下有区域
              let selectArea = false
              // 判断area是不是全部没选中
              item.children.forEach((item) => {
                if (this.hasKey(item.key)) {
                  selectArea = true
                }
              })
              if (selectArea) { // 选了区域
                item.children.forEach((item) => {
                  if (this.hasKey(item.key)) {
                    areaId = item.value
                    areaName = item.title
                    if (item.children) { // 区域下有场区
                      let selectField = false
                      // 判断field是不是全部没选中
                      item.children.forEach((item) => {
                        if (this.hasKey(item.key)) {
                          selectField = true
                        }
                      })
                      if (selectField) { // 选了场区
                        item.children.forEach((item) => {
                          if (this.hasKey(item.key)) {
                            fieldId = item.value
                            fieldName = item.title
                            if (item.children) {
                              let selectroomType = false
                              let selectBlock = false
                              let nodeClazz = ''
                              // 判断猪舍类型是不是全部没选中
                              item.children.forEach((item) => {
                                if (this.hasKey(item.key)) {
                                  nodeClazz = item.nodeClazz
                                  if (nodeClazz === 'roomType') {
                                    selectroomType = true
                                  } else if (nodeClazz === 'block') {
                                    selectBlock = true
                                  }
                                }
                              })
                              if (nodeClazz === 'roomType') {
                                if (selectroomType) { // 选了猪舍类型
                                  item.children.forEach((item) => {
                                    if (this.hasKey(item.key)) {
                                      roomTypeId = item.value
                                      roomTypeName = item.title
                                      if (item.children) {
                                        let selectUnit = false
                                        // 判断unit是不是全部没选中
                                        item.children.forEach((item) => {
                                          if (this.hasKey(item.key)) {
                                            selectUnit = true
                                          }
                                        })
                                        if (selectUnit) { // 选了单元
                                          item.children.forEach((item) => {
                                            if (this.hasKey(item.key)) {
                                              unitId = item.value
                                              unit = item.title
                                              arr.push({
                                                userId,
                                                appCode,
                                                regionId,
                                                regionName,
                                                areaId,
                                                areaName,
                                                fieldId,
                                                fieldName,
                                                block,
                                                roomTypeId,
                                                roomTypeName,
                                                // segmentId,
                                                // segmentName,
                                                unitId,
                                                unit
                                              })
                                            }
                                          })
                                        } else { // 没选单元
                                          arr.push({
                                            userId,
                                            appCode,
                                            regionId,
                                            regionName,
                                            areaId,
                                            areaName,
                                            fieldId,
                                            fieldName,
                                            block,
                                            roomTypeId,
                                            roomTypeName
                                          })
                                        }
                                      } else { // 猪舍类型下面没有单元
                                        arr.push({
                                          userId,
                                          appCode,
                                          regionId,
                                          regionName,
                                          areaId,
                                          areaName,
                                          fieldId,
                                          fieldName,
                                          block,
                                          roomTypeId,
                                          roomTypeName
                                        })
                                      }
                                    }
                                  })
                                } else {
                                  arr.push({
                                    userId,
                                    appCode,
                                    regionId,
                                    regionName,
                                    areaId,
                                    areaName,
                                    fieldId,
                                    fieldName
                                  })
                                }
                              } else if (nodeClazz === 'block') {
                                if (selectBlock) { // 选了场区下的座
                                  item.children.forEach((item) => {
                                    if (this.hasKey(item.key)) {
                                      block = item.value
                                      if (item.children) { // 座下面有猪舍类型
                                        let block_rty = false
                                        // 判断猪舍类型是不是全部没选中
                                        item.children.forEach((item) => {
                                          if (this.hasKey(item.key)) {
                                            block_rty = true
                                          }
                                        })
                                        if (block_rty) { // 选了猪舍类型
                                          item.children.forEach((item) => {
                                            if (this.hasKey(item.key)) {
                                              roomTypeId = item.value
                                              roomTypeName = item.title
                                              if (item.children) { // 猪舍类型下面有单元
                                                let rty_unit = false
                                                // 判断猪舍类型是不是全部没选中
                                                item.children.forEach((item) => {
                                                  if (this.hasKey(item.key)) {
                                                    rty_unit = true
                                                  }
                                                })
                                                if (rty_unit) { // 选了猪舍类型下的单元
                                                  item.children.forEach((item) => {
                                                    if (this.hasKey(item.key)) {
                                                      unitId = item.value
                                                      unit = item.title
                                                      // segmentId = item.attributes.roomTypeId;
                                                      // segmentName = item.attributes.segmentName;
                                                      arr.push({
                                                        userId,
                                                        appCode,
                                                        regionId,
                                                        regionName,
                                                        areaId,
                                                        areaName,
                                                        fieldId,
                                                        fieldName,
                                                        block,
                                                        roomTypeId,
                                                        roomTypeName,
                                                        // segmentId,
                                                        // segmentName,
                                                        unitId,
                                                        unit
                                                      })
                                                    }
                                                  })
                                                } else { // 没选猪舍类型下的单元
                                                  arr.push({
                                                    userId,
                                                    appCode,
                                                    regionId,
                                                    regionName,
                                                    areaId,
                                                    areaName,
                                                    fieldId,
                                                    fieldName,
                                                    block,
                                                    roomTypeId,
                                                    roomTypeName
                                                  })
                                                }
                                              } else { // 猪舍类型下面没有单元
                                                arr.push({
                                                  userId,
                                                  appCode,
                                                  regionId,
                                                  regionName,
                                                  areaId,
                                                  areaName,
                                                  fieldId,
                                                  fieldName,
                                                  block,
                                                  roomTypeId,
                                                  roomTypeName
                                                })
                                              }
                                            }
                                          })
                                        } else { // 没选猪舍类型
                                          arr.push({
                                            userId,
                                            appCode,
                                            regionId,
                                            regionName,
                                            areaId,
                                            areaName,
                                            fieldId,
                                            fieldName,
                                            block
                                          })
                                        }
                                      } else { // 座下面没有猪舍类型
                                        arr.push({
                                          userId,
                                          appCode,
                                          regionId,
                                          regionName,
                                          areaId,
                                          areaName,
                                          fieldId,
                                          fieldName,
                                          block
                                        })
                                      }
                                    }
                                  })
                                } else { // 没选场区下的座
                                  arr.push({
                                    userId,
                                    appCode,
                                    regionId,
                                    regionName,
                                    areaId,
                                    areaName,
                                    fieldId,
                                    fieldName
                                  })
                                }
                              } else { // 没有选场区下的猪舍类型或座
                                arr.push({
                                  userId,
                                  appCode,
                                  regionId,
                                  regionName,
                                  areaId,
                                  areaName,
                                  fieldId,
                                  fieldName
                                })
                              }
                            } else { // 场区下没有子节点
                              arr.push({
                                userId,
                                appCode,
                                regionId,
                                regionName,
                                areaId,
                                areaName,
                                fieldId,
                                fieldName
                              })
                            }
                          }
                        })
                      } else { // 没选场区
                        arr.push({
                          userId,
                          appCode,
                          regionId,
                          regionName,
                          areaId,
                          areaName
                        })
                      }
                    } else { // 区域下没有场区
                      arr.push({
                        userId,
                        appCode,
                        regionId,
                        regionName,
                        areaId,
                        areaName
                      })
                    }
                  }
                })
              } else { // region下面的area全部没选中
                arr.push({
                  userId,
                  appCode,
                  regionId,
                  regionName
                })
              }
            } else { // 大区下没有区域
              arr.push({
                userId,
                appCode,
                regionId,
                regionName
              })
            }
          }
        })
      }
      this.submit.myNoticeUserConfigs = arr
    },
    hasKey(key) {
      // const { hasChoosed } = this.state;
      const hasChoosed = this.all
      let flag = false
      for (let i = 0; i < hasChoosed.length; i++) {
        if (hasChoosed[i].toString() === key.toString()) {
          flag = true
        }
      }
      return flag
    },
    // 取消勾选事件
    unChecked(arr) {
      // 获取自己点的数组
      arr.forEach(item => {
        // 取消此节点的选中
        this.$refs.tree.setChecked(item.key, false)
        if (item.children) {
        // 判断如果有子级再次执行此方法  传入参数为当前对象的children
          this.unChecked(item.children)
        }
      })
    },
    // 勾选事件
    checked(data, bool) {
      // 勾选此节点
      this.$refs.tree.setChecked(data.key, true)
      if (data.parentId && String(data.parentId) !== '-1') {
        this.checked(this.$refs.tree.getNode(data.parentId).data, true)
      }
    },
    check(data, event) {
      const bo = this.$refs.tree.getNode(data.key).checked
      // 判断当前操作为选中还是取消
      if (bo === true && String(data.parentId) !== '-1') {
        this.ifAll = false
        // data.parentId!='-1'为本项目内的数据，判断作用:确认当前为第一层级是不执行递归
        this.checked(this.$refs.tree.getNode(data.parentId).data)
      } else if (data.key === 'all') {
        this.ifAll = bo
      } else {
        if (!bo) {
          // 排除选中第一层级
          // 递归去除子选中节点
          if (data.children) {
            this.unChecked(data.children)
          }
        }
      }
    },
    arrDispose(arr) {
      // 递归当前数据
      arr.forEach((item, idx) => {
        if (item.key !== 'all') {
          this.json[item.nodeClazz].push({})
          const arr = this.json[item.nodeClazz]
          const len = arr.length - 1
          for (var name in item) {
            if (String(name) !== 'children') {
              arr[len][name] = item[name]
            // return
            } else {
              if (item[name]) {
                this.arrDispose(item[name])
              }
            }
          }
        }
      })
    },
    async determine() {
      this.all = this.$refs.tree.getCheckedKeys()
      // getCheckedNodes
      await this.configAlarm()
      this.submit.userId = this.id
      noticeUserConfigSet(this.submit).then(data => {
        if (data.status === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.$emit('change')
        }
      })
    }

  }
}
</script>
<style lang="scss">
.targetTree{
  .hint {
    width: 100%;
    height: auto;
    font-size: 12px;
    color: #cdd8f7;
    @include font_color('treeHintFontColor');
    line-height: 16px;
    margin-bottom: 10px;
  }
  .el-dialog__footer{
    padding: 10px 10px 20px 30px;
  }
  .chooseCheckBox {
    border: 1px solid #43619f;
    @include border_color('treeCheckBoxBorderColor');
    max-height: 300px;
    overflow-y: auto;
    .el-tree-node:focus > .el-tree-node__content {
      background-color: transparent;
    }
    .el-tree {
      background-color: transparent;
      color: #cdd8f7;
      @include font_color('treeChecckFontColor');
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: rgb(34, 50, 130);
      @include background_color('treeContentHoverBkColor');
    }
    .el-tree-node__content:hover {
      background-color: rgb(34, 50, 130);
      @include background_color('treeContentHoverBkColor');
    }
  }
  .chooseCheckBox::-webkit-scrollbar {
    display: none;
  }
  .checkbox{
    margin-top: 10px;
    .el-checkbox{
      color: white;
    }
  }
}
</style>
