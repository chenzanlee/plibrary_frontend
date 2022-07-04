---
title:button

---

介绍 searchForm封装组件的使用，包括子组件参数，父组件参数的使用。

## API

### button

参数 | 说明 | 类型 | 默认值
----|------|-----|------
btnList | button列表数组 | array | -
class | 用于封装样式的展示 | 'btn-blue','btn-red','btn-border' | -
size | 用于显示按钮的大小 | '90','72','60','auto'| -
event | 方法(导出，批量删除，批量审核，批量反审核，批量配置) | 'export','removes','shenhe','fanshenhe','piliangpeizhi'


上述组件如有不明白请查看使用案例

### 父组件引用

参数 | 说明 | 类型 | 默认值
----|------|-----|------
:btnList | button配置文件 | Array | -
:selection | 多选择参数 | Array | -
@btn-ext | 导出方法 | function | -
@btn-removes | 删除方法 | function | -
@btn-shenhe | 审核方法 | function | -
@btn-fanshenhe | 反审核方法 | function | -
@btn-piliangpeizhi | 批量配置方法 | function | -

上述组件如有不明白请查看使用案例


上述按钮属于自己封装不影响element的按钮使用，支持全部属性配置，from表单支持element组件中的全部属性可以自行配置

