---
title:navForm

---

介绍 navForm封装组件的使用，包括子组件参数，父组件参数的使用。

## API

### navForm

参数 | 说明 | 类型 | 默认值
----|------|-----|------
model | 用于form表单的数据绑定 | Object | -
ref | 绑定Dom元素用于获取数据值 | String | -
class | 定制form主题  | String | default
rules | 配置form的验证规则 | String | -
label-width | 配置form的label宽度 | String | 120px

上述组件如有不明白请查看使用案例

### navFormItem

参数 | 说明 | 类型 | 默认值
----|------|-----|------
fieldList | form表单内容部信息 | Array | -
label | label值 | String | -
class | 类名 | String | -
rules | 配置itenm验证规则 | String | -
style | 配置itenm内联样式 | String | -

上述组件如有不明白请查看使用案例

### 父组件引用

参数 | 说明 | 类型 | 默认值
----|------|-----|------
listTypeInfo | 存在下拉框时的配置列表 | Object | -
fieldList | 表单详细的配置，详细请看使用案例 | Array | -
data | 表单的绑定数据集合 | Object | -

上述组件如有不明白请查看使用案例


上述组件属于自己封装不影响element的按钮使用，支持全部属性配置，from表单支持element组件中的全部属性可以自行配置

