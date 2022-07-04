<template>
  <div>
    <div class="multiUnit-row default">
      <div class="multiUnit-head">多单元参数设置</div>
      <div class="multiUnit-padding multiUnit-select">
        <el-select
          v-model="factoryValue"
          disabled
          placeholder="请选择"
          class="multiUnit-select-r put-disabled"
        >
          <el-option
            v-for="item in factoryInfo"
            :key="item.value"
            class="put-disabled"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="unitValue"
          placeholder="请选择"
          class="multiUnit-select-r"
          @change="Fselect(unitValue)"
        >
          <el-option
            v-for="item in unitInfo"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-radio v-model="radio" label="1">华诚/自研控制器V2</el-radio>
      </div>
      <div class="multiUnit-padding multiUnit-Fchecked">
        <el-checkbox
          v-model="FcheckedStatus"
          @change="FcheckBox(FcheckedStatus)"
        >全选</el-checkbox>
        <div class="multiUnit-Fchecked-col">
          <div
            v-for="(i, index) of devicesFieldList"
            :key="index"
            class="multiUnit-Fchecked-block"
            :class="i.statusOnline === 1 ? '' : 'multiUnit-Fchecked-dis-block'"
          >
            <div
              :class="i.selectS === 1 ? 'multiUnit-Fchecked-block2' : ''"
              @click="pointIt(i, '')"
            >
              {{ i.roomTypeName }}{{ i.unit }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="multiUnitFst-foot">
      <span>点击下一步进入“参数设置”页面</span>
      <button
        class="buttons btn-blue multiUnitFst-foot-btn"
        :class="selectunitList.length > 0 ? '' : ''"
        @click="goBack"
      >
        返回
      </button>
      <button
        v-show="selectunitList.length > 0"
        class="buttons btn-blue"
        :class="selectunitList.length > 0 ? '' : ''"
        @click="goTo"
      >
        下一步
      </button>
      <button v-show="selectunitList.length === 0" class="buttons btn-blue-disabled">
        下一步
      </button>
    </div>
  </div>
</template>
<script>
import { getDevicesForField } from '@/http/api/baseInfo/basicsInformation.js'

export default {
  name: 'MultiUnit',
  inject: ['overviewDetail'],
  data() {
    return {
      //
      types: 'first',
      // first
      factoryInfo: [],
      factoryValue: '',
      unitInfo: [],
      unitValue: '',
      radio: '1',
      devicesFieldDate: [],
      devicesFieldList: [],
      FcheckedStatus: false,
      selectunitList: [],
      // second
      refreshValue: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log('加载的内容', this.overviewDetail)
      this.factoryValue = `${this.overviewDetail.selectedLabel[0]}/${this.overviewDetail.selectedLabel[1]}/${this.overviewDetail.selectedLabel[2]}`
      this.devicesForField()
      this.selectunitList = []
      this.types = 'first'
    },

    pointIt(i, type) {
      if (type === 'all') {
        for (const j of this.devicesFieldList) {
          if (j.statusOnline === 1) {
            i ? (j.selectS = 1) : (j.selectS = 0)
          }
        }
      } else {
        if (i.statusOnline === 1) {
          const n = []
          i.selectS = i.selectS === 0 ? 1 : 0
          for (const j of this.devicesFieldList) {
            j.statusOnline === 1 ? n.push(j.selectS) : ''
          }
          console.log(n)
          n.indexOf(0) < 0 ? (this.FcheckedStatus = true) : ''
          n.indexOf(0) >= 0 ? (this.FcheckedStatus = false) : ''
        }
      }

      if (type === 'all' || i.statusOnline === 1) {
        this.selectunitList = []
        for (const i of this.devicesFieldList) {
          i.statusOnline === 1 && i.selectS === 1
            ? this.selectunitList.push(i)
            : ''
        }
      }
    },
    FcheckBox(val) {
      this.pointIt(val, 'all')
    },
    Fselect(val) {
      console.log(val)
      this.FcheckedStatus = false
      this.FcheckBox(false)
      if (val && this.unitInfo) {
        for (const i of this.unitInfo) {
          if (val === i.name) {
            this.devicesFieldList = i.info
          }
        }
      } else {
        this.$message.error('获取信息失败，请重新加载')
      }
      console.log(this.devicesFieldList)
    },
    goTo() {
      if (this.selectunitList) {
        const name = []
        const id = []
        let deviceVersionId = ''
        for (const i of this.selectunitList) {
          name.push(i.roomTypeName + i.unit)
          id.push(i.deviceName)
          if (!deviceVersionId) {
            deviceVersionId = i.deviceVersionId
          }
        }
        const json = {
          name: name,
          deviceNames: id,
          data: this.selectunitList,
          deviceVersionId: deviceVersionId
        }
        console.log(json)
        this.$store.dispatch('IntelligentControl/setMultiUnit', {
          deviceNames: json.deviceNames,
          unitNames: json.name,
          fieldId: this.overviewDetail.selectedOption[2],
          fieldName: this.overviewDetail.selectedLabel[2],
          deviceVersionId: json.deviceVersionId
        })
        console.log('获取的详情内容', this.overviewDetail)
        this.overviewDetail.progress = 'multiUnitSetting'
      } else {
        this.$message.error('选中失效，请重新选择')
      }
    },
    // 返回
    goBack() {
      this.overviewDetail.progress = 'parameterSetting'
    },
    // 处理单元信息
    handleEmptyCircleInfo() {
      const type = []
      const data = []
      this.unitInfo = []
      this.unitValue = '' // data[0].name;
      if (this.devicesFieldDate) {
        const copyDevices = JSON.parse(JSON.stringify(this.devicesFieldDate))
        for (const i of copyDevices) {
          if (!i.roomTypeName) {
            continue
          }
          if (!this.unitValue && i.roomTypeName) {
            this.unitValue = i.roomTypeName
          }
          if (i.statusOnline === 1 && !i.selectS) {
            i.selectS = 0
          }
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
        }
      }

      this.unitInfo = data

      this.Fselect(data[0].name)
    },
    async devicesForField() {
      await getDevicesForField({
        fieldId: this.overviewDetail.selectedOption[2]
      }).then((res) => {
        console.log('单元信息', res)
        if (res && res.status === 200 && res.rel) {
          this.devicesFieldDate = res.data
          this.handleEmptyCircleInfo()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // second
    changeRefres(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss">
.multiUnit-row {
  .el-input.is-disabled .el-input__inner:hover {
    background-color: #1d2c4c;
    border: 1px solid #1d2c4c;
    color: #adadad;
    cursor: no-drop;
  }
}
.multiUnit-row {
  background: rgba(39, 55, 111, 0.6);
  border-radius: 4px;
  color: #cdd8f7;
  font-family: SourceHanSansCN-Medium;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.multiUnit-head {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background: #034c90;
  border-radius: 4px 4px 0 0;
  padding-left: 19px;
}
.multiUnit-padding {
  padding: 20px 0 0 20px;
}
.multiUnit-select {
  .multiUnit-select-r {
    margin-right: 10px;
    .el- input__inner {
      box-shadow: inset 0 0 6px 0 #217bfc;
      // border: 1px solid #217BFC;
    }
    .el-input__inner:focus {
      border: 1px solid #217bfc;
    }
  }
  .is-disabled .el-input__inner {
    box-shadow: none;
    background-color: #1d2c4c;
    border: 1px solid #1d2c4c;
    color: #adadad;
    cursor: no-drop;
  }
  .is-disabled:hover {
    border: none;
  }
}
.multiUnit-Fchecked {
  .el-checkbox {
    color: #cdd8f7;
  }
  &-col {
    display: flex;
    flex-wrap: wrap;
  }
  &-block {
    width: 100px;
    font-size: 14px;
    margin: 15px 15px 0 0;
    text-align: center;
    background: #122053;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }
  &-block2 {
    background: #10aeff;
    transition: all 0.3s;
    border-radius: 4px;
  }
  &-dis-block,
  &-dis-block:hover {
    background: #283667;
    cursor: no-drop;
  }
}
.multiUnitFst-foot {
  margin: 20px 0;
  color: #cdd8f7;
  text-align: right;
  span {
    margin-right: 20px;
  }
  &-btn{
    margin-right: 20px;
  }
}

/***************second******************************************* */

.multiUnitSec {
  color: #cdd8f7;
  padding: 0 0 20px 0;
  &-head {
    text-align: right;
    margin-bottom: 20px;
    &-l {
      float: left;
      height: 39px;
      line-height: 39px;
      span {
        margin-right: 10px;
      }
    }
    &-btn {
      margin-left: 10px;
    }
  }

  &-row {
    background: rgba(39, 55, 111, 0.6);
    border-radius: 4px;
  }
}
</style>
