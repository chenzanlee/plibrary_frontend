<template>
  <div>
    <div class="general-form">
      <general-form
        ref="ceshi"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :list-type-info="listTypeInfo"
        theme-type="default"
        @handleChange="handleChange"
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
      </general-form>
      <button class="btn-border" @click="aa">重置</button>
    </div>
    <div class="nav-form">
      <nav-form
        ref="ceshi"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
        @handleEvent="handleEvent"
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
</template>

<script>
import generalForm from '@/components/commonComponent/generalForm'
import navForm from '@/components/commonComponent/navForm'
export default {
  components: {
    generalForm,
    navForm
  },
  data() {
    return {
      // 相关列表
      listTypeInfo: {
        typeList: [
          { key: '角色1', value: 1 },
          { key: '角色2', value: 0 }
        ]
      },
      // 表单相关
      formInfo: {
        data: {
          name: '', // *名称
          num: '',
          checkbox: [],
          cascader: '',
          code: '', // 编码
          type: 1, // 类型
          sort: '', // 排序
          mullu: '11', // 目录
          desc: '' // 描述
        },
        fieldList: [
          {
            label: '名称',
            key: 'name',
            type: 'input',
            required: true,
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            // handleChange: (val) => {
            //   console.log('change数据', val)
            //   // this.selectedOption = val
            // },
          },
          {
            label: '数字',
            key: 'num',
            type: 'date',
            dateType: 'datetime'
          },
          {
            key: 'checkbox',
            type: 'checkbox',
            customLabel: 'name',
            customVal: 'val',
            list: [
              { name: '上海', val: '上海', disabled: true },
              { name: '北京', val: '北京' },
              { name: '广州', val: '广州' },
              { name: '深圳', val: '深圳' }
            ]
          },
          {
            value: 'cascader',
            type: 'cascader',
            className: 'shadow',
            placeholder: '333',
            customLabel: 'title',
            customValue: '',
            options: [
              {
                value: 'zhinan',
                title: '指南',
                children: [
                  {
                    value: 'shejiyuanze',
                    title: '设计原则',
                    children: [
                      {
                        value: 'yizhi',
                        label: '一致'
                      }
                    ]
                  },
                  {
                    value: 'daohang',
                    title: '导航',
                    children: [
                      {
                        value: 'cexiangdaohang',
                        title: '侧向导航'
                      },
                      {
                        value: 'dingbudaohang',
                        title: '顶部导航'
                      }
                    ]
                  }
                ]
              },
              {
                value: 'ziyuan',
                title: '资源',
                children: [
                  {
                    value: 'axure',
                    title: 'Axure Components'
                  },
                  {
                    value: 'sketch',
                    title: 'Sketch Templates'
                  },
                  {
                    value: 'jiaohu',
                    title: '组件交互文档'
                  }
                ]
              }
            ],
            handleChange: (val) => {
              console.log('cascader选择', val)
              // this.selectedOption = val
            }
          },
          {
            label: '编码',
            key: 'code',
            type: 'input',
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' }]
          },
          {
            label: '类型',
            key: 'type',
            type: 'select',
            list: 'typeList',
            required: true,
            rules: [{ required: true, message: '请选择类型', trigger: 'blur' }],
            handleChange: (val) => {
              console.log('select选择', val)
              // this.selectedOption = val
            }
          },
          { label: '排序', key: 'sort', type: 'input' },
          { label: '目录', key: 'mullu', type: 'slot' },
          {
            label: '描述',
            key: 'desc',
            type: 'textarea',
            resize: 'none',
            showWordLimit: true,
            maxlength: '200',
            className: 'el-form-block'
          }
        ]
      },

      // nav-form
      navFormInfo: {
        labelWidth: '100px',
        data: {
          name: '', // *名称
          float: '', // 数字类型
          cascader: '',
          code: '', // 编码
          type: 1, // 类型
          sort: '', // 排序
          mullu: '11', // 目录
          desc: '' // 描述
        },
        fieldList: {
          left: {
            inpLists: [
              {
                key: 'name',
                type: 'input',
                required: true,
                className: 'shadow',
                placeholder: '333'
              },
              {
                key: 'float',
                type: 'float',
                required: true,
                className: 'shadow',
                placeholder: '333'
              },
              { label: '目录', key: 'mullu', type: 'slot' },
              {
                type: 'button',
                innerText: '11',
                className: 'btn-blue',
                handleClick: () => {
                  console.log('111')
                  console.log(Object.keys(this.navFormInfo)[0])
                }
              },
              {
                key: 'name',
                type: 'radio',
                required: true,
                className: 'shadow',
                placeholder: '333',
                customLabel: 'name',
                customVal: 'val',
                optList: [
                  { name: '11', val: '222' },
                  { name: '11', val: '221' },
                  { name: '11', val: '224' }
                ]
              },
              {
                label: '类型',
                key: 'type',
                type: 'select',
                list: [
                  { key: '角色1', value: 1 },
                  { key: '角色2', value: 0 }
                ],
                required: true,
                rules: [
                  { required: true, message: '请选择类型', trigger: 'blur' }
                ],
                handleChange: (val) => {
                  // console.log('select选择',this, val)
                  // this.selectedOption = val
                }
              },
              {
                key: 'cascader',
                type: 'cascader',
                customLabel: 'title',
                customValue: '',
                className: 'shadow',
                // checkStrictly: true,
                placeholder: '333',
                options: [
                  {
                    value: 'zhinan',
                    title: '指南',
                    children: [
                      {
                        value: 'shejiyuanze',
                        title: '设计原则',
                        children: [
                          {
                            value: 'yizhi',
                            title: '一致'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    value: 'ziyuan',
                    title: '资源',
                    children: [
                      {
                        value: 'axure',
                        title: 'Axure Components'
                      }
                    ]
                  }
                ],
                handleChange: (val) => {
                  console.log('cascader选择', val)
                  // this.selectedOption = val
                }
              }
            ],
            btnLists: [
              {
                innerText: '11',
                className: 'btn-blue',
                handleClick: () => {
                  console.log('111')
                }
              }
            ]
          },
          right: {
            inpLists: [
              {
                key: 'cascader',
                type: 'cascader',
                customLabel: 'title',
                customValue: '',
                className: 'shadow',
                // checkStrictly: true,
                placeholder: '333',
                options: [
                  {
                    value: 'zhinan',
                    title: '指南',
                    children: [
                      {
                        value: 'shejiyuanze',
                        title: '设计原则',
                        children: [
                          {
                            value: 'yizhi',
                            title: '一致'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    value: 'ziyuan',
                    title: '资源',
                    children: [
                      {
                        value: 'axure',
                        title: 'Axure Components'
                      }
                    ]
                  }
                ],
                handleChange: (val) => {
                  console.log('cascader选择', val)
                  // this.selectedOption = val
                }
              }
            ],
            btnLists: [
              {
                innerText: '11',
                className: 'btn-blue',
                handleClick: () => {
                  console.log('111')
                }
              }
            ]
          }
        }
      }
    }
  },
  mounted() {
    //  this.initRules()
  },
  methods: {
    handleEvent(evnet, pathLabels, pathNodes) {
      console.log('触发的时间', evnet, pathLabels, pathNodes)
    },
    // handleChange(event) {
    //   console.log('change时间', event)
    // },
    handleChange(item, pathLabels, pathNodes) {
      console.log('输出达到', item, pathLabels, pathNodes)
    },
    aa() {
      this.$refs['ceshi'].resetFields()
      console.log(
        this.$refs['ceshi'],
        this.formInfo.data,
        this.navFormInfo.data
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-blue {
  width: 90px;
  font-size: var(--size16);
  height: 36px;
}
</style>
