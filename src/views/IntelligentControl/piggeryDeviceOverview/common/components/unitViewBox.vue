<template>
  <div class="unitViewBox">
    <div class="top">
      {{ obj.roomTypeName + obj.unitName }}
      <div class="svg">
        <svg-icon v-if="obj.statusOnline" icon-class="online-ico" title="在线" />
        <svg-icon v-else icon-class="offline-ico" title="离线" />
        <!-- <span v-if="obj.alarmStatus" style="margin-right: 4px;position:relative;" @mouseenter="getalarmInfo(obj)">
          <suspensionAlarm v-show="alarmShow" :info="equipmentAlarmDetails" @closeAlarm="closeAlarm" />
          <svg-icon icon-class="warn-num" title="警告" />
        </span> -->
        <el-popover
          :key="obj.deviceId"
          placement="top-start"
          title="告警详情"
          trigger="hover"
          @show="getalarmInfo(obj)"
        >
          <AlarmBox
            v-loading="isAlarmLoading"
            :info="equipmentAlarmDetails"
          />
          <svg-icon
            v-if="obj.alarmStatus"
            slot="reference"
            class="icon-item"
            icon-class="warn-num"
          />
        </el-popover>
        <svg-icon v-if="obj.isEmptyUnit" icon-class="empty-ico" title="空圈" />
        <svg-icon v-if="obj.lockParam" icon-class="lock-ico" title="参数锁定" />
      </div>
    </div>
    <div class="center">
      <div class="typeStr">{{ obj.typeStr }}</div>
      <div class="light_bell">
        <div class="bell" :style="{color: obj.isOpenAlarmBell ? '#FF2727':'#9EB6FB' }">
          <div class="icon_box" :style="{ borderColor: obj.isOpenAlarmBell ? '#FF2727':'#9EB6FB'}">
            <i class="iconfont" :style="{ color: obj.isOpenAlarmBell ? '#FF2727':'#9EB6FB'}">&#xe614;</i>
          </div>
          警铃
        </div>
        <div class="light" :style="{color: obj.isOpenAlarmBell ? '#FF2727':'#9EB6FB' }">
          <div class="icon_box" :style="{ borderColor: obj.isOpenAlarmBell ? '#FF2727':'#9EB6FB'}">
            <i class="iconfont" :style="{ color: obj.isOpenAlarmLight ? '#FF2727':'#9EB6FB'}">&#xe60e;</i>
          </div>
          警灯
        </div>
      </div>
      <div class="items">
        <div class="item">
          数量(头)
          <div class="label">{{ obj.count }}</div>
        </div>
        <div class="item">
          日龄(天)
          <div class="label">{{ obj.age }}</div>
        </div>
        <div class="item">
          温度(℃)
          <div class="label">{{ obj.temperature === -100 ? '--' : obj.temperature }}</div>
        </div>
        <div class="item">
          湿度(%)
          <div class="label">{{ obj.humidity === -100 ? '--' : obj.humidity }}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="icon_box">
        <i class="iconfont">&#xe615;</i>
      </div>
      <div class="right">
        <p>{{ obj.startTimeDesc || '---' }}开启</p>
        时长：{{ obj.durationDesc || '---' }}
      </div>
    </div>
  </div>
</template>

<script>
// import suspensionAlarm from './suspensionAlarm'
import AlarmBox from '@/components/alarm-box/index'
export default {
  components: {
    // suspensionAlarm,
    AlarmBox
  },
  props: {
    pageElement: {
      type: Object,
      default: () => {
        return {}
      }
    },
    obj: { // 该单元对象
      type: Object,
      default: () => {
        return {
          'channel': 1,
          'regionId': '10',
          'regionName': '西北',
          'areaId': '15174012',
          'areaName': '闻喜',
          'fieldId': '15174016',
          'fieldName': '闻喜1厂生长厂1区',
          'segmentId': '13906',
          'segmentName': '保育',
          'unitId': '7GbSYUQbad7sW5H0qmIenY',
          'unitName': '1',
          'deviceType': null,
          'deviceName': '7bgdS28GdCQH3dpGwsx144',
          'deviceId': '4D5D203535555850501700330029',
          'equiptypeId': null,
          'equiptypeName': null,
          'deviceVersionId': null,
          'deviceVersionName': null,
          'equipmentId': null,
          'qrCode': null,
          'description': null,
          'status': null,
          'roomTypeId': '13906',
          'roomTypeName': '保育舍',
          'lockParam': null,
          'isOpenShower1': 0,
          'isOpenShower2': 0,
          'isOpenShower3': 0,
          'isOpenShower4': 0,
          'isOpenAlarmBell': 1,
          'isOpenAlarmLight': 1,
          'temperature': -100,
          'humidity': -100,
          'statusOnline': 0,
          'type': 1,
          'typeStr': '保育',
          'count': 600,
          'age': 52,
          'time': '2020-10-10T11:18:00Z',
          'timeStr': '2020-10-10 19:18:00',
          'mask': 0,
          'alarmStatus': 1,
          'firmwareVersion': '10623',
          'startTimeDesc': '3天16小时33分钟前',
          'durationDesc': '10秒'
        }
      }
    }
  },
  data() {
    return {
      equipmentAlarmDetails: [],
      alarmShow: false,
      isAlarmLoading: false
    }
  },
  methods: {
    closeAlarm() {
      this.alarmShow = false
    },
    // 告警详情
    async getalarmInfo(obj) {
      console.log('getalarmInfo---', obj)
      this.alarmShow = true
      const data = {
        channel: obj.channel,
        deviceId: obj.deviceId,
        deviceName: obj.deviceName
      }
      const element = this.pageElement['getAlarmDetails']
      this.isAlarmLoading = true
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri,
        payload: data,
        callback: res => {
          this.isAlarmLoading = false
          if (res.status === 200) {
            this.equipmentAlarmDetails = res.data.rows
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-popover__title {
          color: #fff;
          @include font_color('inPigFontColor');
        }
  .unitViewBox{
        &:hover{
          cursor: pointer;
          // background-color: #4255A2;
          @include background_color('inPigBackGroundColor');
          .center, .bottom{
            // background-color: #4255A2;
            @include background_color('inPigBackGroundColor12');
          }
          // .items{
          //   .label{
          //     @include font_color('inPigFontColor2');
          //   }
          // }
        }
        @include background_color('inPigBackGroundColor1');
        border: 1px solid;
        @include border_color('bpBorderColor5');
        border-radius: 4px;
      .top{
          height: 30px;display: flex;align-items: center;justify-content: space-between;padding:0 10px;
          // background: #2e3e7c;
          @include background_color('bpBackGroundColor');
          border-bottom: 1px solid;
          @include border_color('inPigBorderColor5');
          font-size: 12px;
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            // color: #ffffff;
            @include font_color('bpFontColor2');
          .svg{
            .svg-icon{font-size: 12px;&:not(:last-child){margin-right: 4px;}}
          }
      }
      .center{display: flex;flex-direction: column;justify-content: center;position: relative;
           @include background_color('inPigBackGroundColor11');
          .typeStr{
            width: 44px;
            height: 20px;
            line-height: 20px;
            padding-left: 10px;
            background: #2e3e7c;
            @include background_color('inPigBackGroundColor13');
            border-radius: 15px 0px 0px 15px;
            border: 1px solid;
            border-right: none;
            @include border_color('inPigBorderColor6');
            position: absolute;
            right: 0;
            top: 10px;
            font-size: 12px;
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #a6beff;
          }
          .iconfont{font-size: 22px;vertical-align: bottom;}
          .light_bell{display: flex;justify-content: space-around;font-size:12px;
                     color: #d3d3d3;
                     padding:8px 38px;
           .light,.bell{display: flex;flex-direction: column;justify-content: center;align-items: center;
                .icon_box{
                  border: 1px solid #20a4fc;border-radius: 6px;padding:13px;margin-bottom:4px;
                }
            }
          }
        .items{
            margin-bottom: 10px;
            opacity: 0.7;
            font-size: 12px;
            font-family: SourceHanSansCN, SourceHanSansCN-Normal;
            color: #8ea0ea;
            @include font_color('inPigFontColor5');
            display: flex;
            justify-content: space-around;
            .item{text-align: center;
              .label{
              // color: #cdd8f7;
              @include font_color('inPigFontColor1');
              font-size: 14px;text-align: center;}
            }
        }
      }
      .bottom{
          display: flex;justify-content: flex-start;
          // background: #2e3e7c;
          @include background_color('inPigBackGroundColor13');
          border-radius: 0px 0px 4px 4px;
          padding: 10px 20px;display:flex;
          .icon_box{
                padding:7px;border: 1px solid #20a4fc;border-radius: 6px;height:30px;
                width: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                .iconfont{font-size: 16px;color: #20A4FC;}
            }
          .right{
              margin-left: 10px;
              font-size: 12px;
                font-family: SourceHanSansCN, SourceHanSansCN-Normal;
                color: #a6beff;
                @include font_color('inPigFontColor6');
              p{
                // overflow: hidden; //独立一行 超过部分隐藏
                // text-overflow: ellipsis; //省略号
                // white-space: nowrap; //规定段落中的文本不进行换行
            }
          }
      }
  }
</style>
