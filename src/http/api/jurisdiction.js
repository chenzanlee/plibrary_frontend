import request from '@/http/http'

// 用户权限信息
export function getUserFrontInfo(data) {
  let d = {
    method: 'get'
  }
  if (data.frontAppCode !== 'all') {
    d = {
      method: 'get',
      headers: {
        frontAppCode: data.frontAppCode
      }
    }
  }
  return request(`/api/admin/user/front/info`, d)
}

// 获取角色类型 - 信息（获取groupType）
export function getGroupTypeId(data) {
  // const appcode = localStorage.appcode ? `?appCode=${localStorage.appcode}` : ''
  return request(`/api/admin/groupType/all`, {
    method: 'get',
    params: data
  })
}

/** ***********************查询列表******************************** */

// 权限列表树 -
// 按角色查询时添加name字段
// name 用 encodeURI(name)编码  decodeURI(name)解码
export function getGroupTree(data) {
  return request('/api/admin/group/tree', {
    method: 'get',
    params: data
  })
}
// 按用户名查询
export function userGetGroupTree(data) {
  return request('/api/admin/group/treeByUserName', {
    method: 'get',
    params: data
  })
}

/** ***********************修改编辑列表******************************** */

// 查询单一列表详情（查询：data为空）
export function getGroupInfo(data, id) {
  return request(`/api/admin/group/${id}`, {
    method: 'get',
    params: data
  })
}
// 编辑更新列表（更新：data为更新数据）
export function getEditGroupInfo(data, id) {
  return request(`/api/admin/group/${id}`, {
    method: 'put',
    data: data
  })
}
// 删除列表
export function getDeleteGroupInfo(data, id) {
  return request(`/api/admin/group/${id}`, {
    method: 'delete',
    params: data
  })
}

// 新增列表
export function getAddGroupInfo(data) {
  return request(`/api/admin/group`, {
    method: 'post',
    data: data
  })
}
// 获取编辑权限
export function getEditMenu(data, id) {
  return request(`/api/admin/menu/${id}`, {
    method: 'get',
    params: data
  })
}

/** ********************************分配权限***************************************** */

// 获取菜单列表已有权限
export function getMenuList(data, id) {
  return request(`/api/admin/group/${id}/authority/menu`, {
    method: 'get',
    params: data
  })

  // appCode: unit-evc
}
// 资源列表
export function getResourcesList(data) {
  return request(`/api/admin/element/list`, {
    method: 'get',
    params: data
  })
}
// 权限用户id
export function getJurisdictionIDList(data, id) {
  return request(`/api/admin/group/${id}/authority/element`, {
    method: 'get',
    params: data
  })
  // appCode: unit-evc
}
// 保存菜单
export function preservationMenuList(data, id) {
  return request(`/api/admin/group/${id}/authority/menu`, {
    method: 'post',
    data: data
  })
}

// 保存资源
export function preservationResourcesList(data, id) {
  return request(`/api/admin/group/${id}/authority/element/update`, {
    method: 'post',
    data: data
  })
}

/** ********************************分配用户***************************************** */

// 未关联用户列表 - 查询添加keyword的值
export function notRelation(data) {
  return request(`/api/admin/user/notLinkedList`, {
    method: 'get',
    params: data
  })
}
// 已关联用户 - 查询添加keyword的值
export function alreadyRelation(data) {
  return request(`/api/admin/group/getGroupUsers`, {
    method: 'get',
    params: data
  })
}
// 增加关联列表
export function addRelation(data) {
  return request(`/api/admin/group/addGroupUsers`, {
    method: 'post',
    data: data
  })
}
// 移除关联列表
export function deleteRelation(data) {
  return request(`/api/admin/group/delGroupUsers`, {
    method: 'delete',
    data: data
  })
}

/** ******************************用户权限反查****************************************** */
// 用户反侦察 - 查询
export function userDataAuthList(data) {
  return request(`/api/unit_evc/myBaseInfo/dataAuth/listUser`, {
    method: 'get',
    params: data
  })
}

// 数据权限列表
export function getDataPermissionList(data) {
  return request(`/api/admin/dataAuth/user/pageList`, {
    method: 'get',
    params: data
  })
}
// 全部数据列表
export function getDataMenuListTree(data) {
  return request('/api/admin/dataAuth/' + data.appCode, {
    method: 'get'
    // params: data
  })
  // appCode: unit-evc
}
// 巡检树
export function getBarMenuListTree(data) {
  return request('/api/admin/dataAuth/tree/barpatrol', {
    method: 'get'
    // params: data
  })
  // appCode: unit-evc
}
export function getDataMenu(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2?isBuilding=false', {
    method: 'get',
    params: data.appCode
  })
}
// 已有数据列表
export function getDataDefaultMenuList(data) {
  return request('/api/admin/dataAuth/user/get/' + data.appCode + '/' + data.id, {
    method: 'get'
    // params: data
  })
  // appCode: unit-evc
}
// 保存用户数据列表
export function saveDataMenuList(data) {
  return request('/api/admin/dataAuth/user/updateList', {
    method: 'post',
    data: data
  })
}
