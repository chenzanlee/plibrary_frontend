<template>
  <div class="firmware-dis-wrap">
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList">
      <span slot="right" :authCode="'fieldAlarmLogs:export'" @click="exportData()">
        <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
          <img src="@/assets/image/export.png">
        </el-tooltip> -->
        <el-button class="btn-blue">
          <svg-icon icon-class="newExport" />
          导出
        </el-button>
      </span>
    </nav-form>
    <div v-loading="isLoading" class="content-container Highlight">
      <section v-if="tableData.length > 0" style="height: calc(100vh - 200px);" class="content-box">
        <div ref="firmware" class="chart" />
        <div ref="contentInsert" class="content-insert" @scroll="scrollHandle">
          <div :class="['header-wrap',isScroTop ? 'p-fix': '']">
            <span class="header">版本号</span>
            <span class="header">设备数</span>
            <span class="header">占比</span>
          </div>
          <div v-for="(data, i) in tableData" :key="i">
            <span class="small-con" :title="data.firmwareVersion || '--'">{{ data.firmwareVersion || '--' }}</span>
            <span class="small-con" :title="data.deviceNum || '--'">{{ data.deviceNum || '--' }}</span>
            <span class="small-con" :title="Number(data.proportion).toFixed(2) + '%'|| '--'">{{ Number(data.proportion).toFixed(2) + '%'|| '--' }}</span>
          </div>
        </div>
      </section>
      <section
        v-else
        style="display:flex;justify-content: center; align-items: center;width: 100%;height: calc(100vh - 200px);"
      >
        <img style="max-width:300px" :src="noData | noDataFile('noData', 'svg')" alt="">
      </section>
    </div>
  </div>
</template>
<script>
// import noData from '@/assets/image/page/noData.png'
import navForm from '@/components/commonComponent/navForm/index.vue'
import { derive } from '@/http/api/exportData/export'
// import { getListDataForTree } from '@/http/api/pollingBaseInfo/public.js'
import { getConfigElement } from '@/utils/overtService'
let message = null
const pageElement = getConfigElement('equipmentFirmvareVersionOverview')
// import { postAPI } from '@/http/api/commonApi.js'
export default {
  components: {
    navForm
  },
  data() {
    message = this.$message
    return {
      isScroTop: false,
      noData: '',
      isLoading: false,
      tableData: [],
      options: {
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      navFormInfo: {
        data: {
          field: [],
          regionId: '',
          areaId: '',
          fieldId: '',
          equiptypeId: '',
          onlineStatus: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'field',
                type: 'cascader',
                customLabel: 'regionName',
                customValue: 'regionNum',
                checkStrictly: true,
                className: 'shadow areaCont',
                placeholder: '大区 / 区域 / 场区',
                options: []
              },
              {
                key: 'equiptypeId',
                type: 'select',
                clearable: true,
                filterable: true,
                className: 'shadow',
                placeholder: '设备类型',
                props: {
                  label: 'equiptype_name',
                  value: 'id'
                },
                list: [],
                handleChange: (value) => {
                }
              },
              {
                key: 'onlineStatus',
                type: 'select',
                clearable: true,
                filterable: true,
                className: 'shadow',
                placeholder: '设备状态',
                props: {
                  label: 'label',
                  value: 'value'
                },
                list: [
                  {
                    label: '在线',
                    value: 1
                  },
                  {
                    label: '离线',
                    value: 0
                  }
                ],
                handleChange: (value) => {
                }
              }
            ]
          },
          right: {
            btnLists: [
              {
                type: 'button',
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.searchHandle()
                }
              },
              {
                type: 'button',
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.resetHandle()
                }
              }
            ]
          }
        }
      },
      option: {
        color: ['#E45353', '#A700FF', '#006AFF', '#27BF8F', '#FFBC05', '#FA7107'],
        title: {
          text: '固件版本分布',
          left: 'center',
          top: 10,
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          top: 50,
          itemGap: 40,
          data: [],
          textStyle: {
            color: []
          },
          type: 'scroll'
        },
        series: [
          {
            name: '固件版本',
            type: 'pie',
            radius: ['32%', '80%'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: true
            },
            data: [
            ]
          }
        ]
      },
      columns: [
        {
          prop: 'firmwareVersion',
          label: '版本号'
        },
        {
          prop: 'deviceNum',
          label: '设备数',
          longData: true
        },
        {
          prop: 'proportion',
          label: '占比'
        }
      ]
    }
  },
  computed: {
    listParams() {
      const { equiptypeId, field, onlineStatus } = this.navFormInfo.data
      const params = {
        regionId: field[0] || '',
        areaId: field[1] || '',
        fieldId: field[2] || '',
        equipemntTypeId: equiptypeId,
        onlineStatus: onlineStatus
      }
      Object.keys(params).forEach(k => {
        if (params[k] === '') {
          delete params[k]
        }
      })
      return params
    },
    allStyles() {
      return this.$store.state.echartStyle.allStyles
    }
  },
  watch: {
    'allStyles.flag'(newValue, oldValue) {
      if (this.tableData.length > 0) {
        this.getOptions() // 自己绘制echarts的方法
      }
    }
  },
  created() {
    // this.initUrl()
  },
  mounted() {
    this.pageElement = getConfigElement('equipmentFirmvareVersionOverview')
    this.commonElement = getConfigElement('wlwDataInterface')
    this.getTypeList()
    this.getTreeAPI()
  },
  methods: {
    initUrl() {
      // eslint-disable-next-line no-irregular-whitespace
      this.noData = this.$getImgUrl('noData', 'svg')
    },
    scrollHandle(e) {
      const top = this.$refs.contentInsert.scrollTop
      this.isScroTop = false
      if (top > 80) {
        this.isScroTop = true
      }
    },
    // 导出
    exportData() {
      const obj = {
        regionId: this.navFormInfo.data.regionId || '',
        areaId: this.navFormInfo.data.areaId || '',
        fieldId: this.navFormInfo.data.fieldId || '',
        equipemntTypeId: this.navFormInfo.data.equipemntTypeId || '',
        onlineStatus: this.navFormInfo.data.onlineStatus

      }
      const element = this.pageElement['exportEquipFirmvareVersionStats']
      derive('/api' + element.uri, obj)
      // obj['token'] = localStorage.getItem('MY-Admin-Token')
      // derive('/api/bar_patrol/myBpSymptomMarkers/export', obj)
      // this.$httpRequest({
      //   type: 'GET',
      //   uri: '/bar_patrol/myBpSymptomMarkers/export',
      //   payload: obj,
      //   callback: data => {
      //     console.log(data)
      //   }
      // })
    },
    getTreeAPI() {
      const pageElement = getConfigElement('wlwDataInterface')
      this.$httpRequest({
        type: 'POST',
        payload: {},
        uri: pageElement && pageElement.treeForSelectV1 && pageElement.treeForSelectV1.uri,
        callback: (res) => {
          if (res.status === 200) {
            this.navFormInfo.fieldList.left.inpLists[0].options = res.data
          }
        }
      })
    },
    resetHandle() {
      this.navFormInfo.data = {
        field: [],
        equiptypeId: '',
        onlineStatus: ''
      }
      this.tableData = []
      this.getOptions()
    },
    searchHandle() {
      this.tableData = []
      const { equiptypeId } = this.navFormInfo.data
      if (!equiptypeId) {
        return message.error('请选择设备类型再进行查询')
      }
      this.getTableData()
    },
    getOptions() {
      const data = this.tableData
      this.option.legend.data = []
      this.option.series[0].data = []
      let others = 0
      let deviceNum = 0
      data.forEach((d, i) => {
        const text = '固件版本 ' + (d.firmwareVersion || '--')
        if (i > 4) {
          others += d.proportion
          deviceNum += d.deviceNum
        } else {
          this.option.legend.data.push(text)
          this.option.series[0].data.push({
            name: text,
            value: d.proportion,
            tooltip: {
              trigger: 'item',
              formatter:
            `<span>设备数: ${d.deviceNum}</span><br />` +
            `<span>固件版本: ${d.firmwareVersion || '--'}</span><br />` +
            `<span>占比: ${Number(d.proportion).toFixed(2)}%</span>`
            }
          })
        }
      })
      if (data.length > 5) {
        this.option.legend.data.push('其他')
        this.option.series[0].data.push({
          name: '其他',
          value: others.toFixed(2),
          tooltip: {
            trigger: 'item',
            formatter:
            `<span>设备数: ${deviceNum}</span><br />` +
            `<span>固件版本: 其他</span><br />` +
            `<span>占比: ${Number(others.toFixed(2))}%</span>`
          }
        })
      }
      setTimeout(() => {
        this.$nextTick(() => {
          this.option.title.textStyle.color = this.allStyles.titleColor
          const myChart = this.$echarts.init(this.$refs.firmware)
          myChart.setOption(this.option)
        })
      }, 300)
    },
    getTableData() {
      this.isLoading = true
      this.$httpRequest({
        type: 'get',
        payload: this.listParams,
        uri: pageElement.getEquipVersionDistributedStats && pageElement.getEquipVersionDistributedStats.uri,
        callback: (res) => {
          this.isLoading = false
          if (res.status === 200) {
            this.tableData = res.data
            if (res.data.length) {
              this.getOptions()
            }
          }
        }
      })
    },
    getTypeList() {
      const pageElement = getConfigElement('myEquipmentType')
      this.$httpRequest({
        type: 'post',
        payload: {
          page: 1,
          limit: 10000
        },
        uri: pageElement.view_getPageList && pageElement.view_getPageList.uri,
        callback: (res) => {
          if (res && res.status === 200) {
            this.navFormInfo.fieldList.left.inpLists[1].list = res.data.rows
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.chart {
  width: 900px;
  height: 100%;
}
.header-wrap {
  background-color: rgb(34, 50, 130);
  @include background_color('wlwBackgroundColor3');
  border-radius: 3px;
  opacity: .9;
}
.p-fix {
  position: fixed;
}
.firmware-dis-wrap {
  .content-container {
    height: calc(100vh - 185px);
  }
  .content-box {
    display: flex;
    justify-content: space-between;
    .content-insert {
      max-height: 600px;
      overflow-y: scroll;
      text-align: center;
      .header {
        display: inline-block;
        width: 80px;
        font-size: 14px;
        color: #ffffff;
        @include font_color('wlwFontColor3');
        font-weight: 700;
        padding: 8px;
      }
      .small-con {
        display: inline-block;
        width: 80px;
        font-size: 12px;
        color: #ffffff;
        @include font_color('wlwFontColor3');
        padding: 8px;
        max-width: 80px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    }
  }
}
</style>
