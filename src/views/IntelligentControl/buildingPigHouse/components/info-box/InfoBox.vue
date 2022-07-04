<template>
  <div class="info-box-container">
    <div class="info-wrap" @click="viewDetail">
      <div class="title-box">
        <div>
          <el-checkbox v-if="hasCheckBox" v-model="checkedObj[data.deviceId]" style="margin-right:5px;" :disabled="data.statusOnline === 1 ? false : true" @change="(checked)=>{onChange(checked,data.deviceId)}" />
          <span class="cur">
            {{ formatData(data.floor, data.roomTypeName,data.unit) }}
          </span>
        </div>
        <span>
          <svg-icon
            class="icon-item"
            :icon-class="data.statusOnline === 1 ? 'online-ico' : 'offline-ico'"
          />
          <el-popover
            :key="data.deviceId"
            title="告警详情"
            trigger="hover"
            @show="getContent"
          >
            <AlarmBox :info="alarmDatas" />
            <svg-icon
              v-if="data.statusWarning === 1"
              slot="reference"
              class="cur"
              :icon-class="'warn-num'"
            />
          </el-popover>
          <svg-icon
            v-if="data.isAlarmSuspend === 1"
            class="icon-item"
            icon-class="empty-ico"
          />
          <svg-icon
            v-if="data.isEmptyUnit === 1"
            class="icon-item"
            icon-class="empty-ico"
          />
        </span>
      </div>
      <div class="content-box">
        <div v-if="isShow('前温湿度')" class="single-content">
          <span class="left">前</span>
          <span class="right">{{ `${valueExist(data.beforeIndoorTemp) ? data.beforeIndoorTemp+'℃': '---'}/${valueExist(data.beforeIndoorHumidity) ? data.beforeIndoorHumidity+'%' : '---'}` }}</span>
        </div>
        <div v-if="isShow('后温湿度')" class="single-content">
          <span class="left">后</span>
          <span class="right">{{ `${valueExist(data.afterIndoorTemp) ? data.afterIndoorTemp+'℃': '---'}/${valueExist(data.afterIndoorHumidity) ? data.afterIndoorHumidity+'%' : '---'}` }}</span>
        </div>
        <div v-if="isShow('0级开度')" class="single-content">
          <span class="left">0级</span>
          <span class="right">{{ `${valueExist(data.windowZeroOpenPercent) ? data.windowZeroOpenPercent+'%' : '---'}` }}</span>
        </div>
        <div v-if="isShow('1级风速')" class="single-content">
          <span class="left">1级风</span>
          <span class="right">{{ `${valueExist(data.windowOneSpeed) ? data.windowOneSpeed+'m/s' : '---'}` }}</span>
        </div>
        <div v-if="isShow('2级风速')" class="single-content">
          <span class="left">2级风</span>
          <span class="right">{{ `${valueExist(data.windowTwoSpeed) ? data.windowTwoSpeed+'m/s' : '---'}` }}</span>
        </div>
        <div v-if="isShow('4级风速')" class="single-content">
          <span class="left">4级风</span>
          <span class="right">{{ `${valueExist(data.windowFourSpeed) ? data.windowFourSpeed+'m/s' : '---'}` }}</span>
        </div>
        <div v-if="isShow('4级开度')" class="single-content">
          <span class="left">4级</span>
          <span class="right">{{ `${valueExist(data.windowFourOpenPercent) ? data.windowFourOpenPercent+'%' : '---'}` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AlarmBox from '@/components/alarm-box/index'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('buildingPigHouse')
export default {
  name: 'InfoBox',
  components: {
    AlarmBox
  },
  props: {
    checkedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hasCheckBox: {
      type: Boolean,
      default: false
    },
    showParams: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    checkChange: Function,
    // eslint-disable-next-line vue/require-default-prop
    handleDetail: Function
  },
  data() {
    return {
      alarmVisible: false,
      alarmDatas: [],
      alarmContent: ''
    }
  },
  methods: {
    isChecked(id, checkedObj) {
      return checkedObj[id]
    },
    onChange(checked, id) {
      this.checkChange(id, checked)
    },
    valueExist(val) {
      if (val === undefined || val === null || val === '') {
        return false
      } else {
        return true
      }
    },
    viewDetail() {
      const { data, handleDetail, hasCheckBox } = this.$props
      if (hasCheckBox) {
        return
      }
      handleDetail(data)
    },
    formatData(floor, roomTypeName, unit) {
      const obj = {
        'FLOOR_ONE': '1楼',
        'FLOOR_TWO': '2楼',
        'FLOOR_THREE': '3楼',
        'FLOOR_FOUR': '4楼',
        'FLOOR_FIVE': '5楼',
        'FLOOR_SIX': '6楼',
        'FLOOR_SEVEN': '7楼',
        'FLOOR_EIGHT': '8楼'
      }
      let str_floor = ''
      if (floor) {
        str_floor = obj[floor] + '-'
      }
      return str_floor + roomTypeName + unit
    },
    isShow(param) {
    // ["前温湿度","后温湿度","0级开度","1级风速","2级风速","4级风速","4级开度"]
      const arr = this.showParams
      if (arr.indexOf(param) !== -1) {
        return true
      } else {
        return false
      }
    },
    getContent() {
      this.alarmDatas = []
      this.$httpRequest({
        type: 'get',
        payload: { deviceId: this.data.deviceId },
        uri: pageElement.getAlarmDetails && pageElement.getAlarmDetails.uri,
        callback: (data) => {
          if (data.data.total > 0) {
            this.alarmDatas = data.data.rows
          }
        }
      })
    }
  }
}
</script>
<style>
.el-popover__title {
  color: #FFF;
}
</style>
<style lang="scss" scoped>
.info-box-container {
  box-sizing: border-box;
  margin-left: 20px;
  margin-bottom: 20px;
  .icon-item {
    margin-right: 5px;
  }
  .info-wrap {
    // width: 180px;
    background-image: linear-gradient(225deg, #223371 0%, #1B265B 100%);
    @include background_image('bpBackGroundImage');
    @include background_color('bpBackGroundColor3');
    border: 1px solid #374990;
    @include border_color('bpBorderColor5');
    border-radius: 4px;
    min-height: 180x;
    cursor: pointer;
    .header-title {
      margin-left: 10px;
    }
    .title-box {
      height: 30px;
      padding: 10px;
      background: #2E3E7C;
      @include background('bpBackGroundColor');
      border-radius: 0 0 4px 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #CDD8F7;
      @include font_color('bpFontColor2');
    }
    .content-box {
      padding:0 10px 10px 10px;
      .single-content {
        font-size: 10px;
        color: #CDD8F7;
        border: 1px solid #324384;
        @include border_color('bpBorderColor6');
        margin-top: 10px;
        span {
          height: 24px;
          line-height: 24px;
          display: inline-block;
          border-radius: 2px 0 0 2px;
        }
        .left {
          width: 40px;
          background: #152358;
          @include background('bpBackGroundColor7');
          color: #CDD8F7;
          @include font_color('bpFontColor2');
          border-right: 1px solid #324384;
          @include border_color('bpBorderColor7');
          text-align: center;
          line-height: 24px;
        }
        .right {
          width: calc(100% - 40px);
          text-align: center;
          background-color: #121F4F;
          @include background_color('bpBackGroundColor8');
          color: #CDD8F7;
          @include font_color('bpFontColor2');
        }
      }
    }
  }
}
</style>
