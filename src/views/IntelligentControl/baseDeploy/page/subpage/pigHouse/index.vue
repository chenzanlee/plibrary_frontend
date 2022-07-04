<template>
  <div class="home">
    <div style="display: flex; justify-content: space-between;">
      <flight-form
        ref="childRules"
        :form-config="formConfig"
      />
      <div class="fr clear-margin">
        <button class="btn-blue" size="90">刷新</button>
        <button class="btn-blue" size="90">批量开</button>
        <button class="btn-border" size="90">批量关</button>
      </div>
    </div>
    <div class="Highlight">
      <el-scrollbar class="machine-scrollbar">
        <div class="Highlight-state">
          <div class="state-l">
            <p>主控制器：<span>在线</span></p>
            <p>室外温度：<span>0°C</span></p>
            <p>室外湿度：<span>0%</span></p>
            <p>开启风机总数：<span>57</span></p>
            <p>平均压差：<span>0pa</span></p>
            <p>目标压差：<span>200pa</span></p>
          </div>
          <div class="state-r">
            <p><span class="close" />关闭</p>
            <p><span class="open" />开启</p>
            <p><span class="alert" />警报</p>
          </div>
        </div>
        <div class="warp-machine dw">
          <div class="tagging">
            <p class="p1">风机</p>
            <p class="p2">除臭泵</p>
            <p class="p3">除臭棚侧</p>
            <p class="p4">天井侧</p>
          </div>
          <div class="machine-item">
            <h3>A1 离线</h3>
            <div class="item-b">
              <div class="b1">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="open">4</span>
                    <span class="open">5</span>
                    <span class="close">6</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="machine-item">
            <h3>A1 离线</h3>
            <div class="item-b">
              <div class="b1">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="open">4</span>
                    <span class="open">5</span>
                    <span class="close">6</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="machine-item">
            <h3>A1 离线</h3>
            <div class="item-b">
              <div class="b1">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="open">4</span>
                    <span class="open">5</span>
                    <span class="close">6</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="machine-item">
            <h3>A1 离线</h3>
            <div class="item-b">
              <div class="b1">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="open">4</span>
                    <span class="open">5</span>
                    <span class="close">6</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="machine-item">
            <h3>A1 离线</h3>
            <div class="item-b">
              <div class="b1">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="open">4</span>
                    <span class="open">5</span>
                    <span class="close">6</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="machine-item">
            <h3>A1 离线</h3>
            <div class="item-b">
              <div class="b1">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="open">4</span>
                    <span class="open">5</span>
                    <span class="close">6</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span class="close">1</span>
                    <span class="open">2</span>
                    <span class="alert">3</span>
                    <span class="alert">3</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>上</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>中</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>下</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
        <div class="warp-machine differential-pressure dw">
          <div class="tagging">
            <p class="p5">压差</p>
          </div>
          <div class="machine-item">
            <div class="item-b">
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="fen">
                    <span>--</span>
                    <span>0°C</span>
                    <span>0%</span>
                    <span>0m/s</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
        <div class="warp-machine fan-warp dw">
          <div class="tagging">
            <p class="p6">除臭泵</p>
            <p class="p7">风机</p>
          </div>
          <div class="machine-item">
            <div class="item-b">
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <p>暂无数据</p>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <p>暂无数据</p>
                  </el-col>
                </el-row>
              </div>
            </div>
            <h3>A1 离线</h3>
          </div>
          <div class="machine-item">
            <div class="item-b">
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <p>暂无数据</p>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <p>暂无数据</p>
                  </el-col>
                </el-row>
              </div>
            </div>
            <h3>A1 离线</h3>
          </div>
          <div class="machine-item">
            <div class="item-b">
              <div class="b2">
                <el-row>
                  <el-col :span="24" class="fen">
                    <p>暂无数据</p>
                  </el-col>
                </el-row>
              </div>
              <div class="b3">
                <el-row>
                  <el-col :span="24" class="fen">
                    <p>暂无数据</p>
                  </el-col>
                </el-row>
              </div>
            </div>
            <h3>A1 离线</h3>
          </div>
        </div>
      </el-scrollbar>
    </div>
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
            class: 'shadow',
            name: '查询',
            handleClick: this.search
          },
          {
            size: '90',
            class: 'border',
            name: 'A座',
            handleClick: () => {
              alert('暂时没有设置')
            }
          },
          {
            size: '90',
            class: 'border',
            name: 'B座',
            handleClick: () => {
              alert('暂时没有设置')
            }
          }
        ],
        vShow: true
      }
    }
  },
  methods: {
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
.Highlight{
    width: 100%;
    padding-right: 20px;
    background: rgba(31,128,220,0.21);
    .Highlight-state{
        width: calc(100% - 120px);
        margin: 20px 0 20px 120px;
        display: flex;
        justify-content: space-between;
        .state-l , .state-r{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #CDD8F7;
            span{
                color: #1FBFFF ;
            }
        }
        .state-r{
            font-size: 14px;
            color: #CDD8F7;
            span{
                // display: inline-block;
                width: 16px;
                height: 16px;
                border-radius: 2px;
                margin: 0px 10px 0 20px;
                float: left;
            }
        }
    }
}
.machine-scrollbar{
    height: calc(100vh - 223px);
    overflow-x: hidden;
}
.warp-machine{
    width: calc(100% - 130px);
    margin-left: 120px;
    display: flex;
    justify-content: start;
    .machine-item{
        background: rgba(3,25,47,0.00);
        border: 1px solid #0B3D6C;
        border-radius: 4px;
        margin-right: 33px;
        h3{
            text-align: center;
            line-height: 30px;
            height: 30px;
            font-size: 14px;
            color: #CDD8F7;
            background: #125A9E;
            border-radius: 4px 4px 0 0;
        }
        .item-b{
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            .el-row{
                margin-top: 10px;
            }
            .fen{
                display: flex;
                justify-content: space-between;
            }
            >div{
                width: 175px;
                box-sizing: border-box;
                padding: 10px;
                box-sizing: border-box;
                background: rgba(31,128,220,0.21);
                border: 1px solid #1F80DC;
                border-radius: 4px;
                border-radius: 4px;
                margin-bottom: 10px;
                .el-row:first-child{
                    margin-top: 0;
                }
            }
            >div:last-child{
                margin-bottom: 0;
            }
            span{
                display: inline-block   ;
                width: 25px;
                height: 25px;
                line-height: 25px;
                text-align: center;
                font-size: 14px;
                color: #FFFFFF;
            }
            .b3,.b4{
                span:nth-child(4n+1){
                    border: 1px solid #fff;
                    font-size: 10px;
                    color: #FFFFFF;
                    border-radius: 50%;
                    line-height: 25px;
                }
            }
        }
    }
    .machine-item:last-child{
        margin-right: 0;
    }
}
.differential-pressure{
    margin-top: 20px;
    .machine-item{
       .item-b{
           width: 100%;
           display: flex;
           justify-content: start;
           background: rgba(31,128,220,0.21);
           padding: 0;
            >div{
                width: 195px;
                border: 0;
                background: none;
                margin-right: 35px;
                margin-bottom: 0;
                padding: 20px;
            }
            >div:last-child{
                margin-right: 0;
            }
            .b3{
                span:nth-child(4n+1){
                    border: none;
                }
            }
       }
    }
}
.fan-warp{
    margin-top: 20px;
    .machine-item{
       h3 {
           border-radius: 0 0  4px 4px;
       }
       p{
           width: 100%;
            font-size: 12px;
            color: #6E83BE;
            text-align: center;
       }
    }
}
.dw > .tagging{
    height: 0;
    width: 0;
    background: red;
    position: relative;
    p{
        position: absolute;
        left: -114px;
        width: 56px;
        font-size: 14px;
        color: #CDD8F7;
        text-align: right;
    }
    p::after{
        content: '';
        width: 65px;
        height: 0;
        border-top: 1px dashed  rgba(31,128,220,1);
        position: absolute;
        top: 10px;
        right: -70px;
    }
    p::before{
        content: '';
        width: 0;
        height: 0;
        border: 4px solid  rgba(31,128,220,1);
        border-radius: 50%;
        position: absolute;
        top: 6px;
        right: -74px;
    }
    .p5::after{
        width: 60px;
        top: 10px;
        right: -63px;
    }
    .p5::before{
        top: 6px;
        right: -63px;
    }
    .p1{
        top: 70px;
    }
    .p2{
        top: 145px;
    }
    .p3{
        top: 238px;
    }
    .p4{
        top: 365px;
    }
    .p5{
        top: 65px;
    }
    .p6{
        top: 20px;
    }
    .p7{
        top: 67px;
    }
}
.close{
    background-image: linear-gradient(225deg, #D1D1D1 0%, #898989 100%);
}
.open{
    background-image: linear-gradient(225deg, #4DA6FA 0%, #125A9E 100%);
}
.alert{
    background-image: linear-gradient(225deg, #FF8888 0%, #AE3535 100%);
}
.clear-margin >button{
    margin-top: 0;
}
</style>
