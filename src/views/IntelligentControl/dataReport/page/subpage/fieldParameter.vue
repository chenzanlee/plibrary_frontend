<template>
  <div class="onLine-back">
    <searchForm
      ref="navForm"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    />
    <mychartCircle ref="mychartCircle" :json="navFormInfo.data" />
  </div>
</template>
<script>
import searchForm from '@/components/commonComponent/navForm'
import mychartCircle from '../../components/fieldParameter/index'
// import {
//   treeForRegionArea
// }
//   from '@/http/api/exportData/fieldParams.js'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('unit-evcDataInterface')
// unit-evcDataInterface:getRegionAreaFieldTree
export default {
  components: {
    searchForm,
    mychartCircle
  },
  data() {
    return {
      defaultValue: [], // 默认选中
      labelWidth: '100%',
      navFormInfo: {
        data: {
          area: '', // 五级联动
          time: ['TODAY'] // 日期时间选择器
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'area',
                type: 'cascader',
                customLabel: 'title',
                customValue: 'value',
                className: 'shadow',
                checkStrictly: true,
                clearable: 'clearable',
                placeholder: '大区 / 区域 / 场区',
                options: [
                ]
              },

              {
                key: 'time',
                type: 'cascader',
                className: 'shadow',
                clearable: 'clearable',
                placeholder: '时间范围',
                options: [
                  {
                    label: '今天',
                    value: 'TODAY'
                  },
                  {
                    label: '本周',
                    value: 'THIS_WEEK'
                  },
                  {
                    label: '本月',
                    value: 'THIS_MONTH'
                  },
                  {
                    label: '一个月内',
                    value: 'LAST_ONE_MONTH'
                  },
                  {
                    label: '三个月内',
                    value: 'LAST_THREE_MONTH'
                  },
                  {
                    label: '六个月内',
                    value: 'LAST_SIX_MONTH'
                  },
                  {
                    label: '九个月内',
                    value: 'LAST_NINE_MONTH'
                  },
                  {
                    label: '一年内',
                    value: 'LAST_TWELVE_MONTH'
                  }
                ]
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.$refs.mychartCircle.setEcharts()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.$refs.mychartCircle.setEcharts()
                }
              }
            ]
          },
          right: {

          }
        }
      }

    }
  },
  mounted() {

  },
  created() {
    this.setOption()
  },
  methods: {
    // 默认值递归
    defaultValueMe(arr) {
      if (!arr) {
        return
      }
      this.defaultValue.push(arr[0].regionNum)
      if (arr[0].children) {
        this.defaultValueMe(arr[0].children)
      }
    },
    async setOption() {
      this.$httpRequest({
        type: 'GET',
        payload: { isBuilding: false },
        uri: pageElement && pageElement.getRegionAreaFieldTree && pageElement.getRegionAreaFieldTree.uri,
        callback: data => {
          if (data.status === 200 && data.rel) {
            this.navFormInfo.fieldList.left.inpLists[0].options = data.data
            this.$refs.mychartCircle.setEcharts()
          }
        }
      })
    }
  }
}
</script>
<style lang="css" scoped>
.formPosition {
  width: 50%;
  position: fixed;
  right: 0;
  top: 80px;
}
.onlineMess {
  width: 100%;
  height: 80px;
  display: flex;
  margin-bottom: 20px;
}
.onlineMessDiv {
  width: 185px;
  height: 100%;
  border-radius: 4px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.onlineMessDiv:nth-of-type(1) {
  background-image: linear-gradient(46deg, #ff7134 0%, #ff5988 100%);
}
.onlineMessDiv:nth-of-type(2) {
  background-image: linear-gradient(46deg, #cb63d3 0%, #1c6df8 100%);
}
.onlineMessDiv:nth-of-type(3) {
  background-image: linear-gradient(46deg, #619aff 0%, #c346ff 100%);
}
.onlineMessDiv:nth-of-type(4) {
  background-image: linear-gradient(46deg, #15e0f8 0%, #007ef9 100%);
}
.icon {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}
.onlineMess-number {
  width: 60px;
  display: flex;
  flex-direction: column;
  height: 40px;
  justify-content: space-between;
  align-items: flex-start;
  color: #fff;
}
.onlineMess-number > span:nth-child(1) {
  font-size: 20px;
}
.onlineMess-number > span:nth-child(2) {
  font-size: 12px;
}
.onLine-back {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* border-top: 1px solid #313c82; */
  /* padding-bottom: 10px; */
  box-sizing: border-box;
}
</style>
