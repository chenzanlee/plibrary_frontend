<template>
  <!-- <div class="home ownbtn"> -->
  <!-- <general-form
    :data="formInfo.data"
    :field-list="formInfo.fieldList"
    :list-type-info="listTypeInfo"
    theme-type="default">
		</general-form> -->
  <div class="warnning">
    <div class="warnningBg Highlight">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="一级告警" prop="noticeInterval1">
          <el-select v-model="ruleForm.noticeInterval1" class="shadow" placeholder="请选择活动区域" disabled style="width:400px;">
            <el-option v-for=" (item,idx) in typeList" :key="idx" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="li">告警未处理,{{ ruleForm.noticeInterval1 }}分钟后告警继续上报, 报警推送至一级告警</div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="二级告警" prop="noticeInterval2">
          <el-select v-model="ruleForm.noticeInterval2" class="shadow" placeholder="请选择活动区域" style="width:400px;">
            <el-option v-for=" (item,idx) in typeList" :key="idx" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="li">一级告警未处理告警,{{ ruleForm.noticeInterval2 }}分钟后告警继续上报, 报警推送至二级告警</div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="三级告警" prop="noticeInterval3">
          <el-select v-model="ruleForm.noticeInterval3" class="shadow" placeholder="请选择活动区域" style="width:400px;">
            <el-option v-for=" (item,idx) in typeList" :key="idx" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="li">二级告警未处理告警,{{ ruleForm.noticeInterval3 }}分钟后告警继续上报, 报警推送至三级告警</div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="四级告警" prop="noticeInterval4">
          <el-select v-model="ruleForm.noticeInterval4" class="shadow" placeholder="请选择活动区域" style="width:400px;">
            <el-option v-for=" (item,idx) in typeList" :key="idx" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="li">三级告警未处理告警,{{ ruleForm.noticeInterval4 }}分钟后告警继续上报, 报警推送至四级告警</div>
      <div class="fixbg_right">
        <el-button
          :disabled="isDisabled"
          class="btn-blue"
          type="primary"
          :loading="buttonLoading"
          @click="setMess"
        >
          保存
        </el-button>
      </div>

    </div>
  </div>
  <!-- </div> -->
</template>

<script>
// import navForm from '@/components/commonComponent/navForm'
import { getConfigElement } from '@/utils/overtService'
export default {
  components: {
    // navForm
  },
  data() {
    return {
      pageElement: [], // 页面权限数组
      id: '',
      isDisabled: true,
      buttonLoading: false,
      formData: {
      },
      ruleForm: {
        id: '',
        appCode: '',
        defaultNotifier: '',
        noticeInterval1: 0,
        noticeInterval2: 0,
        noticeInterval3: 0,
        noticeInterval4: 0
      },
      rules: {
        noticeInterval1: [
          { required: true, message: '请选择一级告警', trigger: 'change' }
        ],
        noticeInterval2: [
          { required: true, message: '请选择二级告警', trigger: 'change' }
        ],
        noticeInterval3: [
          { required: true, message: '请选择三级告警', trigger: 'change' }
        ],
        noticeInterval4: [
          { required: true, message: '请选择四级告警', trigger: 'change' }
        ]
      },
      submit: {

      },

      typeList: [
        { label: '5分钟', value: 5 },
        { label: '10分钟', value: 10 },
        { label: '15分钟', value: 15 },
        { label: '20分钟', value: 20 },
        { label: '25分钟', value: 25 }
      ],
      navFormInfo: { fieldList: {
        right: {
          btnLists: [
            {
              innerText: '保存',
              className: 'btn-blue',
              handleClick: () => {
                this.setMess()
              }
            }
          ]
        }
      }
      }
    }
  },
  watch: {
    ruleForm: {
      handler: function(val) {
        console.log(val)
        if (val.noticeInterval2 === this.formData.noticeInterval2 && val.noticeInterval3 === this.formData.noticeInterval3 && val.noticeInterval4 === this.formData.noticeInterval4) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      },
      deep: true
    }
  },
  created() {
    this.pageElement = getConfigElement('alarmNoticeConfig')
    this.getId()
  },
  methods: {
    getId() {
      const element = this.pageElement['getAlarmNoticeConfig']
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: { appCode: 'unit-evc' },
        callback: data => {
          console.log('1111111111111111', data)
          if (data.status === 200) {
            this.formData = { ...data.data }
            this.ruleForm.appCode = data.data.appCode
            this.ruleForm.id = data.data.id
            this.ruleForm.defaultNotifier = data.data.defaultNotifier
            this.ruleForm.noticeInterval1 = data.data.noticeInterval1
            this.ruleForm.noticeInterval2 = data.data.noticeInterval2
            this.ruleForm.noticeInterval3 = data.data.noticeInterval3
            this.ruleForm.noticeInterval4 = data.data.noticeInterval4
            console.log(this.ruleForm)
          }
        }
      })
      // alarmNoticeConfig({
      //   appCode: 'unit-evc'
      // }).then(data => {
      //   this.id = data.data.id
      //   this.ruleForm = data.data
      // })
    },
    submitForm(formName) {
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    setMess() {
      const element = this.pageElement['updateAlarmNoticeConfig']
      this.buttonLoading = true
      this.$httpRequest({
        type: element ? element.method : '',
        uri: element ? element.uri : '',
        payload: this.ruleForm,
        callback: data => {
          this.buttonLoading = false
          if (data.status === 200) {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          }
        }
      })
      // alarmNoticeConfigPut(this.ruleForm).then(data => {
      //   this.$message({
      //     message: '更新成功',
      //     type: 'success'
      //   })
      //   this.buttonLoading = false
      // })
    }
  }

}
</script>

<style scoped lang="scss">
.fixbg_right{
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.home{
	width: 500px;
	margin-left: 400px;
}
.warnning {
  width: 100%;
  // height: 100%;
  height: calc(100vh - 128px);
  border: 1px solid transparent;
  @include background_color("durationBackgroundColor");
}
.warnningBg{
	width: 650px;
  height: auto;
  margin: 100px auto;
	display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 70px 50px 50px 50px;
  border-radius: 10px;
  // background: transparent;
  @include background_color("durationBackgroundColor");
	.li{
		width: 100%;
		height: 10px;
		margin-top: -18px;
		padding-left: 100px;
		box-sizing: border-box;
		font-size: 12px;
		margin-bottom: 25px;
    // color: #838A9F;
    @include font_color("durationFontColor");
	}
	.label{
		width: 100px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
<style lang="scss">
// .el-input .is-disabled .el-input__inner{
//     background-color: #1d2c4c;
//     border: 1px solid #1d2c4c;
//     color: #adadad;
//     line-height: 36px;
//     border-radius: 2px;
// }
// .ownbtn{
//   .el-button {
//     margin-right: 0px !important;
//   }
// }
</style>
