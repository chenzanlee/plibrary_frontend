<template>
  <div class="exportBg">
    <div class="export Highlight">
      <div class="computed">
        <div class="computerbg" style="width:94px;height:77px;">
          <svg-icon class="computer" icon-class="export" />

        </div>
      </div>
      <div class="exportSearch">
        <general-form
          ref="ceshi"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
        >
          <template v-slot:form-mullu>
            <div>
              <el-input v-model="formInfo.data.mullu" class="noShadow" placeholder />
            </div>
          </template>
        </general-form>
        <div class="btn-box">
          <el-button v-hasAuth="'myEvcRuntimeArgs:export'" class="btn-blue" @click="exportHandle">
            <svg-icon icon-class="newExport" />
            导出
          </el-button>
        </div>
        <nav-form
          ref="ceshi"
          :data="navFormInfo.data"
          :field-list="navFormInfo.fieldList"
        >
          <!-- 自定义插槽的使用 -->
          <template v-slot:form-mullu>
            <div>
              <el-input
                v-model="formInfo.data.mullu"
                class="noShadow"
                placeholder=""
              />
            </div>
          </template>
        </nav-form>
      </div>
    </div>
  </div>
</template>
<script>
import generalForm from '@/components/commonComponent/generalForm'
import navForm from '@/components/commonComponent/navForm'
import { getConfigElement } from '@/utils/overtService'
const pageElement = getConfigElement('unit-evcDataInterface')
export default {
  components: {
    generalForm,
    navForm
  },
  data() {
    return {
      listTypeInfo: {
        typeList: [
        ],
        codeList: [
        ]
      },
      defaultValue: [],
      formInfo: {
        data: {
          area: [], // 地区
          type: '',
          code: ''
        },
        fieldList: [
          {
            label: '地区',
            color: '#CDD8F7',
            key: 'area',
            type: 'cascader',
            className: 'shadow',
            checkStrictly: true,
            clearable: true,
            placeholder: '大区 / 区域 / 场区',
            customLabel: 'title',
            customValue: 'value',
            width: '250',
            options: [
            ]
          },
          {
            label: '设备类型',
            key: 'type',
            type: 'select',
            customLabel: 'equiptype_name',
            customValue: 'id',
            props: {
              label: 'equiptype_name',
              value: 'id'
            },
            className: 'shadow',
            placeholder: '设备类型',
            list: 'typeList'
          },
          {
            label: '设备型号',
            key: 'code',
            type: 'select',
            customLabel: 'version_name',
            customValue: 'id',
            props: {
              label: 'version_name',
              value: 'id'
            },
            className: 'shadow',
            placeholder: '请输入设备型号',
            required: true,
            list: 'codeList'

          }
        ]
      },

      navFormInfo: {
        labelWidth: '100px',
        data: {
        },
        fieldList: {
          left: {
          },
          right: {
            rightStyle: {
              flexDirection: 'row-reverse',
              width: '100%'
            }
          }
        }
      }
    }
  },
  watch: {
    'formInfo.data.type': {
      handler: function(newVal) {
        if (newVal === '') {
          this.listTypeInfo.codeList = []
          this.formInfo.data.code = ''
          return
        }
        this.$httpRequest({
          type: 'post',
          payload: { status: 2,
            equiptype_id: newVal },
          uri: pageElement && pageElement.getEquipmentVersion && pageElement.getEquipmentVersion.uri,
          callback: data => {
            if (data.status === 200) {
              this.formInfo.data.code = ''
              this.listTypeInfo.codeList = data.data
            }
          }
        })
      },
      deep: true
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    exportHandle() {
      const pageElement = getConfigElement('myEvcRuntimeArgs')
      const url = pageElement && pageElement.export && pageElement.export.uri
      const json = {
        regionId: this.formInfo.data.area[0] || '',
        areaId: this.formInfo.data.area[1] || '',
        fieldId: this.formInfo.data.area[2] || '',
        deviceVersionId: this.formInfo.data.code || '',
        equiptypeId: this.formInfo.data.type || ''
      }
      if (json.regionId === '') {
        this.$message.error('请选择地区')
        return
      }
      if (json.equiptypeId === '') {
        this.$message.error('请选择设备类型')
        return
      }
      if (json.deviceVersionId === '') {
        this.$message.error('请选择设备型号')
        return
      }
      for (const name in json) {
        if (!json[name]) {
          delete json[name]
        }
      }
      this.$httpExport({
        uri: url,
        payload: json
      })
    },
    // 默认选中
    defaultValueMe(arr) {
      if (!arr) {
        return
      }
      this.defaultValue.push(arr[0].regionNum)
      if (arr[0].children) {
        this.defaultValueMe(arr[0].children)
      }
    },
    async getSelect() {
      // unit-evcDataInterface:getEquipmentType
      this.$httpRequest({
        type: 'post',
        payload: { belong_business_id: '7mtFvgDzS6IsLh41WHjDcS',
          status: 2 },
        uri: pageElement && pageElement.getEquipmentType && pageElement.getEquipmentType.uri,
        callback: data => {
          if (data.status === 200) {
            this.listTypeInfo.typeList = data.data
          }
        }
      })
      this.$httpRequest({
        type: 'GET',
        payload: { isBuilding: false },
        uri: pageElement && pageElement.getRegionAreaFieldTree && pageElement.getRegionAreaFieldTree.uri,
        callback: data => {
          if (data.status === 200) {
            this.formInfo.fieldList[0].options = data.data
          }
        }
      })
    }
  }
}
</script>
<style scoped>
/* .exportBg >>> .el-form-item__label{
    color: #CDD8F7!important;
} */
</style>
<style lang="scss" scoped>
.btn-box {
    text-align: right;
    cursor: pointer;
}

.computer{
  width: 94px!important;
  height: 77px!important;
}
.exportBg {
  width: 100%;
  // height: 100%;
  height: calc(100vh - 128px);
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  @include background_color("durationBackgroundColor");
}
.export {
  width: 50%;
  height: 531px;
  margin-top: -50px;
  margin-left: -50px;
  border: 1px solid transparent;
  @include border_color('exportBorderColor');
}
.computed {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.exportSearch {
  width: 80%;
  height: 60%;
  margin: 0 auto;
}
</style>
