import request from '@/http/http'

// 菜单管理-要素列表
export function getElementList(data) {
  return request('/api/admin/element/list', {
    method: 'get',
    params: data
  })
}
// 全部菜单列表
export function getMenuList(data) {
  return request('/api/admin/user/front/menus', {
    method: 'get',
    // params: data
    headers: {
      frontAppCode: data.frontAppCode
    }
  })
}
// 环控菜单列表
export function getMenuListTree(data) {
  return request('/api/admin/menu/tree', {
    method: 'get',
    params: data
  })
}

// 新增菜单列表
export function addMentList(data) {
  return request('/api/admin/menu/v1', {
    method: 'post',
    data: data
  })

  // appCode: "unit-evc"
  // code: "aa-dd"
  // description: "我是测试菜单"
  // icon: "unlock"
  // orderNum: "3"
  // parentId: "3WpXLdWtss9bDS0qtk6EFb"
  // title: "测试菜单"
  // type: "menu"
}
// 获取菜单详情
export function getAdminMenu(data) {
  return request('/api/admin/menu/' + data, {
    method: 'get'
  })
}
// 编辑菜单列表
export function editMentList(data) {
  return request('/api/admin/menu/' + data.id, {
    method: 'put',
    data: data
  })

//     appCode: "unit-evc"
// attr1: null
// code: "unit-evcMenuManager"
// crtHost: "10.108.218.90"
// crtName: "焦一伦"
// crtTime: "2019-06-11 18:57:50"
// crtUser: "22OPyP1CXXMpDT8pR2T8jF"
// description: ""
// href: "/admin/menu/unit-evc"
// icon: "tags-o"
// id: "5nlSfLpbZmlVzpHWdOzkJR"
// level: null
// menuType: "EXTENSION"
// orderNum: 1
// parentId: "3WpXLdWtss9bDS0qtk6EFb"
// path: "/adminSys/baseManager/menuManager"
// require: true
// status: "NORMAL"
// title: "菜单管理test"
// type: "menu"
// updHost: "10.108.218.90"
// updName: "焦一伦"
// updTime: "2019-06-11 18:57:50"
// updUser: "22OPyP1CXXMpDT8pR2T8jF"
// url: null
}
// 删除菜单列表
export function deleteMentList(data) {
  return request('/api/admin/menu/remove', {
    method: 'DELETE',
    data: data
  })

  // id: "5d7HzCbVtdySc5P0feXpu6"
}

// 新增菜单要素列表
export function addMentElementList(data) {
  return request('/api/admin/element/v1', {
    method: 'post',
    data: data
  })
// post
// appCode: "unit-evc"
// code: "unit-evcbiz:unit-evcLoginManager:aa-dd"
// menuId: "5Vcq9wmcrBB5vzVjBGoQvj"
// method: "GET"
// name: "测试资源"
// type: "URI"
// uri: "src/views/fieldasdad/infos"
}
// 编辑菜单要素列表
export function editMentElementList(data, url) {
  // /api/admin/element/5iNSvfkP22LxG6qjfNJu3Z
  const urls = `/api/admin/element/${url}`
  return request(urls, {
    method: 'put',
    data: data
  })
  // put
  //     appCode: "unit-evc"
  // code: "unit-evcbiz:unit-evcLoginTest:info"
  // id: "5iNSvfkP22LxG6qjfNJu3Z"
  // menuId: "5Vcq9wmcrBB5vzVjBGoQvj"
  // method: "GET"
  // name: "测试资源"
  // type: "URI"
  // uri: "src/views/fieldasdad/infos"
}
// 删除菜单要素列表
export function deleteMentElementList(data, url) {
  // /api/admin/element/5iNSvfkP22LxG6qjfNJu3Z
  const urls = `/api/admin/element/${url}`
  return request(urls, {
    method: 'delete',
    params: {}
  })
  // 只需要改变请求方式为 DELETE
  // 无参数
}
// 数据接口
export function getDataInterface(data) {
  return request('/api/admin/dataInterface/getDataInterface', {
    method: 'post',
    data: data
  })
// code: "unit-evc"
// id: ""
// limit: 20
// page: 1
// status: ""
}

// // 查询数据接口
// export  function getDataInterface(data) {
//     return request('/api/admin/dataInterface/getDataInterface', {
//         method: 'post',
//         data: data
//     });
// // code: "unit-evc"
// // limit: 20
// // page: 1
// // title: "查询的名字"
// }

// 查询角色

// id: "2cnZOC7tbYXMf6R1alMrns"
// menu_id: "4YW2FAhuwOPBVJwYXQmj4N"
// crt_user: "7fxXr3xjqORHE18nWZQFc0"
// 3yHM85PDxhRIHQqx2k7yFx
export function getGroup(data) {
  return request('/api/admin/dataInterface/getGroup', {
    method: 'post',
    data: data
  })
// elementId: "7MjepdGwXgBDwmryDPSLaG"
// limit: 20
// page: 1
// keyword: "输入框内容"
}
// 查询人员
export function getPerson(data) {
  return request('/api/admin/dataInterface/getPerson', {
    method: 'post',
    data: data
  })
//     elementId: "7MjepdGwXgBDwmryDPSLaG"
// keyword: ""
// limit: 20
// page: 1
}

// 、、查询用户目前使用的页面风格
export function getFontType(data) {
  return request('/api/admin/user/front/fontType/getFontType', {
    method: 'get',
    params: data
  })
}

// 更新风格
export function updateFontType(data) {
  return request('/api/admin/user/front/fontType/update', {
    method: 'post',
    data: data
  })
}
