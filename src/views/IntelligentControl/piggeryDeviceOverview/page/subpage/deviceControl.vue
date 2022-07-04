<template>
  <div class="equipment-control">
    <!-- <div class="refresh">
      <el-switch
        v-model="isRefresh"
        active-color="#10AEFF"
        inactive-color="#586CA5"
      />
      <div class="name">开启自动刷新</div>
    </div> -->
    <div
      v-if="overviewDetail && overviewDetail.equiment_info && !overviewDetail.equiment_info.statusOnline"
      style="height: calc(100vh - 280px);display: flex;
    justify-content: center;
    align-items: center;"
    >
      <img style="width:262px;height:60%;marginBottom:10%;;" :src="noData | noDataFile('status-online', 'webp')" alt="">
    </div>
    <div v-else v-loading="loading" class="equipment-body">
      <div class="row-1">
        <overview-box
          ref="spray"
          class="overview-box"
          :data="spray.data"
          :field-list="spray.fieldList"
          :checker-id="spray.checkerId"
        />
        <!-- 警铃 警灯控制 -->
        <overview-box
          ref="alarm"
          class="overview-box"
          :data="alarm.data"
          :field-list="alarm.fieldList"
        />
        <!-- 雾化盘控制 -->
        <overview-box
          ref="humid"
          class="overview-box"
          :data="humid.data"
          :field-list="humid.fieldList"
        />
        <!-- 饲喂控制 -->
        <overview-box
          ref="feedConfig"
          class="overview-box"
          :data="feedConfig.data"
          :field-list="feedConfig.fieldList"
          :checker-id="feedConfig.checkerId"
        />
        <div class="flex flex-view small">
          <overview-box
            ref="stateTrigger"
            :data="stateTrigger.data"
            :field-list="stateTrigger.fieldList"
          />
          <overview-box
            :data="stateParameters.data"
            :field-list="stateParameters.fieldList"
          />
          <!-- </div>
        <div class="flex flex-view small"> -->
          <overview-box
            ref="Reboot"
            :data="Reboot.data"
            :field-list="Reboot.fieldList"
          />
          <overview-box
            ref="resetDevInstall"
            :data="resetDevInstall.data"
            :field-list="resetDevInstall.fieldList"
          />
          <!-- </div> -->
          <!-- <div class="flex flex-view small"> -->
          <overview-box
            ref="factorySetting"
            :data="factorySetting.data"
            :field-list="factorySetting.fieldList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mcuInstruction,
  UploadState,
  UploadParam,
  DevReboot,
  ResetDevInstall,
  FactorySetting
} from '@/http/api/piggeryDeviceOverview'
import OverviewBox from '@/views/IntelligentControl/piggeryDeviceOverview/common/components/OverviewBox/index.vue'
import rulesService from './utils/verification'
export default {
  components: {
    OverviewBox
  },
  inject: ['overviewDetail'],
  data() {
    return {
      noData: '',
      overviewDetail: {
        equiment_info: this.$route.params.overview
      }, //
      loading: false,
      isRefresh: false,
      deviceId: '4D5920363455484E501300570037',
      deviceName: '4SmfkBNuvB2k3vi987oern',
      // 喷淋控制
      spray: {
        checkerId: 1,
        data: {
          ctrlDevType: 'Shower',
          way: 1,
          open: true,
          duration: 60
        },
        fieldList: {
          head: {
            title: '喷淋控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.spray.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = this.spray.data
                  this.mcuInstruction([data])
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              title: '线路ID',
              key: 'way',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  value: '喷淋1',
                  key: 1,
                  id: 1
                },
                {
                  value: '喷淋2',
                  key: 2,
                  id: 2
                }
                // {
                //   value: '喷淋3',
                //   key: 3,
                //   id: 3
                // },
                // {
                //   value: '喷淋4',
                //   key: 4,
                //   id: 4
                // }
              ]
            },
            {
              label: '喷淋开关',
              key: 'open',
              type: 'switch'
            },
            {
              label: '生效时长(秒)',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              controlsPositionRight: 'right',
              ...rulesService.limit_0_65535
            }
          ]
        }
      },
      // 警灯 警铃控制
      alarm: {
        data: {
          AlarmBell: 60,
          AlarmLight: 60
        },
        fieldList: {
          head: {
            title: '警铃警灯控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.alarm.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const data = [
                    {
                      ctrlDevType: 'AlarmBell',
                      way: 1,
                      open: true,
                      duration: this.alarm.data.AlarmBell
                    },
                    {
                      ctrlDevType: 'AlarmLight',
                      way: 1,
                      open: true,
                      duration: this.alarm.data.AlarmLight
                    }
                  ]
                  this.mcuInstruction(data)
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              title: '警铃生效时长（秒）',
              key: 'AlarmBell',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              ...rulesService.limit_0_3600
            },
            {
              title: '警灯生效时长（秒）',
              key: 'AlarmLight',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              ...rulesService.limit_0_3600
            }
          ]
        }
      },
      // 饲喂控制
      feedConfig: {
        checkerId: 2,
        data: {
          way: 1,
          open: true,
          duration: 60
        },
        fieldList: {
          head: {
            title: '饲喂控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.feedConfig.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const { open, duration } = this.feedConfig.data
                  const data = [
                    {
                      ctrlDevType: 'Feed',
                      way: 1,
                      open,
                      duration
                    }
                  ]
                  this.mcuInstruction(data)
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            // {
            //   title: '线路ID',
            //   key: 'way',
            //   type: 'checker',
            //   defaultClass: '',
            //   selectedClass: '',
            //   list: [
            //     {
            //       value: '线路1',
            //       key: 1,
            //       id: 1
            //     },
            //     {
            //       value: '线路2',
            //       key: 2,
            //       id: 2
            //     }
            //   ]
            // },
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              title: '生效时长（秒）',
              key: 'duration',
              min: 0,
              max: 65535,
              type: 'inputNumber',
              ...rulesService.limit_0_3600
            }
          ]
        }
      },
      // 雾化盘控制
      humid: {
        data: {
          open: true,
          duration: 60
        },
        fieldList: {
          head: {
            title: '雾化盘控制',
            titleIcon: 'spray-ico',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.$refs.humid.$refs.overviewBoxForm.validate((valid) => {
                if (valid) {
                  const { open, duration } = this.humid.data
                  const data = [
                    {
                      ctrlDevType: 'Humid',
                      way: 1,
                      open,
                      duration
                    }
                  ]
                  this.mcuInstruction(data)
                } else {
                  this.$message.error(rulesService.submitErrorTip)
                  return false
                }
              })
            }
          },
          body: [
            {
              label: '开关',
              key: 'open',
              type: 'switch'
            },
            {
              title: '生效时长（秒）',
              key: 'duration',
              type: 'inputNumber',
              ...rulesService.limit_0_no
            }
          ]
        }
      },
      // 触发状态上报
      stateTrigger: {
        fieldList: {
          head: {
            title: '触发状态上报',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.UploadState()
            }
          }
        }
      },
      // 触发参数上报
      stateParameters: {
        fieldList: {
          head: {
            title: '触发参数上报',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.UploadParam()
            }
          }
        }
      },
      // 重启
      Reboot: {
        fieldList: {
          head: {
            title: '设备重启',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.DevReboot()
            }
          }
        }
      },
      // 重新检测设备
      resetDevInstall: {
        fieldList: {
          head: {
            title: '重新检测设备',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.ResetDevInstall()
            }
          }
        }
      },
      // 恢复出厂设置
      factorySetting: {
        fieldList: {
          head: {
            title: '恢复出厂设置',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              this.FactorySetting()
            }
          }
        }
      }
    }
  },
  created() {
    this.overviewDetail.equiment_info = JSON.parse(sessionStorage.getItem('piggeryInfos')).overview
  },
  methods: {
    mcuInstruction(data) { // https://dev.imuyuan.com/api/unit_evc/myPiggeryShower/control/device?
    // deviceId=4D5D203535555850501700330029&deviceName=7bgdS28GdCQH3dpGwsx144&channel=1
      // console.log(this.overviewDetail.equiment_info.deviceId, this.overviewDetail.equiment_info.deviceName, this.overviewDetail.equiment_info.deviceId)
      // 当前设备不在线，不发送指令
      const { statusOnline } = this.overviewDetail.equiment_info
      if (!statusOnline) {
        this.$message.warning('当前设备离线！')
        return
      }
      console.log('设备控制发送的参数', data)
      console.log(this)
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      const channel = this.overviewDetail.equiment_info.channel
      this.loading = true
      mcuInstruction({ deviceId, deviceName, channel }, data).then((res) => {
        this.loading = false
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          // this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    UploadState(data) {
      // 当前设备不在线，不发送指令
      const { statusOnline } = this.overviewDetail.equiment_info
      if (!statusOnline) {
        this.$message.warning('当前设备离线！')
        return
      }
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      UploadState({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          // this.$message.error(res.message)
        }
      })
    },
    UploadParam(data) {
      // 当前设备不在线，不发送指令
      const { statusOnline } = this.overviewDetail.equiment_info
      if (!statusOnline) {
        this.$message.warning('当前设备离线！')
        return
      }
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      UploadParam({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          // this.$message.error(res.message)
        }
      })
    },
    DevReboot(data) {
      // 当前设备不在线，不发送指令
      const { statusOnline } = this.overviewDetail.equiment_info
      if (!statusOnline) {
        this.$message.warning('当前设备离线！')
        return
      }
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      DevReboot({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          // this.$message.error(res.message)
        }
      })
    },
    ResetDevInstall(data) {
      // 当前设备不在线，不发送指令
      const { statusOnline } = this.overviewDetail.equiment_info
      if (!statusOnline) {
        this.$message.warning('当前设备离线！')
        return
      }
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      ResetDevInstall({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          // this.$message.error(res.message)
        }
      })
    },
    FactorySetting(data) {
      // 当前设备不在线，不发送指令
      const { statusOnline } = this.overviewDetail.equiment_info
      if (!statusOnline) {
        this.$message.warning('当前设备离线！')
        return
      }
      const deviceId = this.overviewDetail.equiment_info.deviceId
      const deviceName = this.overviewDetail.equiment_info.deviceName
      FactorySetting({ deviceId, deviceName }, data).then((res) => {
        if (res.rel) {
          this.$message.success(res.message)
        } else {
          // this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row-1,.row-2,.row-3{
  display: flex;
  flex-wrap: wrap;
}
.row-1{
  .flex-view{
    // align-content:space-between;
        flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 20px;
    padding-right: 20px;
    .overview-box {
      margin: 0;
      flex: none;
      min-width: 0;
    }
  }
}
.overview-box {
  // height: 418px;
  margin-bottom: 20px;
  margin-right: 20px;
  // width: 20%;
  // width: 320px;
  flex: 1;
  min-width: 10%;
  &:nth-child(5n) {
    margin-right: 0;
  }
}
.small {
  height: auto;
}
.refresh {
  font-size: 12px;
  color: #f4f7ff;
  @include font_color('mainFontColor2');
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .name {
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
.equipment-body{
  .el-form-item__error{
    top: 76px;
  }
}
</style>
