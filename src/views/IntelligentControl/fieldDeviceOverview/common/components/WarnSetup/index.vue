<template>
  <div class="dialog" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div v-loading="loading" class="dialog-body Highlight">
      <!-- 头部 -->
      <div class="dialog-head">
        <span>暂停报警设置</span>
        <div class="dialog-head-close" @click="close"><i class="iconfont">&#xe61a;</i></div>
      </div>

      <!-- 内容 -->
      <div class="dialog-container">
        <div class="empty-container">

          <div class="empty-container-l">
            <div class="empty-container-head">可选单元 {{ copyEmptyCircleInfo.length - selectedData.length }}</div>
            <div class="empty-container-body">
              <!-- <div  class="empty-container-input">
								<input @keyup="search" v-model="searchName" type="text" class="inputStyle" placeholder="搜索单元" />
							</div> -->
              <div class="empty-container-body-connect overfolw">
                <div class="empty-container-body-connect-l">
                  <div v-show="classifyList.length == 0" class="empty-container-body-tit">暂无信息</div>
                  <div
                    v-for="(i, index) in classifyList"
                    :key="index"
                    class="empty-container-body-connect-l-col"
                    :class="unitStatus == i ? 'empty-container-body-connect-l-col2' : ''"
                    @click="selectType(i)"
                  >{{ i }}</div>

                </div>
                <div class="empty-container-body-connect-r">
                  <div v-show="toBeElectedData.length == 0" class="empty-container-body-tit">暂无信息</div>
                  <div v-show="toBeElectedData.length > 0"><button class="btn-blue buttons2" @click="selectUnit('allAdd', '')">全选</button></div>
                  <div v-show="toBeElectedData.length > 0" class="empty-container-body-connect-r-main">
                    <div
                      v-for="(i, index) in toBeElectedData"
                      :key="index"
                      class="empty-container-body-block"
                      @click="selectUnit('add', i)"
                    >{{ i.roomTypeName }}{{ i.unit }}</div>
                    <!-- @click="selectUnit('add', i)" -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-container-r">
            <div class="empty-container-head">已选择单元 {{ selectedData.length }}</div>
            <div class="empty-container-body empty-container-bodyR overfolw">
              <div v-show="selectedData.length == 0" class="empty-container-body-tit">暂无信息</div>
              <div v-show="selectedData.length > 0"><button class="btn-blue buttons2" @click="selectUnit('allDelete', '')">全选</button></div>
              <div v-show="selectedData.length > 0" class="empty-container-body-row">
                <div
                  v-for="(i, index) in selectedData"
                  :key="index"
                  class="empty-container-body-block"
                  @click="selectUnit('delect', i)"
                >{{ i.roomTypeName }}{{ i.unit }}</div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- 底部 -->
      <div class="dialog-foot">
        <button class="btn-border buttons2" @click="close">取消</button>
        <button class="btn-blue buttons2" @click="dialogDtatusForm = true">保存</button>
      </div>

    </div>
    <div class="dialog-close" @click="close" />
    <div class="dialog dialog-form" :class="dialogDtatusForm ? 'dialog-block' : 'dialog-hidden'">
      <div class="dialog-body Highlight dialog-body-form">
        <div class="dialog-head">
          <span>设置暂停时间及原因:</span>
          <div class="dialog-head-close" @click="closeForm"><i class="iconfont">&#xe61a;</i></div>
        </div>
        <div class="dialog-container nav-form">
          <el-select
            v-model="pauseTime"
            placeholder="请选择"
            style="width:100%;margin-bottom:20px;"
          >
            <el-option
              v-for="item in pauseTimeInfo"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="textarea" class="" type="textarea" placeholder="请输入告警暂停原因" />
        </div>
        <div class="dialog-foot">
          <button class="btn-border buttons2" @click="closeForm">取消</button>
          <button class="btn-blue buttons2" @click="submit">保存</button>
        </div>
      </div>
      <div class="dialog-close form" @click="closeForm" />
    </div>
  </div>
</template>
<script>
import {
  // obtainEmptyCircleInfo,
  // submitEmptyCircleInfo
  submitAddByField
} from '@/http/api/baseInfo/basicsInformation.js'
import { getDevicesByField } from '@/http/api/fieldDeviceOverview'
export default {
  name: '',
  components: {},
  data() {
    return {
      // 弹框动画
      dialogDtatus: true,
      dialogDtatusForm: false,
      loading: false,
      pauseTime: 15,
      pauseTimeInfo: [
        { value: 15, title: '15分钟' },
        { value: 30, title: '30分钟' },
        { value: 45, title: '45分钟' },
        { value: 60, title: '60分钟' }
      ],
      textarea: '',
      upDate: true,
      // 选中单元状态
      unitStatus: 1,

      // 空圈可选单元 - 总信息
      emptyCircleInfo: [],
      copyEmptyCircleInfo: [],
      // 分类后的空圈信息
      classifyEmptyInfo: [],
      classifyList: [],
      // 未选单元信息
      toBeElectedData: [],
      // 已选单元信息
      selectedData: [],
      //
      allDelectData: [],
      addList: [],
      removeList: [],

      searchName: '',
      searchTimeOut: null
    }
  },
  created() {
  },
  mounted() {
    if (this.upDate) {
      this.upDate = !this.upDate
      this.init()
    }
    console.log('获取的暂停报警设置的数据', this.data)
  },
  methods: {
    init() {
      if (this.data.rows && this.data.rows.length === 3) {
        this.getEmptyCircleInfo()
      } else { this.$message.error('获取场区失败，请重新选择场区') }
    },
    //
    search() {
      clearTimeout(this.searchTimeOut)
      this.searchTimeOut = setTimeout(() => {
        this.toBeElectedData = []
        console.log(11, this.searchName)
        if (this.searchName) {
          for (const i of this.copyEmptyCircleInfo) {
            if (i.statusWarning === 1) {
              const num = i.roomTypeName + i.unit
              if (num.indexOf(this.searchName) >= 0) {
                this.toBeElectedData.push(i)
              }
            }
          }
        } else {
          this.selectType(this.unitStatus)
        }
      }, 300)
    },
    selectUnit(type, j) {
      if (type === 'add') {
        for (const i of this.copyEmptyCircleInfo) {
          if (j.roomTypeName === i.roomTypeName && j.unit === i.unit) {
            i.statusWarning = 0
          }
        }
      } else if (type === 'delect') {
        for (const i of this.copyEmptyCircleInfo) {
          if (j.roomTypeName === i.roomTypeName && j.unit === i.unit) {
            i.statusWarning = 1
          }
        }
      } else if (type === 'allAdd') {
        for (const i of this.copyEmptyCircleInfo) {
          for (const j of this.toBeElectedData) {
            if (j.roomTypeName === i.roomTypeName && j.unit === i.unit) {
              i.statusWarning = 0
            }
          }
        }
      } else if (type === 'allDelete') {
        for (const i of this.copyEmptyCircleInfo) {
          for (const j of this.selectedData) {
            if (j.roomTypeName === i.roomTypeName && j.unit === i.unit) {
              i.statusWarning = 1
            }
          }
        }
      }
      this.handleEmptyCircleInfo()
    },
    selectType(name) {
      this.unitStatus = name
      this.toBeElectedData = []
      for (const i of this.classifyEmptyInfo) {
        if (name === i.name) {
          this.toBeElectedData = JSON.parse(JSON.stringify(i.info))
        }
      }
    },
    // 处理单元信息
    handleEmptyCircleInfo() {
      const type = []
      const data = []
      this.selectedData = []
      if (this.copyEmptyCircleInfo) {
        for (const i of this.copyEmptyCircleInfo) {
          if (i.statusWarning === 1) {
            const json = { name: '', info: [] }
            if (type.length === 0) {
              json.name = i.roomTypeName
              json.info.push(i)
              type.push(i.roomTypeName)
              data.push(json)
            } else {
              const num = type.indexOf(i.roomTypeName)
              if (num < 0) {
                json.name = i.roomTypeName
                json.info.push(i)
                type.push(i.roomTypeName)
                data.push(json)
              } else {
                data[num].info.push(i)
              }
            }
          } else {
            const types = []
            types.indexOf(i.roomTypeName + i.unit) < 0 ? this.selectedData.push(i) : ''
          }
        }
        this.classifyEmptyInfo = data
        this.selectType(this.unitStatus)
      }
    },
    // 获取可选单元
    async getEmptyCircleInfo() {
      this.loading = true
      // const data = {
      //   regionId: this.data.rows[0],
      //   areaId: this.data.rows[1],
      //   fieldId: this.data.rows[2]
      // }
      await getDevicesByField({ fieldId: this.data.rows[2] }).then((res) => {
        this.loading = false
        // if (res && res.status === 200 && res.rel) {
        // this.emptyCircleInfo = res.data.deviceList
        console.log('获取的data的信息', res.data)
        this.classifyList = []
        // for (const i of this.emptyCircleInfo) {
        //   console.log('遍历的索引', i)
        //   i.statusWarning === 0 ? this.allDelectData.push(i) : ''
        //   if (this.classifyList.length === 0) {
        //     this.classifyList.push(i.roomTypeName)
        //   } else {
        //     this.classifyList.indexOf(i.roomTypeName) < 0 ? this.classifyList.push(i.roomTypeName) : ''
        //   }
        // }
        res.data.deviceList.forEach((i, index) => {
          console.log('遍历的索引', i.statusWarning)
          // i.statusWarning === 0 ? this.allDelectData.push(i) : ''
          // !i.statusWarning ? this.emptyCircleInfo.splice(index, 1) : ''
          // i.statusWarning === 0 ? this.emptyCircleInfo.splice(index, 1) : ''
          //  let { regionId, regionName, areaId, areaName, fieldId, fieldName, segmentId, segmentName, roomTypeId, roomTypeName, unit: unitName, unitId } = item;
          i.statusWarning !== 0 ? this.emptyCircleInfo.push(i) : ''
          if (this.classifyList.length === 0) {
            this.classifyList.push(i.roomTypeName)
          } else {
            this.classifyList.indexOf(i.roomTypeName) < 0 ? this.classifyList.push(i.roomTypeName) : ''
          }
        })
        this.copyEmptyCircleInfo = JSON.parse(JSON.stringify(this.emptyCircleInfo))
        this.handleEmptyCircleInfo()
        this.selectType(res.data.deviceList[0].roomTypeName)
        console.log('获取的selectedData', this.selectedData)
        this.selectedData = []
        // } else { this.$message.error(res.message) }
      }).catch(() => {
        this.loading = false
      })
    },
    async setEmptyCircle(add, remove) {
      // const data = {
      //   addedEmptyStyUnits: add,
      //   removedEmptyStyUnits: remove
      // }
      const warnSetupData = []
      add.map(item => {
        const { regionId, regionName, areaId, areaName, fieldId, fieldName, segmentId, segmentName, roomTypeId, roomTypeName, unit: unitName, unitId } = item
        warnSetupData.push({
          regionId,
          regionName,
          areaId,
          areaName,
          fieldId,
          fieldName,
          roomTypeId,
          roomTypeName,
          segmentId,
          segmentName,
          unitName,
          unitId,
          suspendMinutes: this.pauseTime,
          reason: this.textarea
        })
      })
      console.log('提交的数据', warnSetupData)
      if (this.textarea === '') {
        this.$message.error('请输入告警暂停原因')
      } else {
        await submitAddByField(warnSetupData).then((res) => {
          if (res && res.status === 200) {
            this.$message.success('保存成功')
            this.close()
            this.data.handleOk()
          } else { this.$message.error(res.message) }
        })
      }
    },
    // 提交
    submit() {
      const arr = []
      const add = []
      const remove = []
      for (const i of this.allDelectData) {
        for (const j of this.selectedData) {
          if (i.roomTypeName === j.roomTypeName && i.unit === j.unit) {
            const name = i.roomTypeName + i.unit
            arr.push(name)
          }
        }
      }

      for (const i of this.allDelectData) {
        const name = i.roomTypeName + i.unit
        if (arr.indexOf(name) === -1) {
          i.unitName = i.unit
          remove.push(i)
        }
      }

      for (const i of this.selectedData) {
        const name = i.roomTypeName + i.unit
        if (arr.indexOf(name) === -1) {
          i.unitName = i.unit
          add.push(i)
        }
      }
      this.setEmptyCircle(add, remove)
    },
    // 关闭
    close() {
      this.dialogDtatus = false
      setTimeout(() => { this._close() }, 300)
    },
    closeForm() {
      this.dialogDtatusForm = false
      // setTimeout(() => { this._close() }, 300)
    }
  }
}
</script>

<style lang="scss">
.dialog-form .nav-form .el-textarea__inner{
  height: 100px;
}

</style>
<style lang="scss" scoped>
.dialog-body-form{
 .dialog-container{
   width: 0;
 }
}
.dialog-container::-webkit-scrollbar{
    display: none;
}
.dialog-hidden{
  display: none;
}
.dialog-block{
  display: block;
}
.dialog-form{
  position: absolute;
  top: 50%;
}
.dialog-container{
  min-width: 400px;
  width: 80vw;
  max-height: 70vh;
  overflow-x: auto;
	margin: 30px;
	padding-bottom: 5px;
}

.empty-container{
	display: flex;
	&-l{
		flex: 1;
		margin-right: 20px;
	}
	&-r{
		flex: 1;

	}
	&-head{
		height: 20px;
		line-height: 20px;
	}
	&-input{
		padding: 15px;
		// border-bottom: 1px solid #43619F;
    border-bottom: 1px solid;
    @include border_color('viewBorderColor4');
		input{
			width: 100%;
			height: 34px;
		}
	}
	&-body{
		margin-top: 10px;
		height: calc(100% - 30px);
		// border: 1px solid #43619F;
    border: 1px solid;
    @include border_color('viewBorderColor4');
		border-radius: 4px;
		&-connect{
			display: flex;
      max-height: 70vh;
      overflow-x: hidden;
			&-l{
				width: 100px;
				min-height: 250px;
        // background: #1C2C66;
        @include background('emptyBackGround');
				border-radius: 0 0 0 4px;

				&-col{
					height: 44px;
					line-height: 44px;
					padding: 0 10px;
					cursor: pointer;
					font-size: 14px;
					border-left: 4px solid rgba(0,0,0,0);
          transition: all .3s;
          border-bottom: 1px solid;
          @include border_color('viewBorderColor5');
				}
				&-col2, &-col:hover{
          // background: #001D45;
          @include background('emptyBackGround1');
					border-left: 4px solid #367CDE;
          transition: all .3s;
          color: #FFFFFF;
				}
			}
			&-r{
				flex: 1;
				padding: 15px;
				&-main{
					display: flex;
					flex-wrap: wrap;
          padding-bottom: 15px;
				}

			}
		}

		&-row{
			display: flex;
			flex-wrap: wrap;
		}
		&-block{
			width: 100px;
			font-size: 14px;
			margin: 15px 15px 0 0;
			text-align: center;
      // background: #152665;
      @include background('emptyBackGround2');
      border: 1px solid #dedede;
			height: 34px;
			line-height: 34px;
			border-radius: 4px;
			cursor: pointer;
			transition: all .3s;
		}
		&-block:hover{
      // background: #10AEFF;
      @include background('emptyBackGround1');
      color: #FFFFFF;
			transition: all .3s;
		}
		&-tit{
			text-align: center;
			margin-top: 20px;
		}
	}
	&-bodyR{
    padding: 15px;
    max-height: 70vh;
    overflow-x: hidden;
	}
}

.buttons2{
	padding: 5px 15px;
  margin-left: 10px;
}

</style>
