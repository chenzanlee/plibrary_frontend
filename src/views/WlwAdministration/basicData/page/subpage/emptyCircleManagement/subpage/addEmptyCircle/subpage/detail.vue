<template>
  <div class="home emptyCircleDetail">
    <!-- 头部导航 -->
    <general-form
      ref="delog"
      label-width="auto"
      :data="formInfo.data"
      :field-list="formInfo.fieldList"
      theme-type="default"
      @handleChange="handleChange"
      @cascaderEvent="cascaderEvent"
    />
    <div style="display: flex">
      <div style="margin-bottom: 10px;width: 20%;">
        <button class="btn-blue back" @click="goBack()"><i class="iconfont">&#xe61d;</i>返回列表</button>
        <button v-if="btnName === 'add' && type !== 'see'" class="btn-blue updateBtn" @click="submit()">保 存</button>
        <button v-if="btnName === 'update' && type !== 'see'" class="btn-blue updateBtn" @click="submit()">更 新</button>
      </div>
      <div style="width: 22%;line-height: 36px">
        <span class="no_circle_number">空圈号</span>
        <span>
          <el-checkbox-group v-model="allCheck" style="display: inherit;margin-right: 20px;" @change="onCheckAllChange">
            <el-checkbox label="全选" />
          </el-checkbox-group>
        </span>
        <span>
          <el-checkbox-group v-model="reverseCheck" style="display: inherit" @change="reverseCheckChange">
            <el-checkbox label="反选" />
          </el-checkbox-group>
        </span>
      </div>
      <div style="line-height: 38px;">
        <el-checkbox-group v-model="allCheck" @change="onCheckAllChange">
          <el-checkbox label="是否全部空圈" />
        </el-checkbox-group>
      </div>
    </div>
    <div v-show="item.length === 0" class="no-data-img"><img :src="noData | noDataFile('noData', 'svg')"></div>
    <div v-if="item.length > 0" v-loading="isLoading" style="display:flex">
      <el-scrollbar>
        <div class="radio">
          <el-button
            v-for="(j, k) in item"
            :key="k"
            :class="{ active: currentSort.includes(j.name)}"
            @click="active(j, k)"
          >
            {{ j.name }}</el-button>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import generalForm from '@/components/commonComponent/generalForm'
import { wlwJsonh2Tree } from '@/components/tree/evcJsonh2Tree.js'
import { getConfigElement } from '@/utils/overtService'
import { httpRequest } from '@/http/dispatch'
const dataInterfacePageElement = getConfigElement('emptyStyManage')
export default {
  components: {
    generalForm
  },
  data() {
    return {
      reverseCheck: false,
      allCheck: false,
      btnName: 'add',
      routeParams: this.$route.params.rowData || '',
      type: this.$route.params.type || '',
      item: [],
      currentSort: [],
      nameList: [],
      cascaderIdList: [],
      navformDisabled: false,
      isLoading: false,
      buttonLoading: false,
      status: 0, // 0=>查看 1=>xinzeng  2=>修改
      formInfo: {
        data: {
          area: ''
        },
        fieldList: [
          {
            span: 8,
            key: 'area',
            type: 'cascader',
            customLabel: 'title',
            customValue: 'value',
            className: 'shadow',
            placeholder: '大区 / 区域 / 场区 / 工段 / 单元',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请选择地区', trigger: 'change' }
            ],
            options: []
          },
          {
            span: 8,
            type: 'button',
            name: '查询',
            disabled: false,
            className: 'btn-blue padding1120',
            handleClick: () => {
              this.getStyAmount()
            }
          }
        ]
      }
    }
  },
  watch: {},
  async created() {
    await this.getTree()
    // await this.getMyEvcMcuInfo()
  },
  mounted() {
    console.log(2222, this.$route)
    if (this.$route.params.rowData) {
      const data = this.$route.params.rowData
      this.formInfo.data.area = [data.regionId, data.areaId, data.fieldId, data.segmentId, data.unitId]
      this.cascaderIdList = [data.regionId, data.areaId, data.fieldId, data.segmentId, data.unitId]
      this.nameList = [data.regionName, data.areaName, data.fieldName, data.segmentName, data.unitName]
      if (this.$route.params.type === 'edit') {
        this.btnName = 'update'
        this.formInfo.fieldList[0].disabled = true
        this.formInfo.fieldList[1].disabled = true
      }
      if (this.$route.params.type === 'add') {
        this.btnName = 'add'
        this.formInfo.fieldList[0].disabled = false
        this.formInfo.fieldList[1].disabled = false
      }
      if (this.$route.params.type === 'see') {
        this.btnName = 'see'
        this.formInfo.fieldList[0].disabled = true
        this.formInfo.fieldList[1].disabled = true
      }
      this.getStyAmount()
      console.log(this.formInfo.data.area)
      console.log(this.formInfo.fieldList[0].options)
    }
  },
  methods: {
    cascaderEvent(val, val1, val2) {
      console.log(val)
      console.log(val1)
      console.log(val2)
      this.cascaderIdList = val
      this.nameList = val1
    },
    handleChange() {},
    // 获取区域联动数据
    getTree() {
      httpRequest({
        type: 'get',
        uri: '/wlw/myBaseInfo/getTreeForDataAuthV2',
        payload: '',
        callback: (res) => {
          if (res && res.status === 200) {
            const arr = wlwJsonh2Tree(res.data)
            console.log(arr)
            this.formInfo.fieldList[0].options = arr
            console.log(this.formInfo.fieldList[0].options)
          }
        }
      })
    },
    // 获取栏位总数
    getStyAmount() {
      this.isLoading = true
      let unitID = ''
      if (this.$route.params.rowData) {
        unitID = this.$route.params.rowData.unitId
      } else {
        unitID = this.cascaderIdList[5] ? this.cascaderIdList[5] : this.cascaderIdList[4]
      }
      const obj = {
        unitId: unitID
      }
      const arr = []
      this.currentSort = []
      httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getStyAmount && dataInterfacePageElement.getStyAmount.uri,
        payload: obj,
        callback: (res) => {
          this.isLoading = false
          if (res.status === 200 && res.rel) {
            for (let i = 1; i <= res.data; i++) {
              arr.push(
                { name: i, val: i }
              )
              this.item = arr
            }
            if (this.$route.params.rowData.emptySty && this.item.length > 0) {
              const str = this.$route.params.rowData.emptySty.split(',')
              console.log(str)
              arr.map((res, i) => {
                str.map(item => {
                  if (Number(item) === res.name) {
                    this.currentSort.push(res.name)
                  }
                })
              })
            }
          }
          if (this.$route.params && this.$route.params.rowData && this.$route.params.rowData.isEmptyUnit && this.$route.params.rowData.isEmptyUnit === 1) {
            this.item.map((res, i) => {
              this.currentSort.push(res.name)
            })
            this.allCheck = true
          }
        }
      })
    },
    // 获取表单信息
    getMyEvcMcuInfo() {
      this.isLoading = true
      const obj = {
        unitId: this.cascaderIdList[5] ? this.cascaderIdList[5] : this.cascaderIdList[4]
      }
      httpRequest({
        type: 'get',
        uri: dataInterfacePageElement.getPageList && dataInterfacePageElement.getPageList.uri,
        payload: this.handleObj(obj),
        callback: (res) => {
          this.isLoading = false
          if (res && res.status === 200) {
            const arr = res.data.rows
            this.tableData = arr || []
            this.pagination.total = res.data.total
          }
        }
      })
    },
    // 保存 & 更新
    submit() {
      this.isLoading = true
      let sty = ''
      sty = this.currentSort.join(',')
      // if (this.allCheck === true) {
      //   sty = ''
      // } else {
      //   sty = this.currentSort.join(',')
      // }
      const obj = {
        regionId: this.formInfo.data.area[0],
        regionName: this.nameList[0],
        areaId: this.formInfo.data.area[1],
        areaName: this.nameList[1],
        fieldId: this.formInfo.data.area[2],
        fieldName: this.nameList[2],
        isEmptyUnit: this.allCheck === true ? 1 : 0,
        emptySty: sty,
        segmentId: this.formInfo.data.area[5] ? this.formInfo.data.area[4] : this.formInfo.data.area[3],
        segmentName: this.nameList[5] ? this.nameList[4] : this.nameList[3],
        unitId: this.formInfo.data.area[5] ? this.formInfo.data.area[5] : this.formInfo.data.area[4],
        unitName: this.nameList[5] ? this.nameList[5] : this.nameList[4]
      }
      if (this.btnName === 'update') {
        obj.id = this.$route.params.rowData.id
        this.$httpRequest({
          type: 'put',
          uri: dataInterfacePageElement.update && dataInterfacePageElement.update.uri,
          payload: obj,
          callback: (res) => {
            this.isLoading = false
            if (res && res.status === 200 && res.rel) {
              this.$message.success('更新成功')
              // this.getStyAmount()
            }
          }
        })
      } else {
        this.$httpRequest({
          type: 'post',
          uri: dataInterfacePageElement.add && dataInterfacePageElement.add.uri,
          payload: this.handleObj(obj),
          callback: (res) => {
            this.isLoading = false
            if (res && res.status === 200 && res.rel) {
              this.$message.success('保存成功')
              // this.getStyAmount()
              // this.getMyEvcMcuInfo()
            }
          }
        })
      }
    },
    // 处理对象 删除值为''字段 返回对象
    handleObj(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          delete obj[key]
        }
      }
      return obj
    },
    // 空圈点击事件
    active(item, index) {
      console.log('点击事件', item, index)
      this.currentSort.push(item.name)
      this.GetArrayMost(this.currentSort)
      if (this.GetArrayMost(this.currentSort)[1] > 1 && this.currentSort.includes(item.name)) {
        this.currentSort = this.currentSort.filter(res => res !== item.name)
      }
      if (this.currentSort.length === this.item.length) {
        this.allCheck = true
      } else {
        [
          this.allCheck = false
        ]
      }
    },
    // key是数据，value是出现的次数
    GetArrayMost(arr) {
      var arrMap = new Map()
      var key = arr[0]
      var value = 1
      arr.forEach((item, index) => {
        if (arrMap.get(item) !== undefined) {
          let num = arrMap.get(item)
          arrMap.set(item, ++num)
        } else {
          arrMap.set(item, 1)
        }
        if (arrMap.get(item) > value) {
          key = item
          value = arrMap.get(item)
        }
      })
      return [key, value]
    },
    // 全选change 事件
    onCheckAllChange() {
      this.currentSort = []
      if (this.allCheck === false) {
        this.reverseCheck = false
        this.currentSort = []
      } else {
        this.item.map((res, i) => {
          this.currentSort.push(res.name)
        })
      }
    },
    // 反选change 事件
    reverseCheckChange() {
      // if (this.reverseCheck === true) {
      //   if (this.allCheck === true) {
      //     this.currentSort = []
      //     this.allCheck = false
      //   }
      //   if (this.allCheck === false && this.currentSort.length > 0) {
      //     const arr = []
      //     this.item.filter((x) => {
      //       if (this.currentSort.indexOf(x.name) < 0) {
      //         arr.push(x.name)
      //       }
      //     })
      //     console.log(arr)
      //     this.currentSort = arr
      //   }
      //   if (this.allCheck === false && this.currentSort.length === 0) {
      //     this.item.map((res, i) => {
      //       this.currentSort.push(res.name)
      //     })
      //     this.allCheck = true
      //   }
      // } else {
      //   if (this.allCheck === true) {
      //     this.currentSort = []
      //     this.allCheck = false
      //   }
      //   const arr = []
      //   this.item.filter((x) => {
      //     if (this.currentSort.indexOf(x.name) < 0) {
      //       arr.push(x.name)
      //     }
      //   })
      //   console.log(arr)
      //   this.currentSort = arr
      // }

      const old_arr = JSON.parse(JSON.stringify(this.currentSort))
      const arr = []
      for (const i of this.item) {
        if (old_arr.indexOf(i.val) === -1) {
          arr.push(i.val)
        }
      }
      if (arr.length === this.item.length) {
        this.allCheck = true
      } else {
        this.allCheck = false
      }
      this.currentSort = arr
    },
    goBack() {
      window.history.go(-1)
    }
  }
}
</script>
<style lang="scss">
  .emptyCircleDetail{
    .no_circle_number{
      margin-right: 20px;
      // color: #fff;
      @include font_color('spFontColor4');
      font-size: 14px;
    }
    .back{
      padding: 8px 10px 9px 5px  !important;
      margin-right: 10px;
      font-size: 14px;
      i{
        position: relative;
        top: 1px;
      }
    }
    .updateBtn{
      width: 68px;
      padding: 8px 9px 9px 9px  !important;
      margin: 0 0 10px;
      font-size: 14px;
    }
    .padding1120 button{
      padding: 11px 20px;
    }
    .el-form-item__content{
        margin-right: 10px !important;
    }
    .el-form-item__label{
        font-size: 14px
    }
    .el-scrollbar__wrap {
        margin-bottom: 0 !important;
        margin-right: 0 !important;
    }
    .radio {
        display: inherit;
        justify-content: end;
        button[type='button'] {
            padding: 3px 7px;
            font-size: 12px;
            background: transparent;
            @include background_color('wlwBackGroundColor2');
            border: 1px solid #42548b;
            @include border_color('wlwBorderColor2');
            // color: #fff;
            @include font_color('wlwFontColor1');
            height: 35px;
            margin-bottom: 10px;
            width: 80px;
            margin-right: 10px;
        }
        button.active[type='button'] {
            color: #fff;
            background: rgba(9, 30, 64, 0);
            border: 1px solid #20a4fc!important;
            box-shadow: inset 0 0 20px 0 #217bfc;
            @include box_shadow('wlwBoxShadow');
        }
        .el-button+.el-button{
            margin-left: 0
        }
    }
    .el-checkbox__label{
        // color: #fff;
        @include font_color('spFontColor4');
        font-size: 14px;
    }
    .no-data-img img{
      margin: 8% auto;
      max-width: 300px;
    }
  }
</style>
