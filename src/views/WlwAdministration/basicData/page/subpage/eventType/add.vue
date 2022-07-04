<template>
  <div class="dialog" :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'">
    <div
      v-loading="loading"
      class="dialog-body Highlight"
    >
      <!-- 头部 -->
      <div class="dialog-head">
        <span>{{ data.type === 'added' ? '新增' : '修改' }}</span>
        <div class="dialog-head-close" @click="close"><i class="iconfont">&#xe61a;</i></div>
      </div>

      <!-- 内容 -->
      <div class="dialog-container">
        <general-form
          ref="delog"
          label-width="80px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          theme-type="default"
          @handleChange="handleChange"
          @cascaderEvent="cascaderEvent"
        />
      </div>
      <!-- 底部 -->
      <div class="dialog-foot">
        <button-list
          :btn-list="btnList"
          @btn-added="confirm"
          @btn-edit="close"
          @btn-added2="toUpdate"
        />
      </div>

    </div>
    <div class="dialog-close" @click="close" />

  </div>
</template>
<script>
import buttonList from '@/components/ElementComponent/button'
import generalForm from '@/components/commonComponent/generalForm'
import { httpRequest } from '@/http/dispatch'
const btnAdd = [
  {
    name: '取消',
    class: 'btn-border',
    size: '60',
    event: 'edit'
  }, {
    name: '保存',
    class: 'btn-blue',
    size: '60',
    event: 'added'
  }
]
const btnEdit = [
  {
    name: '取消',
    class: 'btn-border',
    size: '60',
    event: 'edit'
  }, {
    name: '更新',
    class: 'btn-blue',
    size: '60',
    event: 'added2'
  }
]

export default {
  name: 'VAdded',
  components: {
    buttonList,
    generalForm
  },
  data() {
    return {
      loading: false,
      // 弹框动画
      dialogDtatus: true,
      upDate: true,
      formInfo: {
        data: {
          eventName: '',
          description: ''
        },
        fieldList: [
          {
            label: '事件类型',
            key: 'eventName',
            type: 'input',
            className: 'shadow',
            disabled: false,
            required: true,
            rules: [
              { required: true, message: '请输入事件类型', trigger: ['change', 'blur'] }
            ]
          },
          {
            label: '备注',
            key: 'description',
            type: 'input',
            className: 'shadow',
            disabled: false
          }
        ]
      },
      btnList: btnAdd
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
      console.log(this.data)
      if (this.data.type === 'edit') {
        this.btnList = btnEdit
        this.formInfo.data.eventName = this.data.info.eventName
        this.formInfo.data.description = this.data.info.description
      }
    },
    cascaderEvent(val, val1, val2) {
    },
    handleChange() {
    },
    // 提交
    confirm() {
      console.log(this.$refs)
      this.$refs.delog.$refs.generalForm.validate((valid) => {
        if (valid) {
          this.loading = true
          httpRequest({
            type: 'POST',
            uri: this.data.power.btn_add && this.data.power.btn_add.uri,
            payload: this.handleObj(this.formInfo.data),
            callback: (res) => {
              this.loading = false
              if (res && res.status === 200) {
                this.$message.success('新增成功')
                this.close()
                this.data.handleOk()
              } else { this.$message(res.message) }
            }
          })
        } else {
          // this.$message.error('请输入事件类型')
          return false
        }
      })
    },
    toUpdate() {
      this.$refs.delog.$refs.generalForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            ...this.formInfo.data,
            id: this.data.info.id
          }
          httpRequest({
            type: 'PUT',
            uri: this.data.power.btn_edit && this.data.power.btn_edit.uri,
            payload: this.handleObj(data),
            callback: (res) => {
              this.loading = false
              if (res && res.status === 200) {
                this.$message.success('修改成功')
                this.close()
                this.data.handleOk()
              } else { this.$message(res.message) }
            }
          })
        } else {
          // this.$message.error('请输入事件类型')
          return false
        }
      })
    },
    // 关闭
    close() {
      this.dialogDtatus = false
      setTimeout(() => { this._close() }, 300)
    },
    // 处理对象 删除值为''字段 返回对象
    handleObj(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          delete obj[key]
        }
      }
      return obj
    }

  }
}
</script>
<style lang="scss" scoped>
.dialog-container::-webkit-scrollbar{
    display: none;
}
.dialog-container{
    min-width: 450px;
    // min-height: 200px;
    max-height: 70vh;
    overflow-x: auto;
    margin: 30px 30px 18px 30px;
}
.iconfont-direction1{
    position: absolute;
    font-size: 14px;
    top: 11px;
    right:10px;
    transform:rotate(0deg);
    transition: all .3s;
}
.iconfont-direction2{
    transform:rotate(-180deg);
    transition: all .3s;
}

</style>
