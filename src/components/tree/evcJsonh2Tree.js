import { parse } from './jsonh.js'
// 此方法用于环控jsonh转为权限tree
export function evcJsonh2Tree(res) {
  // 如果data为空对象则返回空数组
  if (res == null) {
    return []
  }
  // 拼接成parse所需字符串
  const source = res.units
  let dest = '[' + source[0] + ','
  source.forEach((item, index) => {
    if (index > 0) {
      dest = dest + '\"' + item + '",'
    }
  })
  dest = dest.slice(0, dest.lastIndexOf(',')) + ']'
  // 获取单元权限树
  const units = parse(dest)
  // region
  const regionMap = res.regionMap
  // area
  const areaIdMap = res.areaIdMap
  const areaNameMap = res.areaNameMap
  // field
  const fieldIdMap = res.fieldIdMap
  const fieldNameMap = res.fieldNameMap
  // segment
  const segmentIdMap = res.segmentIdMap
  const segmentNameMap = res.segmentNameMap
  // roomType
  const roomTypeIdMap = res.roomTypeIdMap
  const roomTypeNameMap = res.roomTypeNameMap
  // 楼房猪舍相关
  const blockNameMap = res.blockNameMap
  const blockDescMap = res.blockDescMap
  const floorMap = res.floorMap
  // 构建树结构
  const treeArray = []
  units.forEach((item, index) => {
    const regionId = item.regionId
    const regionName = regionMap[regionId]
    const areaId = areaIdMap[item.areaId]
    const areaName = areaNameMap[item.areaId]
    const fieldId = fieldIdMap[item.fieldId]
    const fieldName = fieldNameMap[item.fieldId]
    const segmentId = segmentIdMap[item.segmentId]
    const segmentName = segmentNameMap[item.segmentId]
    const roomTypeId = roomTypeIdMap[item.roomTypeId]
    const roomTypeName = roomTypeNameMap[item.roomTypeId]
    const unitId = item.id
    const unitName = item.unit
    const block = item.block
    const floor = item.floor
    // 大区
    let regionNode = {}
    for (let rindex = 0; rindex < treeArray.length; rindex++) {
      if (treeArray[rindex].value === regionId) {
        regionNode = treeArray[rindex]
      }
    }
    if (!regionNode.nodeClazz) {
      regionNode.nodeClazz = 'region'
      regionNode.key = regionId
      regionNode.parentId = '-1'
      regionNode.value = regionId
      regionNode.title = regionName
      regionNode.attributes = {}
      regionNode.children = []
      treeArray.push(regionNode)
    }
    // 区域
    let areaNode = {}
    const areaNodeArray = regionNode.children
    for (let rindex = 0; rindex < areaNodeArray.length; rindex++) {
      if (areaNodeArray[rindex].value === areaId) {
        areaNode = areaNodeArray[rindex]
      }
    }
    if (!areaNode.nodeClazz) {
      areaNode.nodeClazz = 'area'
      areaNode.key = areaId
      areaNode.parentId = regionNode.key
      areaNode.value = areaId
      areaNode.title = areaName
      areaNode.attributes = {}
      areaNode.children = []
      regionNode.children.push(areaNode)
    }
    // 厂区
    let fieldNode = {}
    const fieldNodeArray = areaNode.children
    for (let rindex = 0; rindex < fieldNodeArray.length; rindex++) {
      if (fieldNodeArray[rindex].value === fieldId) {
        fieldNode = fieldNodeArray[rindex]
      }
    }
    if (!fieldNode.nodeClazz) {
      fieldNode.nodeClazz = 'field'
      fieldNode.key = fieldId
      fieldNode.parentId = areaNode.key
      fieldNode.value = fieldId
      fieldNode.title = fieldName
      fieldNode.attributes = {}
      fieldNode.children = []
      areaNode.children.push(fieldNode)
    }
    // 兼容楼房猪舍 和 平房猪舍
    let roomTypeNode = {}
    if (block === '') {
      // 平房猪舍
      const roomTypeNodeArray = fieldNode.children
      for (let rindex = 0; rindex < roomTypeNodeArray.length; rindex++) {
        if (roomTypeNodeArray[rindex].value === roomTypeId) {
          roomTypeNode = roomTypeNodeArray[rindex]
        }
      }
      if (!roomTypeNode.nodeClazz) {
        roomTypeNode.nodeClazz = 'roomType'
        roomTypeNode.key = fieldId + '_' + roomTypeId
        roomTypeNode.parentId = fieldNode.key
        // 唯一处理
        roomTypeNode.value = roomTypeId
        roomTypeNode.title = roomTypeName
        roomTypeNode.attributes = {}
        roomTypeNode.children = []
        fieldNode.children.push(roomTypeNode)
      }
    } else {
      // 楼房猪舍  多一个block节点
      let blockNode = {}
      const blockNodeArray = fieldNode.children
      for (let rindex = 0; rindex < blockNodeArray.length; rindex++) {
        if (blockNodeArray[rindex].value === blockNameMap[block]) {
          blockNode = blockNodeArray[rindex]
        }
      }
      if (!blockNode.nodeClazz) {
        blockNode.nodeClazz = 'block'
        blockNode.key = fieldId + '_' + block
        blockNode.parentId = fieldNode.key
        blockNode.value = blockNameMap[block]
        blockNode.title = blockDescMap[block]
        blockNode.attributes = {}
        blockNode.children = []
        fieldNode.children.push(blockNode)
      }

      const roomTypeNodeArray = blockNode.children
      for (let rindex = 0; rindex < roomTypeNodeArray.length; rindex++) {
        if (roomTypeNodeArray[rindex].value === roomTypeId) {
          roomTypeNode = roomTypeNodeArray[rindex]
        }
      }
      if (!roomTypeNode.nodeClazz) {
        roomTypeNode.nodeClazz = 'roomType'
        roomTypeNode.key = fieldId + '_' + block + '_' + roomTypeId
        roomTypeNode.parentId = blockNode.key
        // 唯一处理
        roomTypeNode.value = roomTypeId
        roomTypeNode.title = roomTypeName
        roomTypeNode.attributes = {}
        roomTypeNode.children = []
        blockNode.children.push(roomTypeNode)
      }
    }
    // 单元编号
    const unitNode = {}
    unitNode.nodeClazz = 'unit'
    unitNode.key = unitId
    unitNode.parentId = roomTypeNode.key
    unitNode.value = unitId
    unitNode.title = unitName
    unitNode.attributes = {}
    unitNode.attributes.segmentId = segmentId
    if (floor === '') {
      unitNode.attributes.floor = null
    } else {
      unitNode.attributes.floor = floorMap[floor]
    }
    unitNode.attributes.segmentName = segmentName
    // unitNode.children = [];
    roomTypeNode.children.push(unitNode)
  })
  return treeArray
}
// 此方法用于物联网jsonh转为权限tree,展示视角为工段
export function wlwJsonh2Tree(res) {
  // 如果data为空对象则返回空数组
  if (res == null) {
    return []
  }
  // 拼接成parse所需字符串
  const source = res.units
  let dest = '[' + source[0] + ','
  source.forEach((item, index) => {
    if (index > 0) {
      dest = dest + '\"' + item + '",'
    }
  })
  dest = dest.slice(0, dest.lastIndexOf(',')) + ']'
  // 获取单元权限树
  const units = parse(dest)
  // region
  const regionMap = res.regionMap
  // area
  const areaIdMap = res.areaIdMap
  const areaNameMap = res.areaNameMap
  // field
  const fieldIdMap = res.fieldIdMap
  const fieldNameMap = res.fieldNameMap
  // segment
  const segmentIdMap = res.segmentIdMap
  const segmentNameMap = res.segmentNameMap
  // roomType
  const roomTypeIdMap = res.roomTypeIdMap
  const roomTypeNameMap = res.roomTypeNameMap
  // 楼房猪舍相关
  const blockNameMap = res.blockNameMap
  const blockDescMap = res.blockDescMap
  const floorMap = res.floorMap
  // 构建树结构
  const treeArray = []
  units.forEach((item, index) => {
    const regionId = item.regionId
    const regionName = regionMap[regionId]
    const areaId = areaIdMap[item.areaId]
    const areaName = areaNameMap[item.areaId]
    const fieldId = fieldIdMap[item.fieldId]
    const fieldName = fieldNameMap[item.fieldId]
    const segmentId = segmentIdMap[item.segmentId]
    const segmentName = segmentNameMap[item.segmentId]
    const roomTypeId = roomTypeIdMap[item.roomTypeId]
    const roomTypeName = roomTypeNameMap[item.roomTypeId]
    const unitId = item.id
    const unitName = item.unit
    const block = item.block
    const floor = item.floor
    // 大区
    let regionNode = {}
    for (let rindex = 0; rindex < treeArray.length; rindex++) {
      if (treeArray[rindex].value === regionId) {
        regionNode = treeArray[rindex]
      }
    }
    if (!regionNode.nodeClazz) {
      regionNode.nodeClazz = 'region'
      regionNode.key = regionId
      regionNode.parentId = '-1'
      regionNode.value = regionId
      regionNode.title = regionName
      regionNode.attributes = {}
      regionNode.children = []
      treeArray.push(regionNode)
    }
    // 区域
    let areaNode = {}
    const areaNodeArray = regionNode.children
    for (let rindex = 0; rindex < areaNodeArray.length; rindex++) {
      if (areaNodeArray[rindex].value === areaId) {
        areaNode = areaNodeArray[rindex]
      }
    }
    if (!areaNode.nodeClazz) {
      areaNode.nodeClazz = 'area'
      areaNode.key = areaId
      areaNode.parentId = regionNode.key
      areaNode.value = areaId
      areaNode.title = areaName
      areaNode.attributes = {}
      areaNode.children = []
      regionNode.children.push(areaNode)
    }
    // 厂区
    let fieldNode = {}
    const fieldNodeArray = areaNode.children
    for (let rindex = 0; rindex < fieldNodeArray.length; rindex++) {
      if (fieldNodeArray[rindex].value === fieldId) {
        fieldNode = fieldNodeArray[rindex]
      }
    }
    if (!fieldNode.nodeClazz) {
      fieldNode.nodeClazz = 'field'
      fieldNode.key = fieldId
      fieldNode.parentId = areaNode.key
      fieldNode.value = fieldId
      fieldNode.title = fieldName
      fieldNode.attributes = {}
      fieldNode.children = []
      areaNode.children.push(fieldNode)
    }
    // 兼容楼房猪舍 和 平房猪舍
    let segmentNode = {}
    if (block === '') {
      // 平房猪舍
      const segmentNodeArray = fieldNode.children
      for (let rindex = 0; rindex < segmentNodeArray.length; rindex++) {
        if (segmentNodeArray[rindex].value === segmentId) {
          segmentNode = segmentNodeArray[rindex]
        }
      }
      if (!segmentNode.nodeClazz) {
        segmentNode.nodeClazz = 'segment'
        segmentNode.key = fieldId + '_' + segmentId
        segmentNode.parentId = fieldNode.key
        // 唯一处理
        segmentNode.value = segmentId
        segmentNode.title = segmentName
        segmentNode.attributes = {}
        segmentNode.children = []
        fieldNode.children.push(segmentNode)
      }
    } else {
      // 楼房猪舍  多一个block节点
      let blockNode = {}
      const blockNodeArray = fieldNode.children
      for (let rindex = 0; rindex < blockNodeArray.length; rindex++) {
        if (blockNodeArray[rindex].value === blockNameMap[block]) {
          blockNode = blockNodeArray[rindex]
        }
      }
      if (!blockNode.nodeClazz) {
        blockNode.nodeClazz = 'block'
        blockNode.key = fieldId + '_' + block
        blockNode.parentId = fieldNode.key
        blockNode.value = blockNameMap[block]
        blockNode.title = blockDescMap[block]
        blockNode.attributes = {}
        blockNode.children = []
        fieldNode.children.push(blockNode)
      }

      const segmentNodeArray = blockNode.children
      for (let rindex = 0; rindex < segmentNodeArray.length; rindex++) {
        if (segmentNodeArray[rindex].value === segmentId) {
          segmentNode = segmentNodeArray[rindex]
        }
      }
      if (!segmentNode.nodeClazz) {
        segmentNode.nodeClazz = 'segment'
        segmentNode.key = fieldId + '_' + block + '_' + segmentId
        segmentNode.parentId = blockNode.key
        // 唯一处理
        segmentNode.value = segmentId
        segmentNode.title = segmentName
        segmentNode.attributes = {}
        segmentNode.children = []
        blockNode.children.push(segmentNode)
      }
    }
    // 单元编号
    const unitNode = {}
    unitNode.nodeClazz = 'unit'
    unitNode.key = unitId
    unitNode.parentId = segmentNode.key
    unitNode.value = unitId
    unitNode.title = unitName
    unitNode.attributes = {}
    unitNode.attributes.roomTypeId = roomTypeId
    if (floor === '') {
      unitNode.attributes.floor = null
    } else {
      unitNode.attributes.floor = floorMap[floor]
    }
    unitNode.attributes.roomTypeName = roomTypeName
    // unitNode.children = [];
    segmentNode.children.push(unitNode)
  })
  return treeArray
}
