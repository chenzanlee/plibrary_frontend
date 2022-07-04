<template>
  <div class="dialog" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div class="dialog-body Highlight">
      <!-- 头部 -->
      <div class="dialog-head">
        <span>空圈设置</span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-container-r">
            <div class="empty-container-head">空圈单元 {{ selectedData.length }}</div>
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
        <button class="btn-blue buttons2" @click="submit">保存</button>
      </div>

    </div>
    <div class="dialog-close" @click="close" />

  </div>
</template>
<script>
import {
  obtainEmptyCircleInfo,
  submitEmptyCircleInfo
} from '@/http/api/baseInfo/basicsInformation.js'

export default {
  name: '',
  components: {},
  data() {
    return {
      // 弹框动画
      dialogDtatus: true,
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
            if (i.isEmptyUnit === 0) {
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
            i.isEmptyUnit = 1
          }
        }
      } else if (type === 'delect') {
        for (const i of this.copyEmptyCircleInfo) {
          if (j.roomTypeName === i.roomTypeName && j.unit === i.unit) {
            i.isEmptyUnit = 0
          }
        }
      } else if (type === 'allAdd') {
        for (const i of this.copyEmptyCircleInfo) {
          for (const j of this.toBeElectedData) {
            if (j.roomTypeName === i.roomTypeName && j.unit === i.unit) {
              i.isEmptyUnit = 1
            }
          }
        }
      } else if (type === 'allDelete') {
        for (const i of this.copyEmptyCircleInfo) {
          for (const j of this.selectedData) {
            if (j.roomTypeName === i.roomTypeName && j.unit === i.unit) {
              i.isEmptyUnit = 0
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
          if (i.isEmptyUnit === 0) {
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
      const data = {
        regionId: this.data.rows[0],
        areaId: this.data.rows[1],
        fieldId: this.data.rows[2]
      }
      await obtainEmptyCircleInfo(data).then((res) => {
        if (res && res.status === 200 && res.rel) {
          this.emptyCircleInfo = res.data
          this.copyEmptyCircleInfo = JSON.parse(JSON.stringify(res.data))

          this.classifyList = []
          for (const i of this.emptyCircleInfo) {
            i.isEmptyUnit === 1 ? this.allDelectData.push(i) : ''
            if (this.classifyList.length === 0) {
              this.classifyList.push(i.roomTypeName)
            } else {
              this.classifyList.indexOf(i.roomTypeName) < 0 ? this.classifyList.push(i.roomTypeName) : ''
            }
          }

          this.handleEmptyCircleInfo()
          this.selectType(res.data[0].roomTypeName)
        } else { this.$message.error(res.message) }
      })
    },
    async setEmptyCircle(add, remove) {
      const data = {
        addedEmptyStyUnits: add,
        removedEmptyStyUnits: remove
      }
      await submitEmptyCircleInfo(data).then((res) => {
        if (res && res.status === 200) {
          this.$message.success('保存成功')
          this.close()
        } else { this.$message.error(res.message) }
      })
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
    }

  }
}
</script>
<style lang="scss" scoped>
.dialog-container::-webkit-scrollbar{
    display: none;
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
		border-bottom: 1px solid #43619F;
		input{
			width: 100%;
			height: 34px;
		}
	}
	&-body{
		margin-top: 10px;
		height: calc(100% - 30px);
		border: 1px solid #43619F;
		border-radius: 4px;
		&-connect{
			display: flex;
      max-height: 70vh;
      overflow-x: hidden;
			&-l{
				width: 100px;
				min-height: 250px;
				background: #1C2C66;
				border-radius: 0 0 0 4px;

				&-col{
					height: 44px;
					line-height: 44px;
					padding: 0 10px;
					cursor: pointer;
					font-size: 14px;
					border-left: 4px solid rgba(0,0,0,0);
					transition: all .3s;
				}
				&-col2, &-col:hover{
					background: #001D45;
					border-left: 4px solid #367CDE;
					transition: all .3s;
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
			background: #152665;
			height: 34px;
			line-height: 34px;
			border-radius: 4px;
			cursor: pointer;
			transition: all .3s;
		}
		&-block:hover{
			background: #10AEFF;
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
