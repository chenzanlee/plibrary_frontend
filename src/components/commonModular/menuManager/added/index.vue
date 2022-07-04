<template>
  <div class="dialog addDIalog" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div
      v-loading="loading"
      class="dialog-body Highlight"
    >
      <!-- 头部 -->
      <div class="dialog-head addedTitle">
        <span>{{ data.type === 'added' ? '新增' : '编辑' }}</span>
        <div class="dialog-head-close" @click="close"><i class="iconfont">&#xe61a;</i></div>
      </div>

      <!-- 内容 -->
      <div class="dialog-container">
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>编码</span>
          </div>
          <input v-model="codeValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入编码">
        </div>

        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>路由路径</span>
          </div>
          <input v-model="frontendRoutePathValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入编码">
        </div>

        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>标题</span>
          </div>
          <input v-model="titleValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入标题">
        </div>

        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>父级节点</span>
          </div>
          <div class="dialog-container-row-col">
            <input
              v-model="elementName"
              class="dialog-container-row-put inputStyle dialog-container-row-select"
              type="text"
              readonly="readonly"
              placeholder="请选择节点"
              @focus="putFocus(true, 'element')"
              @blur="putFocus(false, 'element')"
            >
            <ul v-show="elementStatus" class="overfolw">
              <li
                v-for="(i, index) in elementList"
                :key="index"
                @click="selectContent(i, 'element')"
              >{{ i.title }}</li>
            </ul>
            <i class="iconfont iconfont-direction1" :class="elementStatus ? 'iconfont-direction2' : ''">&#xe632;</i>
          </div>
        </div>
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span>图标</span>
          </div>
          <div class="dialog-container-row-col">
            <!-- <input v-model="iconValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入图标"> -->
            <input
              class="dialog-container-row-put inputStyle dialog-container-row-select"
              type="text"
              readonly="readonly"
              :placeholder="iconValue ? ' ' : '请选择图标'"
              @focus="putFocus(true, 'icon')"
              @blur="putFocus(false, 'icon')"
            >

            <!-- <i v-show="iconValue == 'lock'" class="iconfont dialog-container-row-select-icon">&#xe669;</i>
            <i v-show="iconValue == 'unlock'" class="iconfont dialog-container-row-select-icon">&#xe629;</i>

            <ul v-show="iconStatus">
              <li @click="selectContent('lock', 'icon')"><i class="iconfont">&#xe669;</i></li>
              <li @click="selectContent('unlock', 'icon')"><i class="iconfont">&#xe629;</i></li>
            </ul> -->
            <svg-icon v-show="iconValue == 'Map'" class="iconfont dialog-container-row-select-icon" icon-class="Map" />
            <svg-icon v-show="iconValue == 'Device-Preview'" class="iconfont dialog-container-row-select-icon" icon-class="Device-Preview" />
            <svg-icon v-show="iconValue == 'Information-Maintenance'" class="iconfont dialog-container-row-select-icon" icon-class="Information-Maintenance" />
            <svg-icon v-show="iconValue == 'EvcOperatorTable'" class="iconfont dialog-container-row-select-icon" icon-class="EvcOperatorTable" />
            <svg-icon v-show="iconValue == 'EvcLog'" class="iconfont dialog-container-row-select-icon" icon-class="EvcLog" />
            <svg-icon v-show="iconValue == 'Basic-Configuration'" class="iconfont dialog-container-row-select-icon" icon-class="Basic-Configuration" />
            <svg-icon v-show="iconValue == 'buildingArea'" class="iconfont dialog-container-row-select-icon" icon-class="buildingArea" />
            <svg-icon v-show="iconValue == 'areaAlarm'" class="iconfont dialog-container-row-select-icon" icon-class="areaAlarm" />
            <svg-icon v-show="iconValue == 'automaticDetection'" class="iconfont dialog-container-row-select-icon" icon-class="automaticDetection" />
            <svg-icon v-show="iconValue == 'sprayEquipment'" class="iconfont dialog-container-row-select-icon" icon-class="sprayEquipment" />
            <svg-icon v-show="iconValue == 'localRealTime'" class="iconfont dialog-container-row-select-icon" icon-class="localRealTime" />
            <svg-icon v-show="iconValue == 'unitPatrol'" class="iconfont dialog-container-row-select-icon" icon-class="unitPatrol" />
            <svg-icon v-show="iconValue == 'unitPatrolClient'" class="iconfont dialog-container-row-select-icon" icon-class="unitPatrolClient" />
            <svg-icon v-show="iconValue == 'patrolTask'" class="iconfont dialog-container-row-select-icon" icon-class="patrolTask" />
            <svg-icon v-show="iconValue == 'pigHealth'" class="iconfont dialog-container-row-select-icon" icon-class="pigHealth" />
            <svg-icon v-show="iconValue == 'menuSeat'" class="iconfont dialog-container-row-select-icon" icon-class="menuSeat" />

            <ul v-show="iconStatus" class="overfolw">
              <li @click="selectContent('Map', 'icon')"><svg-icon icon-class="Map" /></li>
              <li @click="selectContent('Device-Preview', 'icon')"><svg-icon icon-class="Device-Preview" /></li>
              <li @click="selectContent('Information-Maintenance', 'icon')"><svg-icon icon-class="Information-Maintenance" /></li>
              <li @click="selectContent('EvcOperatorTable', 'icon')"><svg-icon icon-class="EvcOperatorTable" /></li>
              <li @click="selectContent('EvcLog', 'icon')"><svg-icon icon-class="EvcLog" /></li>
              <li @click="selectContent('Basic-Configuration', 'icon')"><svg-icon icon-class="Basic-Configuration" /></li>
              <li @click="selectContent('buildingArea', 'icon')"><svg-icon icon-class="buildingArea" /></li>
              <li @click="selectContent('areaAlarm', 'icon')"><svg-icon icon-class="areaAlarm" /></li>
              <li @click="selectContent('automaticDetection', 'icon')"><svg-icon icon-class="automaticDetection" /></li>
              <li @click="selectContent('sprayEquipment', 'icon')"><svg-icon icon-class="sprayEquipment" /></li>
              <li @click="selectContent('localRealTime', 'icon')"><svg-icon icon-class="localRealTime" /></li>
              <li @click="selectContent('unitPatrol', 'icon')"><svg-icon icon-class="unitPatrol" /></li>
              <li @click="selectContent('unitPatrolClient', 'icon')"><svg-icon icon-class="unitPatrolClient" /></li>
              <li @click="selectContent('patrolTask', 'icon')"><svg-icon icon-class="patrolTask" /></li>
              <li @click="selectContent('pigHealth', 'icon')"><svg-icon icon-class="pigHealth" /></li>
              <li @click="selectContent('menuSeat', 'icon')"><svg-icon icon-class="menuSeat" /></li>
            </ul>
            <i class="iconfont iconfont-direction1" :class="iconStatus ? 'iconfont-direction2' : ''">&#xe632;</i>
          </div>
        </div>
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span><i class="dialog-container-row-sign">*</i>类型</span>
          </div>
          <div class="dialog-container-row-col">
            <input
              v-model="typeValue"
              class="dialog-container-row-put inputStyle dialog-container-row-select"
              type="text"
              readonly="readonly"
              placeholder="请选择类型"
              @focus="putFocus(true, 'type')"
              @blur="putFocus(false, 'type')"
            >
            <ul v-show="typeStatus">
              <li @click="selectContent('menu', 'type')">menu</li>
              <li @click="selectContent('dirt', 'type')">dirt</li>
              <li @click="selectContent('report', 'type')">report</li>
            </ul>
            <i class="iconfont iconfont-direction1" :class="typeStatus ? 'iconfont-direction2' : ''">&#xe632;</i>
          </div>
        </div>
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span>排序</span>
          </div>
          <input v-model="sortValue" class="dialog-container-row-put inputStyle" type="text" placeholder="请输入排序">
        </div>
        <div class="dialog-container-row">
          <div class="dialog-container-row-title">
            <span>描述</span>
          </div>
          <textarea v-model="descValue" class="dialog-container-row-put inputStyle dialog-container-row-text" type="text" placeholder="请输入描述" rows="3" />
        </div>
      </div>

      <!-- 底部 -->
      <div class="dialog-foot">
        <button-list
          :btn-list="btnList"
          @btn-added="confirm"
          @btn-edit="close"
        />
      </div>

    </div>
    <div class="dialog-close" @click="close" />

  </div>
</template>
<script>
import buttonList from '@/components/ElementComponent/button'

import {
  addMentList,
  editMentList
} from '@/http/api/menuInfo'

export default {
  components: {
    buttonList
  },
  data() {
    return {
      // 弹框动画
      dialogDtatus: true,
      upDate: true,
      btnList: [
        {
          name: '取消',
          class: 'btn-border',
          size: '90',
          event: 'edit'
        }, {
          name: '保存',
          class: 'btn-blue',
          size: '90',
          event: 'added'
        }
      ],
      // id
      id: '',
      // 编码
      codeValue: '',
      // 路由路径
      frontendRoutePathValue: '',
      // 标题
      titleValue: '',
      // 父级节点
      elementName: '',
      elementValue: '',
      elementStatus: false,
      elementList: [],
      elementClcikStatus: true,
      // 图标
      iconValue: '',
      iconName: '',
      iconStatus: false,
      // 类型
      typeValue: '',
      typeStatus: false,
      // 排序
      sortValue: '',
      // 描述
      descValue: '',
      // 延时器
      timeOuter: null,
      loading: false
    }
  },
  mounted() {
    if (this.upDate) {
      this.upDate = !this.upDate
      this.init()
    }
  },
  methods: {
    // 初始化数据
    init() {
      const parentList = JSON.parse(JSON.stringify(this.data.parentList))
      this.elementList = parentList
      if (this.data.type === 'added') {
        this.elementValue = this.data.adminMenuDetail
        this.elementName = this.data.adminMenuDetail.title
      }
      if (this.data.type === 'edit') {
        this.id = this.data.adminMenuDetail.id
        this.titleValue = this.data.adminMenuDetail.title

        this.codeValue = this.data.adminMenuDetail.code
        this.frontendRoutePathValue = this.data.adminMenuDetail.frontendRoutePath
        this.elementValue = this.data.adminMenuDetail
        this.iconValue = this.data.adminMenuDetail.icon
        this.typeValue = this.data.adminMenuDetail.type
        this.sortValue = this.data.adminMenuDetail.orderNum
        this.descValue = this.data.adminMenuDetail.description

        if (this.elementValue.parentId === 'muyuan_menu_root') {
          this.elementName = '牧原集团'
        } else {
          this.elementList.map(item => {
            if (item.id === this.elementValue.parentId) {
              this.elementName = item.title
            }
          })
        }
      }
    },
    // 提交
    async confirm() {
      // this.data.handleOk('test提交')
      if (!this.codeValue) { this.$message({ message: '请输入编码', type: 'error' }); return }
      // if (!this.frontendRoutePathValue) { this.$message({ message: '请输入路由路径', type: 'error' }); return }
      if (!this.titleValue) { this.$message({ message: '请输入标题', type: 'error' }); return }
      if (!this.elementValue) { this.$message({ message: '请输入父级节点', type: 'error' }); return }
      // if (!this.iconValue) { this.$message({ message: '请选择图标', type: 'error' }); return }
      if (!this.typeValue) { this.$message({ message: '请选择类型', type: 'error' }); return }

      if (this.data.type === 'added') {
        this.add()
      } else if (this.data.type === 'edit') {
        this.edit()
      }
    },
    // 新增
    async add() {
      this.loading = true
      const data = {
        appCode: this.elementValue.appCode,
        code: this.codeValue,
        frontendRoutePath: this.frontendRoutePathValue,
        description: this.descValue,
        icon: this.iconValue,
        orderNum: this.sortValue,
        parentId: this.elementValue.id,
        title: this.titleValue,
        type: this.typeValue
      }
      await addMentList(data).then((res) => {
        this.loading = false
        if (res && res.status === 200) {
          this.data.handleOk()
          this._close('submit')
          this.data.handleOk(res.data)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 编辑
    async edit() {
      this.loading = true
      const data = JSON.parse(JSON.stringify(this.data.adminMenuDetail))
      data.code = this.codeValue
      data.frontendRoutePath = this.frontendRoutePathValue
      data.title = this.titleValue
      data.icon = this.iconValue
      data.type = this.typeValue
      data.orderNum = this.sortValue
      data.description = this.descValue
      this.elementClcikStatus ? data.parentId = this.elementValue.parentId : data.parentId = this.elementValue.id

      await editMentList(data).then((res) => {
        this.loading = false
        if (res && res.status === 200) {
          this.$message.success('保存成功！')
          this.data.handleOk()
          this._close('submit')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 关闭
    close() {
      this.dialogDtatus = false
      setTimeout(() => { this._close(null) }, 300)
    },
    // 失焦
    putFocus(s, name) {
      clearTimeout(this.timeOuter)
      this.timeOuter = setTimeout(() => {
        if (name === 'element') {
          this.elementStatus = s
          this.iconStatus = false
          this.typeStatus = false
        } else if (name === 'icon') {
          this.iconStatus = s
          this.elementStatus = false
          this.typeStatus = false
        } else if (name === 'type') {
          this.typeStatus = s
          this.elementStatus = false
          this.iconStatus = false
        }
      }, 150)
    },
    // 选择下拉框
    selectContent(v, name) {
      if (name === 'element') { this.elementValue = v; this.elementName = v.title; this.elementClcikStatus = false } else if (name === 'icon') { this.iconValue = v } else if (name === 'type') { this.typeValue = v }
    }

  }
}
</script>
<style lang="scss">
.addDIalog{
  .inputStyle{
    @include font_color('formColor');
    @include background('formBackgroundColor');
    @include border_color('formBorderColor');
  }
  .inputStyle:hover, .inputStyle:focus{
    @include border_color('formBorderColor');
  }
}
</style>
<style lang="scss" scoped>
@import "@/style/_handle.scss";
.dialog-container::-webkit-scrollbar{
    display: none;
}
.formColor{
  @include font_color('addedTitle');
  @include border_bottom_color('formBorderColor')
}
.dialog-container{
    min-width: 550px;
    min-height: 200px;
    max-height: 70vh;
    overflow-x: auto;
    margin: 30px 30px 18px 30px;

    &-row{
        display: flex;
        margin-bottom: 12px;
        &-sign{
            position: absolute;
            color: #F56C6C;
            left: -10px;
        }
        &-title{
            // display: inline-block;
            width: 80px;
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 14px;
            // color: #ffffff;//#606266;
            @include font_color('dialog_container_rowtitle');
            // color: rgb(205, 216, 247);
            line-height: 40px;
            padding: 0 12px 0 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-weight: 600;
            span{
                position: relative;
            }
        }
        &-put{
            flex: 1;
            height: 36px;
            line-height: 36px;
            font-size: 12px;
        }
        &-col{
            flex: 1;
            position: relative;
            ul{
                list-style:none;
                border: 1px solid;
                @include font_color('addedTitle');
                @include border_color('dialog_container_colBorder');
                width: 100%;
                position: absolute;
                z-index: 999;
                max-height: 30vh;
                // background: #00113A;
                @include background('dialog_container_colBg');
                padding: 5px 0;
                overflow-x: auto;
                font-size: 12px;
                li{
                    padding: 0 15px;
                    height: 34px;
                    line-height: 34px;
                }
                li:hover{
                    @include background('dialog_container_LIhoverBG');
                    // background-color: var(--liBg);
                }
            }
        }
        &-select{
            width: 100%;
            position: relative;
            &-icon{
                position: absolute;
                top: 9px;
                left: 15px;
                @include font_color('addedTitle');
            }
        }
        &-text{
            height: 100px;
        }
    }
}
.iconfont-direction1{
    position: absolute;
    font-size: 14px;
    top: 11px;
    right:10px;
    transform:rotate(0deg);
    transition: all .3s;
    @include font_color('addedTitle');
}
.iconfont-direction2{
    transform:rotate(-180deg);
    transition: all .3s;
    @include font_color('addedTitle');
}

</style>
