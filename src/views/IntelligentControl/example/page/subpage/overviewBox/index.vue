<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <overview-box
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
        />
      </el-col>
      <el-col :span="16">
        <overview-panel
          ref="panel"
          class="overview-panel"
          :data="formPanel.data"
          :field-list="formPanel.fieldList"
        />
      </el-col>
      <div class="get" @click="get">获取值</div>
    </el-row>
  </div>
</template>

<script>
import OverviewBox from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewBox'
import OverviewPanel from '@/views/IntelligentControl/fieldDeviceOverview/common/components/OverviewPanel'
export default {
  components: {
    OverviewBox,
    OverviewPanel
  },
  data() {
    return {
      formInfo: {
        data: {
          checker: '',
          switch: '',
          inputNumber: ''
        },
        fieldList: {
          head: {
            title: '111',
            titleIcon: 'current-waring-icon',
            option: '222',
            optionIcon: 'current-waring-icon'
          },
          body: [
            {
              title: '11',
              key: 'checker',
              type: 'checker',
              defaultClass: '',
              selectedClass: '',
              list: [
                {
                  key: '1',
                  value: 'A'
                },
                {
                  key: '2',
                  value: 'B'
                },
                {
                  key: '3',
                  value: 'C'
                }
              ]
            },
            {
              label: '风机开关',
              key: 'switch',
              type: 'switch'
            },
            {
              title: '生效时长(秒)',
              key: 'inputNumber',
              type: 'inputNumber'
            },
            {
              title: '断网报警',
              key: 'name',
              type: 'radio',
              optList: ['全部', '演唱会', '球赛']
            },
            {
              title: '定速风机数量（0-5）',
              key: 'input',
              type: 'input'
            }
          ]
        }
      },
      formPanel: {
        data: {
          exchange: {
            openTemp: ''
          }
        },
        fieldList: {
          head: {
            title: '定速风机控制',
            titleIcon: '',
            option: '发送指令',
            optionIcon: 'send-instructions',
            handleClick: () => {
              console.log('发送指令', this.formPanel)
              this.formPanel.body.disabled = true
            }
          },
          body: {
            disabled: false,
            titles: ['基础温度（0.1°C）', '偏差温度（0.1°C）', '最小通风量（%）', '关闭温度（0.1°C）', '间接运行时长（分）'],
            labels: [
              {
                label: '热交换',
                key: 'exchange',
                lists: [
                  {
                    key: 'openTemp',
                    controlsPositionRight: 'right'
                  }
                ]
              },
              {
                label: '地沟',
                key: 'gutter',
                lists: [

                ]
              }
            ]
          }
        }
      }
    }
  },
  methods: {
    get() {
      // console.log('获取的值', this.formInfo.data)
      // console.log('获取的ref', this.$refs.panel.sendShow)
      // this.$refs.panel.sendShow = true
      console.log('OverviewPanel测试值', this.formPanel.data.exchange)
    }
  }
}
</script>

<style lang="scss" scoped></style>
