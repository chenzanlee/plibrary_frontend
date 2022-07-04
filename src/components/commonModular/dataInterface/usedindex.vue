<template>
  <div>
    <!-- childRules定义的父节点 -->
    <!-- formConfig配置form表单要显示的文本框或者别的框信息 -->
    <!-- form 获取每个框的信息 -->
    <!-- rules 配置框的验证信息跟提示消息 -->
    <flight-form
      ref="childRules"
      :form-config="formConfig"
    />
  </div>
</template>
<script>
import flightForm from '@/components/ElementComponent/tableForm'
export default {
  components: {
    flightForm
  },
  data() {
    return {
      // 配置from表单的显示
      formConfig: {
        // 显示选项配置
        formItemList: [
          {
            type: 'text',
            model: 'airport',
            prop: 'airport',
            label: '站点',
            name: 'airport',
            placeholder: '请输入站点',
            rules: [{ required: true, message: '请输入站点', trigger: 'blur' }]
          },
          {
            type: 'select',
            model: 'importOrExport',
            prop: 'importOrExport',
            label: '进出港',
            name: 'importOrExport',
            placeholder: '请输入进出港',
            rules: [
              { required: true, message: '请输入进出港', trigger: 'blur' }
            ],
            optList: [
              {
                value: '',
                label: ''
              },
              {
                value: '进港',
                label: '进港'
              },
              {
                value: '出港',
                label: '出港'
              }
            ]
          },
          {
            type: 'select',
            model: 'mainOrSubBill',
            prop: 'mainOrSubBill',
            name: 'mainOrSubBill',
            label: '主分单',
            placeholder: '请输入主分单',
            rules: [
              { required: true, message: '请输入主分单', trigger: 'blur' }
            ],
            optList: [
              {
                value: '自定义',
                label: '自定义'
              },
              {
                value: '主分',
                label: '主分'
              },
              {
                value: '主单',
                label: '主单'
              }
            ]
          },
          {
            type: 'text',
            model: 'largeClass',
            name: 'largeClass',
            prop: 'largeClass',
            label: '大类',
            placeholder: '请输入大类',
            rules: [
              { required: true, message: '请输入大类', trigger: 'blur' }
            ]
          },
          {
            type: 'select',
            model: 'isDomestic',
            name: 'isDomestic',
            prop: 'isDomestic',
            value: '国内',
            label: '国内/国际',
            placeholder: '请输入国内/国际',
            rules: [
              { required: true, message: '请输入国内/国际', trigger: 'blur' }
            ],
            optList: [
              {
                value: '',
                label: ''
              },
              {
                value: '国内',
                label: '国内'
              },
              {
                value: '国际',
                label: '国际'
              }
            ]
          },
          {
            type: 'cascader',
            model: 'cascader',
            name: 'cascader',
            prop: 'cascader',
            label: '级联选择器',
            placeholder: '请选择级联选择器',
            optList: [{
              value: 'zhinan',
              label: '指南',
              children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                children: [{
                  value: 'yizhi',
                  label: '一致'
                }, {
                  value: 'fankui',
                  label: '反馈'
                }, {
                  value: 'xiaolv',
                  label: '效率'
                }, {
                  value: 'kekong',
                  label: '可控'
                }]
              }, {
                value: 'daohang',
                label: '导航',
                children: [{
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                }, {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }]
              }]
            }, {
              value: 'zujian',
              label: '组件',
              children: [{
                value: 'basic',
                label: 'Basic',
                children: [{
                  value: 'layout',
                  label: 'Layout 布局'
                }, {
                  value: 'color',
                  label: 'Color 色彩'
                }, {
                  value: 'typography',
                  label: 'Typography 字体'
                }, {
                  value: 'icon',
                  label: 'Icon 图标'
                }, {
                  value: 'button',
                  label: 'Button 按钮'
                }]
              }, {
                value: 'form',
                label: 'Form',
                children: [{
                  value: 'radio',
                  label: 'Radio 单选框'
                }, {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                }, {
                  value: 'input',
                  label: 'Input 输入框'
                }, {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                }, {
                  value: 'select',
                  label: 'Select 选择器'
                }, {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                }, {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                }, {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                }, {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                }, {
                  value: 'upload',
                  label: 'Upload 上传'
                }, {
                  value: 'rate',
                  label: 'Rate 评分'
                }, {
                  value: 'form',
                  label: 'Form 表单'
                }]
              }, {
                value: 'data',
                label: 'Data',
                children: [{
                  value: 'table',
                  label: 'Table 表格'
                }, {
                  value: 'tag',
                  label: 'Tag 标签'
                }, {
                  value: 'progress',
                  label: 'Progress 进度条'
                }, {
                  value: 'tree',
                  label: 'Tree 树形控件'
                }, {
                  value: 'pagination',
                  label: 'Pagination 分页'
                }, {
                  value: 'badge',
                  label: 'Badge 标记'
                }]
              }, {
                value: 'notice',
                label: 'Notice',
                children: [{
                  value: 'alert',
                  label: 'Alert 警告'
                }, {
                  value: 'loading',
                  label: 'Loading 加载'
                }, {
                  value: 'message',
                  label: 'Message 消息提示'
                }, {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                }, {
                  value: 'notification',
                  label: 'Notification 通知'
                }]
              }, {
                value: 'navigation',
                label: 'Navigation',
                children: [{
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                }, {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                }, {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                }, {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                }, {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }]
              }, {
                value: 'others',
                label: 'Others',
                children: [{
                  value: 'dialog',
                  label: 'Dialog 对话框'
                }, {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                }, {
                  value: 'popover',
                  label: 'Popover 弹出框'
                }, {
                  value: 'card',
                  label: 'Card 卡片'
                }, {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                }, {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }]
              }]
            }, {
              value: 'ziyuan',
              label: '资源',
              children: [{
                value: 'axure',
                label: 'Axure Components'
              }, {
                value: 'sketch',
                label: 'Sketch Templates'
              }, {
                value: 'jiaohu',
                label: '组件交互文档'
              }]
            }]
          },
          {
            type: 'radio',
            model: 'radio',
            name: 'radio',
            prop: 'radio',
            label: '活动类型',
            optList: ['全部', '演唱会', '球赛'],
            rules: [
              { required: true, message: '请选择活动类型', trigger: 'blur' }
            ]
          }
        ],
        // 按钮配置项跟处理按钮事件名称的填写 type: "90" 表示宽度90的按钮 class:'btn-blue' 代表蓝色按钮以下同理
        operate: [
          {
            size: '90',
            class: 'btn-blue',
            name: '查询',
            handleClick: this.search
          },
          {
            size: '90',
            class: 'btn-border',
            name: '重置',
            handleClick: this.add
          }
        ]
      }
    }
  },
  methods: {
    // 查询
    search() {
      const returnValue = this.$refs['childRules'].validateForm()
      if (returnValue.flag) {
      }
    },
    // 新增或重置
    add() {
      this.$refs['childRules'].resetFields()
    }
    // 清空选项clearCheckedNodes(){}
  }
}
</script>
