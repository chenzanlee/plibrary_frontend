<template>
  <div class="home">
    <div style="display: flex; justify-content: end;">
      <flight-form
        ref="childRules"
        :form-config="formConfig"
      />
      <div class="top-l">
        <p>室外温湿度：<span class="sp1">24.8°c</span><span class="sp2">92%</span></p>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="titleHighlight" style="background: #0D1E4E">
          <h3 class="short-title">告警信息</h3>
          <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane v-for="(item , index) in table" :key="index" :label="item.tabOne" :name="item.name">
                <span slot="label" class="tab-t">{{ item.tabOne }}</span>
                <div class="radio">
                  <el-button v-for="(j,k) in item.radio" :key="k" :class="{'active':currentSort==k}" :icon="j.icon" @click="active(k)">{{ j.name }}({{ j.number }})</el-button>
                </div>
                <el-scrollbar class="home-warp-scrollbar">
                  <div class="home-warp">
                    <div class="home-item">
                      <div class="item-title">
                        <span>哺乳舍2</span>
                        <div class="icon"><i class="el-icon-edit" /></div>
                      </div>
                      <div class="item-t">
                        <p>丨 猪舍前</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                      <div class="item-b">
                        <p>丨 猪舍后</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                    </div>
                    <div class="home-item">
                      <div class="item-title">
                        <span>哺乳舍2</span>
                        <div class="icon"><i class="el-icon-edit" /></div>
                      </div>
                      <div class="item-t">
                        <p>丨 猪舍前</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                      <div class="item-b">
                        <p>丨 猪舍后</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                    </div>
                    <div class="home-item">
                      <div class="item-title">
                        <span>哺乳舍2</span>
                        <div class="icon"><i class="el-icon-edit" /></div>
                      </div>
                      <div class="item-t">
                        <p>丨 猪舍前</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                      <div class="item-b">
                        <p>丨 猪舍后</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                    </div>
                    <div class="home-item">
                      <div class="item-title">
                        <span>哺乳舍2</span>
                        <div class="icon"><i class="el-icon-edit" /></div>
                      </div>
                      <div class="item-t">
                        <p>丨 猪舍前</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                      <div class="item-b">
                        <p>丨 猪舍后</p>
                        <div>
                          <span>温度：27.3°C</span>
                          <span>湿度：79.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>

              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="overflow: hidden;">
        <div class="main-right titleHighlight">
          <h3 class="short-title">告警信息</h3>
          <p style="font-size: 16px;color: #CDD8F7;margin-tottom:10px">丨 后背舍2</p>
          <div class="right-tab">
            <el-scrollbar class="ul-scrollbar">
              <ul>
                <li v-for="(j,k) in ul.list" :key="k">{{ j.title }}</li>
              </ul>
            </el-scrollbar>

          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import flightForm from '@/components/ElementComponent/tableForm'
export default {
  name: 'Itable',
  components: {
    flightForm
  },
  data() {
    return {
      currentSort: 0,
      // tab可以选择默认
      activeName: 'AllTypes',
      ul: {
        tabOne: '猪只',
        icon: 21,
        name: 'second',
        list: [
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          },
          {
            title: '单元喷淋系统已损坏，请及时处理。'
          }
        ]
      },
      table: [
        {
          tabOne: '全部类型',
          name: 'AllTypes',
          radio: [
            {
              name: '全部',
              number: 48,
              icon: ''
            },
            {
              name: '在线',
              number: 48,
              icon: 'el-icon-success'
            },
            {
              name: '离线',
              number: 48,
              icon: 'el-icon-error'
            },
            {
              name: '告警',
              number: 48,
              icon: 'el-icon-warning'
            },
            {
              name: '空圈',
              number: 48,
              icon: 'el-icon-picture-outline'
            },
            {
              name: '暂停报警',
              number: 48,
              icon: 'el-icon-remove'
            },
            {
              name: '参数锁定',
              number: 48,
              icon: 'el-icon-sold-out'
            }
          ]
        },
        {
          tabOne: '哺乳舍',
          icon: 21,
          name: 'NursingHome1',
          radio: [
            {
              name: '全部',
              number: 48,
              icon: ''
            },
            {
              name: '在线',
              number: 48,
              icon: 'el-icon-success'
            },
            {
              name: '离线',
              number: 48,
              icon: 'el-icon-error'
            },
            {
              name: '暂停报警',
              number: 48,
              icon: 'el-icon-remove'
            },
            {
              name: '参数锁定',
              number: 48,
              icon: 'el-icon-sold-out'
            }
          ]
        },
        {
          tabOne: '保育舍',
          icon: 21,
          name: 'NursingHome2',
          radio: [
            {
              name: '全部',
              number: 48,
              icon: ''
            },
            {
              name: '在线',
              number: 48,
              icon: 'el-icon-success'
            },
            {
              name: '离线',
              number: 48,
              icon: 'el-icon-error'
            },
            {
              name: '告警',
              number: 48,
              icon: 'el-icon-warning'
            },
            {
              name: '参数锁定',
              number: 48,
              icon: 'el-icon-sold-out'
            }
          ]
        },
        {
          tabOne: '育肥舍',
          icon: 21,
          name: 'NursingHome3',
          radio: [
            {
              name: '全部',
              number: 48,
              icon: ''
            },
            {
              name: '在线',
              number: 48,
              icon: 'el-icon-success'
            },
            {
              name: '离线',
              number: 48,
              icon: 'el-icon-error'
            },
            {
              name: '告警',
              number: 48,
              icon: 'el-icon-warning'
            },
            {
              name: '空圈',
              number: 48,
              icon: 'el-icon-picture-outline'
            },
            {
              name: '暂停报警',
              number: 48,
              icon: 'el-icon-remove'
            },
            {
              name: '参数锁定',
              number: 48,
              icon: 'el-icon-sold-out'
            }
          ]
        },
        {
          tabOne: '后背舍',
          icon: 21,
          name: 'NursingHome4',
          radio: [
            {
              name: '全部',
              number: 48,
              icon: ''
            },
            {
              name: '在线',
              number: 48,
              icon: 'el-icon-success'
            },
            {
              name: '离线',
              number: 48,
              icon: 'el-icon-error'
            },
            {
              name: '告警',
              number: 48,
              icon: 'el-icon-warning'
            },
            {
              name: '空圈',
              number: 48,
              icon: 'el-icon-picture-outline'
            },
            {
              name: '暂停报警',
              number: 48,
              icon: 'el-icon-remove'
            },
            {
              name: '参数锁定',
              number: 48,
              icon: 'el-icon-sold-out'
            }
          ]
        },
        {
          tabOne: '怀孕舍',
          icon: 21,
          name: 'NursingHome5',
          radio: [
            {
              name: '全部',
              number: 48,
              icon: ''
            },
            {
              name: '在线',
              number: 48,
              icon: 'el-icon-success'
            },
            {
              name: '离线',
              number: 48,
              icon: 'el-icon-error'
            },
            {
              name: '告警',
              number: 48,
              icon: 'el-icon-warning'
            },
            {
              name: '空圈',
              number: 48,
              icon: 'el-icon-picture-outline'
            },
            {
              name: '暂停报警',
              number: 48,
              icon: 'el-icon-remove'
            },
            {
              name: '参数锁定',
              number: 48,
              icon: 'el-icon-sold-out'
            }
          ]
        },
        {
          tabOne: '公猪舍',
          icon: 21,
          name: 'NursingHome6',
          radio: [
            {
              name: '全部',
              number: 48,
              icon: ''
            },
            {
              name: '在线',
              number: 48,
              icon: 'el-icon-success'
            },
            {
              name: '参数锁定',
              number: 48,
              icon: 'el-icon-sold-out'
            }
          ]
        }
      ],
      selection: '',
      // 配置from表单的显示
      formConfig: {
        // 显示选项配置
        formItemList: [
          {
            type: 'select',
            model: 'importOrExport',
            prop: 'importOrExport',
            label: '进出港',
            name: 'importOrExport',
            placeholder: '请输入进出港',
            rules: [
              { required: true, message: '请输入进出港', trigger: 'blur' }
            ],
            optList: [
              {
                value: '测试数据',
                label: '测试数据'
              },
              {
                value: '进港',
                label: '进港'
              },
              {
                value: '出港',
                label: '出港'
              }
            ]
          }
        ],
        // 按钮配置项跟处理按钮事件名称的填写 type: "90" 表示宽度90的按钮 class:'btn-blue' 代表蓝色按钮以下同理
        operate: [
          {
            size: '90',
            class: 'btn-blue',
            name: '查询',
            handleClick: this.search
          },
          {
            size: '90',
            class: 'btn-border',
            name: '空圈设置',
            handleClick: () => {
              alert('暂时没有设置')
            }
          }
        ]
      }
    }
  },
  methods: {
    active(index) {
      this.currentSort = index
    },
    // tab的点击事件
    handleClick(tab, event) {
      console.log(event)
    },
    // 查询
    search() {
      const returnValue = this.$refs['childRules'].validateForm()
      if (returnValue.flag) {
        console.log('父组件拿到参数值' + JSON.stringify(returnValue.value))
      }
    },
    // 新增或重置
    add() {
      this.$refs['childRules'].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.home-warp-scrollbar{
    height:calc(100vh - 360px);
    overflow-x: hidden;
}
.top-l{
    font-size: 14px;
    color: #CDD8F7;
    line-height: 36px;
    margin-left: 20px;
    span{
        padding: 0 15px ;
    }
    .sp1{
        color: #1FBFFF ;
    }
    .sp2{
        color: #1FFFA0  ;
    }
}
.radio{
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
    button[type='button']{
        background: transparent;
        border:1px solid #7894E3 ;
        color: #7894E3 ;
        padding: 0 5px;
        height: 24px;
    }
    button.active[type='button']{
        background: rgba(9,30,64,0.00);
        border: 1px solid #1FBFFF;
        box-shadow: inset 0 0 10px 0 #217BFC;
    }
}
.home-warp{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    >div{
        margin: 10px;
    }
}
.home-item{
    background-image: linear-gradient(225deg, #2B3C7A 0%, #1B265B 100%);
    border: 2px solid #10AEFF;
    box-shadow: 0 2px 20px 0 #04082D;
    border-radius: 4px;
    color: #CDD8F7;
    box-sizing: border-box;
    >div{
        padding:0 20px;
    }
    .item-title{
        display: flex;
        justify-content: space-between;
        background: #2E3E7C;
        line-height: 34px;
        height: 34px;
    }
    .item-t{
        border-bottom:1px solid  #374990;
    }
    .item-t , .item-b{
        line-height: 34px;
        >p{
            font-size: 12px;
        }
        >div{
            display: flex;
            justify-content: space-between;
            font-size: 12px;
        }
    }
}
.main-right{
    width: 100%;
    background: #001D45;
    .warning{
        width: 100%;
        padding:20px 5px ;
        background-image: linear-gradient(225deg, #2C4190 0%, #1D2A69 100%);
        border-radius: 8px;
        border-radius: 8px;
        display: flex;
        .warning-item{
        width: 50%;
        display: flex;
        text-align: left;
        .number{
            font-size: 30px;
            color: #8EA0EA;
        }
        .name{
            font-size: 14px;
            color: #8EA0EA;
        }
        .waring-icon{
            width: 40px;
            height: 43px;
            margin: 10px;
        }
        }
    }
    .right-tab{
        width: 100%;
        margin-top: 20px;
        .ul-scrollbar{
            height: calc(100vh - 310px);
            overflow-x: hidden;
        }
        .tab-t{
        position: relative;
        >i{
            padding:3px 5px;
            background: #E45353 ;
            color: #fff;
            position: absolute;
            top: 0;
            right: -25px;
            font-style:normal;
            font-size: 10px;
            line-height: 10px;
            border-radius: 10px;
        }
        }
        li{
        list-style:inside;
        font-size: 14px;
        color: #CDD8F7;
        overflow: hidden;
        line-height: 40px;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        }
        li:hover{
        color: #3E9AFF;
        }
    }
}

</style>
