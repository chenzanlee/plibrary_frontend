---
title:table
---


## API

### table

参数 | 说明 | 类型 | 默认值
----|------|-----|------
dataSource | table内容数据 | Array | -
options | 表格参数控制 maxHeight、stripe 等等... | columns | 表头 | Array | -
fetch | 获取数据的函数 | (err, values) => void | -
pagination | 分页，不传则不显示 | Object | -

### table方法

方法名 | 说明 | 参数
----|------|-----
handleRowClick | 点击当前行 | scope.row, scope.$index, scope
handleSelectionChange | 点击选择按钮 |scope.row, scope.$index, scope
addRow | 行内添加的方法 |scope.row, scope.$index, scope
removeRow | 行内删除的方法 |scope.row, scope.$index, scope
editRow | 行内编辑的方法 |scope.row, scope.$index, scope
seeRow | 行内查看的方法 |scope.row, scope.$index, scope

### pagination

参数 | 说明 | 类型 | 默认值
----|------|-----|------
layout | 分页器配置显示详细请查看element组件库 | String | -
background | 分页器的背景颜色配置  | - | -
total | 配置分页器显示总 | Number | -

### pagination方法

方法名 | 说明 | 参数
----|------|-----
handleSizeChange | 每页显示几条数据触发 | Number
handleIndexChange | 点击分页按钮（数字页，前后页） |Number



以上组件二次封装配置说明如不理解请查看实际案例或了解element组件库

