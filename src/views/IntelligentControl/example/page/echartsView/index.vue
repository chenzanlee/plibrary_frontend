<template>
  <div class="box">
    <div>
      <nav-form class="nav-form" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    </div>

    <div class="echatrsCon">
      <div class="echatrsLeft">
        <div class="eacharts_one_left Highlight">
          <p class="title">存栏量</p>
          <div ref="myEchartOne" class="chart" />
        </div>
        <div class="eacharts_one_left Highlight">
          <p class="title">异常分布</p>
          <div ref="myEchartTwo" class="chart" />
        </div>
        <div class="eacharts_one_left Highlight">
          <p class="title">每周排名</p>
          <div ref="myEchartThree" class="chart" />
        </div>
      </div>
      <div class="echatrsMiddle">
        <div class="echatrsMiddleTop Highlight">
          <div class="nav-form">
            <nav-form
              :class="navFormInfoTwo.data.default"
              :data="navFormInfoTwo.data"
              :field-list="navFormInfoTwo.fieldList"
            />
          </div>
          <div class="flexbg">
            <div ref="myEchartFour" class="myEchartFour" />
          </div>
        </div>
        <div class="echatrsMiddleBottom Highlight">
          <div class="nav-form">
            <nav-form
              :class="navFormInfoTwo.data.default"
              :data="navFormInfoTwo.data"
              :field-list="navFormInfoTwo.fieldList"
            />
          </div>
          <div class="flexbg">
            <div ref="myEchartFive" class="myEchartFour" />
          </div>
        </div>
      </div>
      <div class="echatrsRight Highlight">
        <div v-for="(item,index) in pigName" :key="index" class="numItem">
          <p class="title">{{ item }}</p>
          <div class="space">
            <p>每周累计</p>
            <p>0头</p>
          </div>
          <div class="space">
            <p>当日累计</p>
            <p>0头</p>
          </div>
          <div class="space">
            <p>当月累计</p>
            <p>0头</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navForm from '@/components/commonComponent/navForm'
// import echarts from 'echarts'
export default {
  components: {
    navForm
  },
  data() {
    return {
      navFormInfoTwo: {
        data: {
          num: '',
          default: 'default'
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'cascader',
                type: 'cascader',
                className: 'shadow',
                placeholder: '工段',
                options: [],
                width: '140px'
              },
              {
                key: 'cascader',
                type: 'cascader',
                className: 'shadow',
                placeholder: '单元',
                options: [],
                width: '140px'
              },
              {
                className: 'shadow',
                key: 'num',
                type: 'date',
                dateType: 'daterange',
                rangeSeparator: '~',
                startPlaceholder: '请选择开始时间',
                endPlaceholder: '请选择结束时间'
                // width: '300px'
              }
            ]
          }
        }
      },
      navFormInfo: {
        data: {},
        fieldList: {
          left: {
            inpLists: [
              {
                value: 'cascader',
                type: 'cascader',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                width: '370px',
                options: [
                  {
                    value: 'zhinan',
                    label: '指南',
                    children: [
                      {
                        value: 'shejiyuanze',
                        label: '设计原则',
                        children: [
                          {
                            value: 'yizhi',
                            label: '一致'
                          }
                        ]
                      },
                      {
                        value: 'daohang',
                        label: '导航',
                        children: [
                          {
                            value: 'cexiangdaohang',
                            label: '侧向导航'
                          },
                          {
                            value: 'dingbudaohang',
                            label: '顶部导航'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    value: 'ziyuan',
                    label: '资源',
                    children: [
                      {
                        value: 'axure',
                        label: 'Axure Components'
                      },
                      {
                        value: 'sketch',
                        label: 'Sketch Templates'
                      },
                      {
                        value: 'jiaohu',
                        label: '组件交互文档'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      echartsOptiosn: {
        myEchartOneOption: {
          tooltip: {
            formatter: ' {b}:<br/> ({d}%)'
          },
          color: ['#256af6', '#5dbb92'],
          legend: {
            orient: 'horizontal',
            bottom: '20',
            data: ['保育', '育肥'],
            textStyle: {
              color: '#CDD8F7'
            }
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '40%'],
              data: [
                { value: 335, name: '保育' },
                { value: 310, name: '育肥' }
              ]
            }
          ]
        },
        myEchartTwoOption: {
          color: ['#256af6', '#5dbb92', '#d5ab3d', '#da6c59', '#73b5d5'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              labelLine: {
                show: true
              },
              center: ['50%', '40%'],
              data: [
                { value: 335, name: '猪群扎堆' },
                { value: 310, name: '体表异常' },
                { value: 234, name: '发烧猪' },
                { value: 135, name: '咳嗽' },
                { value: 1548, name: '料槽检测' }
              ]
            }
          ]
        },
        myEchartThreeOption: {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            top: '13%',
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },

          xAxis: [
            {
              type: 'category',
              data: [
                '猪群扎堆',
                '料槽检测',
                '体表异常',
                '发烧猪识别',
                '咳嗽次数'
              ],
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                color: '#fff',
                rotate: -25
              },
              axisLine: {
                lineStyle: {
                  color: '#2c3666'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: false
              },
              axisLabel: {
                color: '#fff'
              },
              axisLine: {
                lineStyle: {
                  color: '#2c3666'
                }
              }
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390],
              // barWidth: 15,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                  ])
                }
              }
            }
          ]
        },
        myEchartFourOption: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center'
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: ['2012', '2013', '2014', '2015', '2016'],
              splitLine: {
                show: false
              },
              axisLabel: {
                color: '#fff'
              },
              axisLine: {
                lineStyle: {
                  color: '#2c3666'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: false
              },
              axisLabel: {
                color: '#fff'
              },
              axisLine: {
                lineStyle: {
                  color: '#2c3666'
                }
              }
            }
          ],
          series: [
            {
              name: 'Forest',
              type: 'bar',
              barGap: 0,
              data: [320, 332, 301, 334, 390],
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                  ])
                }
              }
            },
            {
              name: 'Steppe',
              type: 'bar',
              data: [220, 182, 191, 234, 290],
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#F6BE14' },
                    { offset: 1, color: '#F6BE14' }
                  ])
                }
              }
            },
            {
              name: 'Desert',
              type: 'bar',
              barWidth: 15,
              data: [150, 232, 201, 154, 190],
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#E96452' },
                    { offset: 1, color: '#7C2317' }
                  ])
                }
              }
            },
            {
              name: 'Wetland',
              type: 'bar',
              barGap: '20%',
              data: [98, 77, 101, 99, 90],
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#16E5EE' },
                    { offset: 1, color: '#0B767B' }
                  ])
                }
              }
            },
            {
              name: 'shtrr',
              type: 'bar',
              data: [18, 77, 101, 79, 120],
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#A15DD1' },
                    { offset: 1, color: '#62268C' }
                  ])
                }
              }
            }
          ]
        },
        myEchartFiveOption: {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#fff'
            },
            axisLine: {
              lineStyle: {
                color: '#2c3666'
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#fff'
            },
            axisLine: {
              lineStyle: {
                color: '#2c3666'
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#223d71'
              }
            }
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#223d71' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#223d71' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              },
              smooth: true,
              lineStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#22c4b9' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#25abce' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            }
          ]
        }
      },
      pigName: ['猪群扎堆', '料槽检测', '体表异常', '发烧猪识别', '咳嗽次数']
    }
  },
  mounted() {
    this.creatMyEchartOne()
  },
  methods: {
    creatMyEchartOne() {
      const myChart = this.$echarts.init(this.$refs.myEchartOne)
      myChart.setOption(this.echartsOptiosn.myEchartOneOption)

      const myEchartTwo = this.$echarts.init(this.$refs.myEchartTwo)
      myEchartTwo.setOption(this.echartsOptiosn.myEchartTwoOption)

      const myEchartThree = this.$echarts.init(this.$refs.myEchartThree)
      myEchartThree.setOption(this.echartsOptiosn.myEchartThreeOption)

      const myEchartFour = this.$echarts.init(this.$refs.myEchartFour)
      myEchartFour.setOption(this.echartsOptiosn.myEchartFourOption)

      const myEchartFive = this.$echarts.init(this.$refs.myEchartFive)
      myEchartFive.setOption(this.echartsOptiosn.myEchartFiveOption)
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  .nav-form {
    width: 370px;
  }
  .echatrsCon {
    display: flex;
    margin-top: 20px;
  }
  .echatrsLeft {
    width: 370px;
    .eacharts_one_left {
      height: 300px;
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        color: #cdd8f7;
        letter-spacing: 0;
        margin: 20px 0 0 20px;
      }
      .chart {
        width: 350px;
        height: 250px;
      }
    }
  }
  .echatrsMiddle {
    width: 1000px;
    margin: 0 20px;
    .echatrsMiddleTop {
      height: 460px;
    }
    .echatrsMiddleBottom {
      height: 460px;
      margin-top: 20px;
    }
  }
  .echatrsRight {
    width: 210px;
    height: 940px;
  }
}
.nav-form .el-input__count,
.el-picker-panel,
.el-range-input {
  background: #00113a !important;
}
.flexbg {
  .myEchartFour {
    height: 420px;
    width: 100%;
  }
}
.numItem {
  width: 120px;
  margin:30px auto 0 auto;
  padding-bottom: 20px;
  border-bottom:1px solid #313C82;
  .space {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #cdd8f7;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .title {
    font-size: 14px;
    color: #10aeff;
    margin-bottom: 15px;
  }
}
</style>
