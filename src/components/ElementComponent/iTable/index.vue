<template>
  <!--
  @file table封装
  @author author-name(孙亚飞 17600837372)
  -->
  <div class="table_page">
    <el-table
      ref="tables"
      v-loading="isLoading || false"
      element-loading-text="数据拼命加载中"
      :row-style="getRowClass"
      :header-cell-style="getRowClassHeader"
      :row-key="getRowKey"
      :data="dataSource"
      :max-height="height"
      :stripe="options.stripe || false"
      :row-class-name="tabRowClassName"
      :cell-style="cellStyle"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleRowDblclick"
      @cell-click="cellClick"
    >
      <template slot="empty" style="">
        <!-- <img src="@/assets/image/page/noData.png" alt="" style="margin-top:80px;"> -->
        <empty-interface />
      </template>
      <!--selection选择框-->
      <el-table-column
        v-if="options.mutiSelect || false"
        :fixed="options.firstFixed || false"
        type="selection"
        :reserve-selection="true"
        style="width:50px;backgroundcolor:red;"
        align="center"
      />
      <!--序号-->
      <el-table-column
        v-if="options.index || false"
        :fixed="options.indexFixed || false"
        label="序号"
        type="index"
        align="center"
        :index="indexMethod"
        min-width="50"
        class-name="number-index"
      />
      <!--数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          v-if="column.type === 'slotHeader'"
          :key="index"
          :align="column.align || 'left'"
          :width="column.width"
        >
          <template slot="header" slot-scope="scope">
            <RenderDom :row="scope.row" :index="index" :render="column.renderHeader" />
          </template>
          <!-- 含有render函数 且不长数据展示 v-else-if="column.render && !column.longData"-->
          <template slot-scope="scope">
            <RenderDom :row="scope.row" :index="index" :render="column.render" />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :render-header="labelHead"
          :prop="column.prop"
          :label="column.label"
          :align="column.align || 'left'"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
        >
          <template slot-scope="scope">
            <!--  含有click函数 -->
            <template v-if="column.onClick">
              <span
                @click.stop="column.onClick(scope.row, scope.$index, scope)"
              >{{ scope.row[column.prop] || '---' }}</span>
            </template>
            <template v-else-if="column.icon">
              <div style="display:flex;align-items:center;flex-direction:row;">
                <div v-for="(item,idx) in column.status" :key="idx" style="height:100%;width:auto;display:flex;align-items:center;">
                  <!-- <i v-if="scope.row[item.value]===column.rule.show" :class="item.icon" style="color:#178efe" /> -->
                  <img v-if="scope.row[item.value]===column.rule.show && item.icon === 'sms'" :src="noData | noDataFile('sms', 'svg')" style="margin-right:5px;">
                  <img v-if="scope.row[item.value]===column.rule.show && item.icon === 'wxWork'" :src="noData | noDataFile('wxWork', 'svg')" style="margin-right:5px;">
                  <img v-if="scope.row[item.value]===column.rule.show && item.icon === 'phone'" :src="noData | noDataFile('phone', 'svg')" style="margin-right:5px;">
                  <span v-if="scope.row[item.value]===column.rule.show" style="margin-right:20px;">{{ item.name }}</span>
                  <!-- <i v-else :class="item.icon" /> -->
                </div>
                <div v-if="isIfStatus(scope.row, column.status, column.rule.show)">---</div>
              </div>

            </template>
            <template v-else-if="column.rule">
              <span>{{ (scope.row[column.prop] || scope.row[column.prop] === 0) ? column.rule[scope.row[column.prop]] : '---' }}</span>
            </template>
            <template v-else-if="column.download">
              <el-button
                v-if="scope.row[column.show] == 1"
                class="btn-blue"
                size="mini"
                @click.stop="download(scope.row[column.prop])"
              >下载</el-button>
            </template>
            <!-- 含有render函数 且不长数据展示-->
            <template v-else-if="column.render && !column.longData">
              <RenderDom :row="scope.row" :index="index" :render="column.render" />
            </template>
            <!-- 含有render函数 且长数据展示-->
            <template v-else-if="column.render && column.longData">
              <el-tooltip class="item" effect="dark" placement="top">
                <!-- 这里特殊处理一下---用于D:\WORK_TREES\my-iot-platform-frontend\src\views\WlwAdministration\basicData\page\subpage\deviceFirmware\detail\index.vue --400 -->
                <div slot="content">
                  <span v-if="scope.row['unit']">{{ `${scope.row['fieldName']+scope.row['segmentName']+scope.row['unit']+'单元'}` }}</span>
                  <span v-else-if="scope.row['segmentName']">{{ `${scope.row['fieldName']+scope.row['segmentName']}` }}</span>
                  <span v-else-if="scope.row['fieldName']">{{ `${scope.row['fieldName']}` }}</span>
                  <span v-else>---</span>
                </div>
                <RenderDom :row="scope.row" :index="index" :render="column.render" />
              </el-tooltip>
            </template>
            <!-- 有img图片显示 -->
            <template v-else-if="column.img">
              <img :src="scope.row[column.prop]" alt="加载失败" width="40">
            </template>
            <!-- 没有render函数且没有图片要显示,长数据需要特殊处理 -->
            <template v-else-if="column.longData">
              <el-tooltip v-if="scope.row[column.prop]" class="item" effect="dark" placement="top">
                <div slot="content">
                  <div v-if="scope.row[column.prop].includes('\n\t')" class="longData_tips overfolw" :class="scope.row[column.prop].length>120 ? 'fix_width' : ''">
                    <pre v-html="scope.row[column.prop]" />
                  </div>
                  <div v-else-if="scope.row[column.prop].includes('|')" style="max-height:60vh;overflow-y: auto;" v-html="(scope.row[column.prop] || ' ')" />
                  <div v-else style="max-height:60vh;overflow-y: auto;" v-html="(scope.row[column.prop] || ' ').replace(/[,，;；/\n]/g, '</br>')" />
                </div>
                <div class="no-warp" :style="{ 'width:': column.width }">{{ scope.row[column.prop] || '---' }}</div>
              </el-tooltip>
              <div v-else class="no-warp" :style="{ 'width:': column.width }">{{ scope.row[column.prop] || '---' }}</div>
            </template>
            <!-- 文件预览 a标签跳转页面 -->
            <template v-else-if="column.aLink">
              <el-link :href="scope.row[column.prop]" type="primary" :target="column.blank ? '_blank': '_self'" :underline="column.underline">{{ column.aLinkName }}</el-link>
            </template>
            <!-- 查看二维码 边上二维码 -->
            <template v-else-if="column.qrCode">
              <el-popover
                placement="top"
                title="扫码预览文件"
                width="200"
                trigger="click"
                popper-class="qrCode-poper"
              >
                <vue-qr
                  :text="scope.row[column.prop] || '图片无效'"
                  :margin="10"
                  color-dark="#000"
                  color-light="#fff"
                  :size="180"
                />
                <el-button slot="reference" class="btn-blue" type="primary" size="small">{{ column.qrCodeName }}</el-button>
              </el-popover>
            </template>
            <template v-else-if="column.Zero">
              <!--  为0 number 也可能为null  -->
              <span>{{ typeof(scope.row[column.prop])==='number'?scope.row[column.prop]: '---' }}</span>
            </template>
            <!-- 没有render函数且没有图片要显示 -->
            <template v-else>
              <span v-if="!column.button && !column.buttonAll">{{ (scope.row[column.prop] || scope.row[column.prop] === 0) ? scope.row[column.prop] : '---' }}</span>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
            <!--不需要状态切换的按钮 -->
            <template v-if="column.buttonAll">
              <template v-for="(btn, i) in column.group">
                <button
                  v-if="btn.click == 'add'"
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="addRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
                <template>
                  <el-popconfirm
                    v-if="btn.click == 'remove'"
                    :key="i"
                    :title="btn.title||'确定删除该条数据吗？'"
                    @onConfirm="removeRow(scope.row, scope.$index, scope)"
                  >
                    <button
                      :key="i"
                      slot="reference"
                      v-hasAuth="btn.authCode"
                      :class="btn.class"
                      :type="btn.type"
                      :round="btn.round"
                      :size="btn.size || 'mini'"
                      :icon="btn.icon"
                      :plain="btn.plain"
                    >{{ btn.name }}</button>
                  </el-popconfirm>
                </template>
                <button
                  v-if="btn.click == 'edit'"
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="editRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
                <button
                  v-if="btn.click == 'see'"
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="seeRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
                <button
                  v-if="btn.click == 'slot'"
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="slotRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
              </template>
            </template>
            <!-- button 操作按钮  caseStatus-->
            <template v-if="column.button" class="caozuolie">
              <template v-for="(btn, i) in column.group">
                <button
                  v-if="btn.click == 'LSlot' && (!btn.status.includes(scope.row[column.show]))"
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="slotRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
                <button
                  v-if="(btn.click == 'add' &&(scope.row[column.show] == btn.status)) "
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="addRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
                <template>
                  <el-popconfirm
                    v-if="btn.click == 'remove'&&(scope.row[column.show] == btn.status) "
                    :key="i"
                    :title="btn.title||'确定删除该条数据吗？'"
                    @onConfirm="removeRow(scope.row, scope.$index, scope)"
                  >
                    <button
                      :key="i"
                      slot="reference"
                      v-hasAuth="btn.authCode"
                      :class="btn.class"
                      :type="btn.type"
                      :round="btn.round"
                      :size="btn.size || 'mini'"
                      :icon="btn.icon"
                      :plain="btn.plain"
                    >{{ btn.name }}</button>
                  </el-popconfirm>
                </template>
                <!---- 下发按钮start ---->
                <template>
                  <el-popconfirm
                    v-if="btn.click == 'distribute'"
                    :key="i"
                    :title="btn.title||'确认下发该场区数据？'"
                    @onConfirm="distribute(scope.row, scope.$index, scope)"
                  >
                    <button
                      :key="i"
                      slot="reference"
                      :class="btn.class"
                      :type="btn.type"
                      :round="btn.round"
                      :size="btn.size || 'mini'"
                      :icon="btn.icon"
                      :plain="btn.plain"
                    >{{ btn.name }}</button>
                  </el-popconfirm>
                </template>
                <!---- 下发按钮end ---->
                <button
                  v-if="btn.click == 'edit'&&(scope.row[column.show] == btn.status) "
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="editRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
                <button
                  v-if="btn.click == 'see'&&(scope.row[column.show] == btn.status) "
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="seeRow(scope.row, scope.$index, scope)"
                >{{ btn.name }}</button>
                <!-- 需要状态 且自定义方法 -->
                <template>
                  <el-popconfirm
                    v-if="btn.click == 'slotStatusPop'&&(scope.row[column.show] == btn.status) "
                    :key="i"
                    :title="btn.title||'确定删除该条数据吗？'"
                    @onConfirm="slotStatusPop(scope.row, scope.$index, scope)"
                  >
                    <button
                      :key="i"
                      slot="reference"
                      v-hasAuth="btn.authCode"
                      :class="btn.class"
                      :type="btn.type"
                      :round="btn.round"
                      :size="btn.size || 'mini'"
                      :icon="btn.icon"
                      :plain="btn.plain"
                    >{{ btn.name }}</button>
                  </el-popconfirm>
                </template>
                <!-- 以下两个不需要状态----- -->
                <button
                  v-if="(btn.click == 'slot' && !btn.style)"
                  :key="i"
                  v-hasAuth="btn.authCode"
                  :class="btn.class"
                  :type="btn.type"
                  :round="btn.round"
                  :size="btn.size || 'mini'"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  @click.stop="slotRow(scope.row, scope.$index, scope, btn.mode)"
                >{{ btn.name }}</button>
                <el-popconfirm
                  v-if="(btn.click == 'slot' && btn.style == 'pop')"
                  :key="i"
                  :title="btn.title || '确定删除该条数据吗？'"
                  @onConfirm="slotRowPop(scope.row, scope.$index, scope)"
                >
                  <button
                    :key="i"
                    slot="reference"
                    v-hasAuth="btn.authCode"
                    :class="btn.class"
                    :type="btn.type"
                    :round="btn.round"
                    :size="btn.size || 'mini'"
                    :icon="btn.icon"
                    :plain="btn.plain"
                  >{{ btn.name }}</button>
                </el-popconfirm>
              </template>
              <slot name="otherOperationSlot" :data="scope.row" />
            </template>
            <!-- slot 你可以其他常用项 -->
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <!-- v-if="pagination.total > pagination.limit"   bug期望：分页信息不消失，可以随意来回选择-->
    <el-pagination
      v-if="pagination"
      background
      :total="pagination.total"
      :small="pagination.small"
      :page-size="pagination.limit"
      :current-page.sync="pagination.pageIndex"
      :layout="pagination.layout || ' total, prev, pager, next, sizes,jumper'"
      style="padding: 20px;text-align: right"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
    />
  </div>
</template>
<script>
import { derive } from '@/http/api/exportData/export'
import EmptyInterface from '@/components/EmptyInterface'
import vueQr from 'vue-qr'
export default {
  components: {
    vueQr,
    EmptyInterface,
    RenderDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, data) => {
        const params = {
          row: data.props.row,
          index: data.props.index
        }
        if (data.props.column) params.column = data.props.column
        return data.props.render(h, params)
      }
    }
  },
  props: {
    dataSource: Array, // table内容数据
    options: Object, // 表格参数控制 maxHeight、stripe 等等...
    columns: Array, // 表头
    pagination: Object, // 分页，不传则不显示
    height: String,
    isLoading: Boolean // 是否加载中
  },
  data() {
    return {
      noData: null
    }
  },
  created() {
    // 传入的options覆盖默认设置
    this.$parent.options = Object.assign(
      {
        // maxHeight: 500,
        stripe: false, // 是否为斑马纹
        border: false
      },
      this.options
    )

    // this.options.initTable && this.fetch();
  },
  methods: {
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event)
    },
    indexMethod(index) { // 自定义索引
      return (this.pagination.pageIndex - 1) * this.pagination.limit + index + 1
    },
    download(url) {
      derive(url)
      // window.open(url, '_blank')
    },
    addRow: function(row, index) {
      this.$emit('child-addRow', row, index)
      // alert("add"+index)
    },
    removeRow: function(row, index) {
      this.$emit('child-removeRow', row, index)
      // alert("remove"+index)
    },
    distribute: function(row, index) {
      this.$emit('child-distribute', row, index)
    },
    editRow: function(row, index) {
      this.$emit('child-editRow', row, index)
      // alert("edit"+index)
    },
    seeRow: function(row, index) {
      this.$emit('child-seeRow', row, index)
      // alert("seerow"+index)
    },
    slotRow: function(row, index, ...ext) {
      this.$emit('child-slotRow', row, index, ext)
      // alert("seerow"+index)
    },
    // 不带状态的  POP 即所有行都有
    slotRowPop: function(row, index) {
      this.$emit('child-slotRowPop', row, index)
      // alert("seerow"+index)
    },
    // 带状态的 POP 即对应状态的行有
    slotStatusPop(row, index) {
      this.$emit('child-slotStatusPop', row, index)
    },
    // 斑马色
    tabRowClassName({ row, rowIndex }) {
      const index = rowIndex + 1
      if (index % 2 === 0) {
        return 'warning-row'
      }
    },
    // 清空选项clearCheckedNodes(){}
    labelHead: function(h, { column, $index }) {
      const l = column.label.length
      const f = 16
      column.minWidth = f * (l + 2) // 加上一个文字长度
      return h('div', { class: 'table-head', style: { width: '100%' }}, [
        column.label
      ])
    },
    // 行颜色
    getRowClassHeader({ row, rowIndwx }) {
      var styleJson = {}
      styleJson = {
        background: '#223282',
        color: '#CDD8F7',
        height: '43px'
      }
      return styleJson // 返回对象
    },
    getRowClass({ row, rowIndwx }) {
      var styleJson = {}
      styleJson = {
        background: '#001B3F',
        color: '#CDD8F7',
        height: '43px',
        fontSize: '12px'
      }
      return styleJson // 返回对象
    },
    // table 文本颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '当前状态' && row.row.status === 1) {
        return {
          'color': '#0ED1AA',
          'font-size': '12px'
        }
      } else if (row.column.label === '当前状态' && row.row.status === 2) {
        return {

          'color': '#F3384F',
          'font-size': '12px'
        }
      }
    },
    // pageSize 改变时触发事件
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.$emit('handleSizeChange', size)
    },
    // currentPage 改变时触发事件
    handleIndexChange(current) {
      this.pagination.pageIndex = current
      this.$emit('handleIndexChange', current)
    },
    // 多选框选择变化触发事件
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    // 双击table某一行时触发
    handleRowDblclick(row, event, column) {
      this.$emit('handleRowDblclick', row, event, column)
    },
    // 点击table某一行时触发事件
    handleRowClick(row, event, column) {
      this.$emit('handleRowClick', row, event, column)
    },
    // 翻页时，记住上一页的勾选标识
    getRowKey(row) {
      return row.id
    },
    isIfStatus(row, status, rShow) { // 该方法判断 推送方式例 电话/微信/短信等 都不在时的展示
      return status.every(item => {
        return row[item.value] !== rShow // 每个都为0时 才为true
      })
    }
  }
}
</script>
<style lang="scss">
.qrCode-poper{
  font-size: 14px;
  .el-popover__title{
   text-align: center;
  //  color: #fff;
  @include font_color('spFontColor4');
  }
  .qrCode-container{}
}
.number-index .cell{
  padding: 0!important;
}
.number-index .cell div{
  word-break: keep-all;
  min-width: 50px;
  max-width: 100px;
  text-align: center;
}
.longData_tips{
  max-height:60vh;
  overflow-y: auto;
}
/* .fix_width{
  width: 40vw;
  line-height: 28px;
  font-size: 1em;
} */
.no-warp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.station-search .table-head {
  font-size: 14px !important;
}
.station-search .el-table .caret-wrapper {
  position: absolute;
  top: 2px;
  right: 0;
}
.station-search .el-table tr td .cell {
  padding: 5px 2px !important;
}
.station-search .el-table .cell,
.station-search .el-table th div,
.station-search .el-table--border td:first-child .cell,
.station-search .el-table--border th:first-child .cell {
  padding-left: 0 !important;
}
// .el-checkbox__inner{
//   border-color:#4459c1;
// }
.table_page .el-checkbox__inner,
.table_page .el-checkbox__inner:focus {
  background: transparent;
}
.el-table-header-custom {
  color: black;
}
/* 选中时候的行颜色 */
// .el-table__body tr.current-row > td {
//   background-color: #102d5d !important;
//   color: #fff;
// }
/* hover时候的航颜色 */
.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #0d2055 !important;
  @include background_color('elTable_body_hover')
}
.el-table tbody tr.hover-row > td {
  background-color: #0d2055 !important;
  @include background_color('elTable_body_hover')
}
.el-table td,
.el-table th.is-leaf,
.el-table--border,
.el-table--group {
  border-color: #43619f;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #43619f;
}
.el-table td,
.el-table th {
  padding: 5px 0 !important;
}
// .el-table tbody tr:hover > td {
//   background-color: #0d2055 !important; /*高亮*/
// }
.el-table td,
.el-table th.is-leaf {
  border-bottom: none;
}
/* .el-table thead tr{
  border-bottom: #223282!important;
}
.el-table__header>thead>tr>th{
  border-bottom: #223282!important;
} */
.el-table::-webkit-scrollbar {
  display: none;
}
.el-pagination li {
  background: transparent;
}
.el-pagination__total{
  color: #cdd8f7;
}
/* 分页按钮颜色 */
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: transparent;
  box-sizing: border-box;
  border: 1px solid #606f9a;
  color: #cdd8f7;
}
.el-pagination.is-background .btn-next:hover,
.el-pagination.is-background .btn-prev:hover,
.el-pagination.is-background .el-pager li:hover {
  border: 1px solid #10aeff;
  color: #cdd8f7;
}
/* 分页按钮选中状态颜色 */
#app .el-pagination li.active {
  background: #10aeff !important;
  border: 1px solid #10aeff;
}
#app .el-table__empty-block,
.el-table__empty-block {
  background: #001D45
}
</style>
