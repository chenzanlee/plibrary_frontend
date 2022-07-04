---
title:tableForm

---

介绍 searchForm封装组件的使用，包括子组件参数，父组件参数的使用。

## API

### tableForm

参数 | 说明 | 类型 | 默认值
----|------|-----|------
model | 用于form表单的数据绑定 | Object | -
ref | 绑定Dom元素用于获取数据值 | String | -
item.type | 选择使用哪个文本 | 'text', 'textarea', 'number', 'email' ,'select','radio','cascader'

上述组件如有不明白请查看使用案例

### button参数
参数 | 说明 | 类型 | 默认值
----|------|-----|------
class | 用于封装样式的展示 | 'btn-blue','btn-red','btn-border' | -
size | 用于显示按钮的大小 | '90','72','60','auto'| -

上述组件如有不明白请查看使用案例

### 父组件引用

参数 | 说明 | 类型 | 默认值
----|------|-----|------
formConfig | from表单配置文件 | Object | -
formItemList | 表单输入框的配置，详细请看使用案例 | Array | -
operate | 表单按钮的配置，详细请看使用案例 | Array | -

上述组件如有不明白请查看使用案例


上述按钮属于自己封装不影响element的按钮使用，支持全部属性配置，from表单支持element组件中的全部属性可以自行配置

