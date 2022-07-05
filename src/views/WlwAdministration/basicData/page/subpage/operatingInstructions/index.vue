<template>
  <div class="operatingInstructions">
    <!-- 头部导航 -->
    <nav-form ref="navForm" :data="navFormInfo.data" :field-list="navFormInfo.fieldList" />
    <!-- 内容表格 -->
    <tablePage
      ref="tablePage"
      :is-loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      :options="options"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleIndexChange="handleIndexChange"
      @selection-change="handleSelectionChange"
      @child-removeRow="removeRow"
      @child-seeRow="childSeeRow"
      @child-editRow="editRow"
    />
    <!-- 新增/编辑/查看 dialog -->
    <el-dialog
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="700px"
    >
      <div class="body">
        <general-form
          ref="delog"
          label-width="80px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
          @cascaderEvent="cascaderEvent"
        >
          <template v-slot:form-file>
            <el-upload
              name="upload_file"
              :headers="headers"
              class="upload-file"
              action="/file/upload/v4"
              :file-list="fileList"
              :disabled="formInfo.fieldList[0].disabled"
              :on-success="uploadHandleSuccess"
              :on-remove="uploadHandleRemove"
              :on-preview="uploadHandlePreview"
            >
              <el-button size="small" type="primary" icon="el-icon-upload2" :disabled="formInfo.fieldList[0].disabled">点击上传</el-button>
            </el-upload>
          </template>
        </general-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="width:100%;margin:0 auto;">
          <el-button class="btn-border" @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="status==1" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="status==2" class="btn-blue" :loading="btnLoading" type="primary" @click="determine">更 新</el-button>
        </div>
      </div>
    </el-dialog>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[url]"
    />
  </div>
</template>
<script>
import navForm from '@/components/commonComponent/navForm/index.vue'
import tablePage from '@/components/ElementComponent/iTable'
import generalForm from '@/components/commonComponent/generalForm'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { getConfigElement } from '@/utils/overtService'
import { isImage } from '@/lib/utils'
export default {
  components: {
    navForm,
    tablePage,
    generalForm,
    ElImageViewer // 图片查看器组件
  },
  data() {
    return {
      btnLoading: false,
      showViewer: false, // 显示查看器
      url: '',
      headers: {}, // 上传文件header
      fileList: [], // 上传的文件列表
      pageElement: [], // 页面权限数组
      pagination: { // 表格分页
        total: 0,
        pageIndex: 1,
        limit: 10
      },
      options: { // 表格配置项
        stripe: false, // 斑马纹
        firstFixed: true, // 首航固定
        mutiSelect: true, // 多选框
        loading: false, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      selection: [], // 表格选中数组
      auditarr: [], // 已审核数组
      unAuditarr: [], // 未审核数组
      isLoading: false, // 表格loading
      tableData: [], // 表格数据
      columns: [ // 列项
        {
          longData: true,
          prop: 'fileName',
          label: '文件名称'
        },
        {
          longData: true,
          prop: 'description',
          label: '描述',
          width: '220'
        },
        {
          prop: 'fileSize',
          label: '文件大小'
        },
        {
          prop: 'updTime',
          label: '更新时间'
        },
        {
          prop: 'status',
          label: '状态',
          rule: {
            'AUDITED': '已审核',
            'NORMAL': '未审核'
          }
        },
        {
          prop: 'viewUrl',
          label: '文件预览',
          aLink: true, // 表示文件预览 a标签
          aLinkName: '在线预览',
          blank: true,
          underline: false // 是否下划线
        },
        {
          prop: 'viewUrl',
          label: '扫码预览',
          qrCode: true, // 表示查看二维码
          qrCodeName: '查看二维码'
        },
        {
          button: true,
          label: '操作',
          fixed: 'right',
          align: 'center',
          show: 'status',
          width: '180', // 操作按钮宽度
          group: [
            {
              name: '查看',
              class: 'btn-blue',
              authCode: '',
              size: 'auto',
              click: 'see',
              status: 'AUDITED'
            },
            {
              name: '修改',
              class: 'btn-blue',
              authCode: 'myDirections:update',
              size: 'auto',
              click: 'edit',
              status: 'NORMAL'
            },
            {
              name: '删除',
              class: 'btn-red',
              authCode: 'myDirections:delete',
              size: 'auto',
              click: 'remove',
              status: 'NORMAL'
            }
          ]
        }
      ],
      navFormInfo: {
        data: {
          fileName: '',
          status: ''
        },
        fieldList: {
          left: {
            inpLists: [
              {
                type: 'button',
                innerText: '新增',
                authCode: 'myDirections:add',
                className: 'btn-blue',
                handleClick: () => {
                  this.status = 1
                  this.dialogFormVisible = true
                }
              },
              {
                type: 'button',
                innerText: '审核',
                authCode: 'myDirections:review',
                isDisabled: true,
                className: 'btn-blue',
                handleClick: () => {
                  if (this.auditarr.length !== 0) {
                    this.$message.error('只能选择未审核数据进行审核')
                    return
                  }
                  if (this.unAuditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条未审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.$confirm('此操作将审核这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.setReview(this.unAuditarr)
                  }).catch(() => {})
                }
              },
              {
                type: 'button',
                innerText: '反审核',
                authCode: 'myDirections:unreview',
                isDisabled: true,
                className: 'btn-blue',
                handleClick: () => {
                  if (this.unAuditarr.length !== 0) {
                    this.$message.error('只能选择已审核数据进行反审核')
                    return
                  }
                  if (this.auditarr.length === 0) {
                    this.$message({
                      message: '最少需要选择一条已审核数据',
                      type: 'warning'
                    })
                    return
                  }
                  this.$confirm('此操作将反审核这些数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btn-blue btn-blue-confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.setUnreview(this.auditarr)
                  }).catch(() => {})
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'fileName',
                type: 'input',
                lable: '文件名称',
                className: 'shadow',
                placeholder: '请输入文件名称',
                options: []
              },
              {
                key: 'status',
                type: 'radio',
                required: true,
                className: 'shadow',
                placeholder: '333',
                customLabel: 'name',
                customVal: 'val',
                optList: [{ name: '全部', val: '' }, { name: '已审核', val: 'AUDITED' }, { name: '未审核', val: 'NORMAL' }]
              }
            ],
            btnLists: [
              {
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              },
              {
                innerText: '重置',
                className: 'btn-border',
                handleClick: () => {
                  this.$refs['navForm'].resetFields()
                  this.pagination.pageIndex = 1
                  this.getMyEvcMcuInfo()
                }
              }
            ]
          }
        }
      },
      status: 0, // 0查看 1新增 2修改
      row: null, // 查看/编辑时 当前选中行数据
      dialogFormVisible: false, // 新增/编辑/查看 dialog控制变量
      listTypeInfo: {}, // dialog下拉框对应内容OBJ
      formInfo: {
        data: {
          file: [], // 上传文件相关信息
          description: ''
        },
        fieldList: [
          {
            key: 'file',
            type: 'slot',
            label: '文件',
            className: 'shadow',
            required: true,
            disabled: false,
            rules: [{ required: true, message: '请选择文件', trigger: 'blur' }]
          },
          {
            key: 'description',
            type: 'input',
            label: '描述',
            className: 'shadow',
            disabled: false
          }
        ]
      }
    }
  },
  computed: {
    title() {
      const titleArr = ['查看', '新增', '修改']
      const status = this.status
      return titleArr[status]
    }
  },
  watch: {
    dialogFormVisible(val) { // 手动清楚一下提示语
      if (!val) {
        this.$refs['delog'].resetFields()
        this.fileList = []
        const data = {
          file: [],
          description: ''
        }
        this.resetFormInfo(data, false)
      }
    },
    auditarr(val) { // 已审核数组
      this.navFormInfo.fieldList.left.inpLists[2].isDisabled = !(val.length) // 改变反审核按钮DIS状态
    },
    unAuditarr(val) { // 未审核数组
      this.navFormInfo.fieldList.left.inpLists[1].isDisabled = !(val.length) // 改变审核按钮DIS状态
    }
  },
  created() {
    this.headers = {
      appCode: 'wlw',
      Authorization: localStorage.getItem('TOKEN'),
      'X-Requested-With': 'XMLHttpRequest'
    }
    this.pageElement = getConfigElement('myDirections')
    this.getMyEvcMcuInfo()
  },
  methods: {
    uploadHandleSuccess(res, file, fileList) { // 上传文件
      console.log('res--', res)
      console.log('file--', file)
      console.log('fileList--', fileList)
      if (res.status === 200) {
        if (this.status === 2) { // 修改
          const { name, size, response } = file
          const obj = {
            name,
            size,
            url: response?.data.rows[0]?.url
          }
          this.formInfo.data.file.push(obj)
        }
        if (this.status === 1) this.formInfo.data.file = fileList
      } else {
        this.$message.error('上传失败')
      }
    },
    uploadHandleRemove(file, fileList) { // 文件列表移除文件时的钩子
      console.log('文件移除---', fileList)
      this.fileList = fileList
      this.formInfo.data.file = fileList.map(item => {
        const { name, size, response } = item
        if (response) { // 新上传的
          return {
            name,
            size,
            url: response?.data.rows[0]?.url
          }
        } else { // 之前的
          const { fileSize, url } = this.row
          return {
            name,
            size: fileSize,
            url: url
          }
        }
      })
    },
    uploadHandlePreview(file) { // 点击已上传文件列表时的钩子
      console.log('文件点击---', file)
      // 新增时---图片预览，，其他本页面下载
      // 更新时---图片预览，，其他其他页预览
      // 查看时---图片预览，，其他本页面下载
      const { status } = this // 1xin 0cha 2xiu
      const { name, response, url } = file
      let cUrl = ''
      if (isImage(name)) { // 是图片
        if (status === 1) cUrl = response?.data.rows[0]?.url // 新增时 从response里取
        if (status === 0 || status === 2) { // 查看、修改时
          cUrl = url?.split('?url=')[1] || response?.data.rows[0]?.url // 先从url里取 娶不到再从response里取
        }
        this.url = cUrl
        this.showViewer = true
      } else { // 非图片
        if (status === 1) { // 新增时 从response里取
          cUrl = response?.data.rows[0]?.url
          location.href = cUrl
        }
        if (status === 2) { // 修改时
          cUrl = url || response?.data.rows[0]?.url // 先从url里取 娶不到再从response里取
          window.open(cUrl, '_blank')
        }
        if (status === 0) { // 查看时
          cUrl = url?.split('?url=')[1] || response?.data.rows[0]?.url // 先从url里取 娶不到再从response里取
          location.href = cUrl
        }
      }
    },
    getMyEvcMcuInfo() { // 查询表格数据
      const element = this.pageElement['getPageList']
      const params = {
        limit: this.pagination.limit,
        page: this.pagination.pageIndex
      }
      const { fileName, status } = this.navFormInfo.data
      if (fileName) params.fileName = fileName
      if (status) params.status = status
      this.isLoading = true
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri,
        payload: params,
        callback: res => {
          this.isLoading = false
          if (res.status === 200) {
            this.pagination.total = res.data.total
            this.tableData = res.data.rows
            this.$refs['tablePage'].$children[0].clearSelection()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    setReview(idArr) { // 审核
      const element = this.pageElement['review']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri + `?ids=${params.ids}`,
        payload: params,
        callback: res => {
          if (res.status === 200) {
            this.$message.success('审核成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    setUnreview(idArr) { // 反审核
      const element = this.pageElement['unreview']
      const params = {
        ids: idArr.join(',')
      }
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri + `?ids=${params.ids}`,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('反审核成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    removeRow(row) { // 表格行删除
      const element = this.pageElement['delete']
      const params = {
        ids: row.id
      }
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri,
        payload: params,
        callback: res => {
          if (res.status === 200 && res.rel) {
            this.$message.success('删除成功')
            this.getMyEvcMcuInfo()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    childSeeRow(row) { // 表格行查看
      this.row = row
      this.status = 0
      this.dialogFormVisible = true
      this.fileList = [
        {
          name: row.fileName,
          url: row.viewUrl
        }
      ]
      const data = {
        file: [],
        description: row.description
      }
      this.resetFormInfo(data, true)
    },
    editRow(row) { // 表格行编辑
      console.log('编辑行---', row)
      this.row = row
      this.status = 2
      this.dialogFormVisible = true
      this.fileList = [
        {
          name: row.fileName,
          url: row.viewUrl
        }
      ]
      const data = {
        file: [{
          name: row.fileName,
          size: row.fileSize,
          url: row.url
        }],
        description: row.description
      }
      this.resetFormInfo(data, false)
    },
    handleSizeChange(size) { // 改变表格size
      this.pagination.limit = size
      this.getMyEvcMcuInfo()
    },
    handleIndexChange(current) { // 改变表格页码
      this.pagination.pageIndex = current
      this.getMyEvcMcuInfo()
    },
    handleSelectionChange(selection) { // 改变表格选中
      this.selection = selection
      this.auditarr = [] // 已审核数组
      this.unAuditarr = [] // 未审核数组
      selection.forEach((item) => {
        if (item.status === 'AUDITED') {
          this.auditarr.push(item.id)
        } else {
          this.unAuditarr.push(item.id)
        }
      })
    },
    determine() { // 点击 新增/更新时的操作
      if (!this.$refs['delog'].validateSelf()) {
        return false
      }
      const { status, fileList } = this
      const { file, description } = this.formInfo.data
      if (file.length > 1) {
        this.$message.warning('只能选择一个文件')
        return
      }
      if (file.length === 0 && fileList.length === 0) {
        this.$message.warning('请选择一个文件')
        return
      }
      if (status === 1) { // 新增
        const params = {
          description,
          fileName: file[0].name,
          fileSize: file[0].size,
          url: file[0].url || file[0].response.data.rows[0].url
        }
        const element = this.pageElement['add']
        this.btnLoading = true
        this.$httpRequest({
          type: element?.method,
          uri: element?.uri,
          payload: params,
          callback: res => {
            this.btnLoading = false
            this.dialogFormVisible = false
            if (res.status === 200 && res.rel) {
              this.$message.success('新增成功')
              this.getMyEvcMcuInfo()
            } else {
              this.$message.error(res.message)
            }
          }
        })
      } else { // 修改
        const curFile = {}
        curFile.fileName = file[0].name
        curFile.fileSize = file[0].size
        curFile.url = file[0].url
        const params = {
          ...this.row,
          description,
          ...curFile
        }
        const element = this.pageElement['update']
        this.btnLoading = true
        this.$httpRequest({
          type: element?.method,
          uri: element?.uri,
          payload: params,
          callback: res => {
            this.btnLoading = false
            this.dialogFormVisible = false
            if (res.status === 200 && res.rel) {
              this.$message.success('更新成功')
              this.getMyEvcMcuInfo()
            } else {
              this.$message.error(res.message)
            }
          }
        })
      }
    },
    cascaderEvent(idVals, nameVals, nodeVlas) { // 新增时的级联，抛出三个数组值

    },
    resetFormInfo(data, flag) { // 此处重置一下 dialog数据  flag为boolean表示dialog项DISABLED状态
      this.formInfo.data = data // 这里 重置为初始状态
      this.formInfo.fieldList = this.formInfo.fieldList.map(item => {
        item.disabled = flag
        return item
      })
    },
    onPreview() {
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    }
  }
}
</script>
<style lang="scss">
.operatingInstructions{
  .upload-file{
    width: 120px;
  }
  .el-image-viewer__wrapper{
    z-index: 12020!important;
    .el-image-viewer__close{
      color:#fff;
      top: 80px!important;
      opacity: 1!important;
    }
  }
}
</style>
