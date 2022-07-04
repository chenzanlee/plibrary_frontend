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
        <el-radio-group v-model="deviceVersionIdFlag" @change="onDeviceTypeChange">
          <el-radio v-for="(device,i) in deviceVersionList" :key="i" :label="device.deviceVersionIdFlag">
            {{ showType(device) }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="multiUnit-padding multiUnit-Fchecked">
        <el-checkbox
          v-show="devicesFieldList.length"
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
          <span v-show="!devicesFieldList.length" style="color:#FFF;font-size:14px;">暂无数据</span>
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
  props: {
    info: {
      type: Object,
      default: function() {
        return {}
      }
    },
    unitId: String
  },
  data() {
    return {
      isNewPro: false,
      roomTypeId: '',
      deviceVersionIdFlag: '',
      types: 'first',
      selectUnitValues: [],
      // first
      factoryInfo: [],
      deviceVersionList: [],
      factoryValue: '',
      unitInfo: [],
      unitValue: '',
      deviceVersionObj: null,
      radio: '1',
      devicesFieldDate: [],
      devicesFieldList: [],
      FcheckedStatus: false,
      selectunitList: [],
      // TODO:新协议多单元
      deviceVersionId: '',
      // second
      refreshValue: false
    }
  },
  watch: {
    unitId(newValue, oldValue) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.factoryValue = `${this.overviewDetail.selectedLabel[0]}/${this.overviewDetail.selectedLabel[1]}/${this.overviewDetail.selectedLabel[2]}`
      this.unitValue = JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).overview.roomTypeName || this.overviewDetail.overview.roomTypeName
      this.deviceVersionObj = JSON.parse(sessionStorage.getItem('fieldDeviceOverviewDetail')).overview
      this.devicesForField()
      this.selectunitList = []
      this.types = 'first'
    },
    onDeviceTypeChange() {
      const ads = this.deviceVersionIdFlag.split('_')
      console.log(ads)
      this.isNewPro = ads[1] === 'true'
      // TODO:新协议多单元
      this.deviceVersionId = ads[0]
      this.filterUnitVersion()
      this.selectunitList = []
      this.FcheckedStatus = false
      for (const j of this.devicesFieldList) {
        if (j.statusOnline === 1) {
          j.selectS = 0
        }
      }
      console.log('当前选择的内容', this.selectunitList)
    },
    pointIt(i, type) {
      this.roomTypeId = i.roomTypeId
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
      this.FcheckedStatus = false
      this.selectUnitValues = []
      this.FcheckBox(false)
      if (val && this.unitInfo) {
        for (const i of this.unitInfo) {
          if (val === i.name) {
            this.selectUnitValues = i.info
            this.filterUnitVersion()
          }
        }
      } else {
        this.$message.error('获取信息失败，请重新加载')
      }
    },
    filterUnitVersion() {
      this.devicesFieldList = []
      this.selectUnitValues.forEach(item => {
        // TODO:新协议多单元
        if (this.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
          if (item.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
            this.devicesFieldList.push(item)
          }
        } else
        if (this.isNewPro && item.deviceVersionId !== '6aKGZaUNLp9poYSNu1PhnU') {
          if (this.isNewProtocal(item.firmwareVersion)) {
            this.devicesFieldList.push(item)
          }
        } else if (!this.isNewProtocal(item.firmwareVersion) && item.deviceVersionId !== '6aKGZaUNLp9poYSNu1PhnU') {
          this.devicesFieldList.push(item)
        }
      })
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
          deviceVersionId: deviceVersionId,
          deviceVersionIdFlag: this.deviceVersionIdFlag
        }
        this.$store.dispatch('IntelligentControl/setMultiUnit', {
          deviceNames: json.deviceNames,
          unitNames: json.name,
          fieldId: this.overviewDetail.selectedOption[2],
          fieldName: this.overviewDetail.selectedLabel[2],
          deviceVersionId: json.deviceVersionId,
          roomTypeId: this.roomTypeId,
          deviceVersionIdFlag: this.deviceVersionIdFlag
        })
        sessionStorage.setItem('multiUnitSetting', JSON.stringify({
          deviceNames: json.deviceNames,
          unitNames: json.name,
          fieldId: this.overviewDetail.selectedOption[2],
          fieldName: this.overviewDetail.selectedLabel[2],
          deviceVersionId: json.deviceVersionId,
          roomTypeId: this.roomTypeId,
          deviceVersionIdFlag: this.deviceVersionIdFlag
        }))
        // this.overviewDetail.progress = 'multiUnitSetting'
        // intelligentControlOverviewMultiUnitSetting
        this.$router.push({
        // name: 'intelligentControlOverview',
          name: 'intelligentControlOverviewMultiUnitSetting',
          params: {
            deviceNames: json.deviceNames,
            unitNames: json.name,
            fieldId: this.overviewDetail.selectedOption[2],
            fieldName: this.overviewDetail.selectedLabel[2],
            deviceVersionId: json.deviceVersionId,
            roomTypeId: this.roomTypeId,
            deviceVersionIdFlag: this.deviceVersionIdFlag
          }
        })
        // if (this.deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
        //   this.overviewDetail.deviceVersionId = '6aKGZaUNLp9poYSNu1PhnU'
        // }
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
      if (this.devicesFieldDate) {
        const copyDevices = JSON.parse(JSON.stringify(this.devicesFieldDate))
        for (const i of copyDevices) {
          if (!i.roomTypeName) {
            continue
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
      // console.log('获取的单元列表信息', this.unitInfo)
      this.Fselect(this.unitValue)
    },
    showType(info) {
      // console.log('需要判断的版本', info)
      const deviceVersionId = info && info.deviceVersionId
      const isNewPro = info && info.isNewPro
      if (deviceVersionId === '6aKGZaUNLp9poYSNu1PhnU') {
        return '华诚/自研控制器v3.0'
      } else
      if (deviceVersionId === '6rtsy5euo02HjIIhBEOmox') {
        if (isNewPro) {
          return '华诚/自研控制器v2.5'
        } else {
          return '华诚/自研控制器v2.0'
        }
      } else {
        return '华诚/自研控制器v1.0'
      }
    },
    async devicesForField() {
      this.deviceVersionList = []
      await getDevicesForField({
        fieldId: this.overviewDetail.overview.fieldId
      }).then((res) => {
        if (res && res.status === 200 && res.rel) {
          // console.log('获取的列表内容', res.data)
          this.devicesFieldDate = res.data
          this.deviceVersionList = this.getDeviceVersion()
          const deviceVersionId = this.deviceVersionList.find((item) => {
            // console.log('对应值', item)
            const device = this.deviceVersionObj.deviceVersionId + '_' + this.isNewProtocal(this.deviceVersionObj.firmwareVersion)
            return item.deviceVersionIdFlag === device
          })
          this.deviceVersionId = deviceVersionId.deviceVersionId
          this.deviceVersionIdFlag = deviceVersionId.deviceVersionIdFlag
          this.isNewPro = deviceVersionId.deviceVersionIdFlag.split('_')[1] === 'true'
          console.log('deviceVersionId', deviceVersionId)
          console.log('deviceVersionIdFlag', this.deviceVersionIdFlag)
          console.log('isNewPro', this.isNewPro)
          this.handleEmptyCircleInfo()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // second
    changeRefres(val) {
    },
    isNewProtocal(value) {
      const reg = /^4/
      const val = value && value.length > 1 ? value[1] : null
      if (reg.test(value) && this.valueExist(val) && parseInt(val) > 4) {
        return true
      } else {
        return false
      }
    },
    valueExist(value) {
      if (value === '' || value === undefined || value === null) {
        return false
      } else {
        return true
      }
    },
    // 获取场区下所有的设备型号
    getDeviceVersion() {
      const data = this.devicesFieldDate
      const obj = {}
      const arr = []
      data.forEach((item, index) => {
        if (item.deviceVersionId === '6rtsy5euo02HjIIhBEOmox') {
          if (!obj[item.deviceVersionId]) {
            obj[item.deviceVersionId] = item.versionName || 'versionName'
            const flag = this.isNewProtocal(item.firmwareVersion)
            arr.push({
              deviceVersionId: item.deviceVersionId,
              deviceVersionName: item.versionName,
              deviceVersionIdFlag: item.deviceVersionId + '_' + flag,
              isNewPro: flag
            })
          } else {
            const arr_exist = arr.filter((arg) => { return arg.deviceVersionId === item.deviceVersionId })
            const flag = this.isNewProtocal(item.firmwareVersion)
            if (arr_exist.filter((obj) => { return obj.isNewPro === flag }).length === 0) {
              arr.push({
                deviceVersionId: item.deviceVersionId,
                deviceVersionName: item.versionName,
                deviceVersionIdFlag: item.deviceVersionId + '_' + flag,
                isNewPro: flag
              })
            }
          }
        } else {
          if (!obj[item.deviceVersionId]) {
            obj[item.deviceVersionId] = item.versionName || 'versionName'
            arr.push({
              deviceVersionId: item.deviceVersionId,
              deviceVersionName: item.versionName,
              deviceVersionIdFlag: item.deviceVersionId + '_' + false,
              isNewPro: false
            })
          }
        }
      })
      return arr
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
  // background: rgba(39, 55, 111, 0.6);
  @include background('multiUnitBackGround');
  border-radius: 4px;
  // color: #cdd8f7;
  @include font_color('mainFontColor12');
  font-family: SourceHanSansCN-Medium;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.multiUnit-head {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  // background: #034c90;
  @include background('overviewBoxBackGround');
  border-radius: 4px 4px 0 0;
  padding-left: 19px;
  border: 1px solid;
  @include border_color('overviewBoxBorderBottomColor');
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
    // background: #122053;
    @include background('multiUnitBackGround1');
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }
  &-block2 {
    background: #10aeff;
    color: #ffffff;
    transition: all 0.3s;
    border-radius: 4px;
  }
  &-dis-block,
  &-dis-block:hover {
    // background: #283667;
    @include background('multiUnitBackGround2');
    // color: #ffffff;
    @include font_color('mainFontColor13');
    cursor: no-drop;
  }
}
.multiUnitFst-foot {
  margin: 20px 0;
  // color: #cdd8f7;
  @include font_color('mainFontColor12');
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
  // color: #cdd8f7;
  @include font_color('mainFontColor12');
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
