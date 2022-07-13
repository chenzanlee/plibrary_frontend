import request from '@/http/http'

/**
 * 锁定
 * @param lockLibraryTransferReq
 * @param {string} lockLibraryTransferReq.recordId  记录id
 * @returns {AxiosPromise<any>|Promise<unknown>|Promise<AxiosResponse<any> | void>}
 */
export function lock(lockLibraryTransferReq) {
  return request('/libraryTransfer/lock', {
    method: 'PUT',
    params: lockLibraryTransferReq
  })
}

/**
 * 同意
 * @param {Object} approveLibraryTransferReq
 * @param {string} approveLibraryTransferReq.recordId  记录id
 * @returns {AxiosPromise<any>|Promise<unknown>|Promise<AxiosResponse<any> | void>}
 */
export function approve(approveLibraryTransferReq) {
  return request('/libraryTransfer/approve', {
    method: 'PUT',
    params: approveLibraryTransferReq
  })
}

/**
 * 驳回转让申请
 * @param {Object} rejectLibraryTransferReq
 * @param {string} rejectLibraryTransferReq.recordId   记录id
 * @param {string} rejectLibraryTransferReq.auditRemark  审核意见
 * @returns {AxiosPromise<any>|Promise<unknown>|Promise<AxiosResponse<any> | void>}
 */
export function reject(rejectLibraryTransferReq) {
  return request('/libraryTransfer/reject', {
    method: 'PUT',
    params: rejectLibraryTransferReq
  })
}

/**
 * 获取待审核的书馆转让申请
 * @param {} data
 * @returns {AxiosPromise<any>|Promise<unknown>|Promise<AxiosResponse<any> | void>}
 */
export function getWaitingAuditRecords(data) {
  return request('/libraryTransfer/getWaitingAuditRecords', {
    method: 'GET',
    data: data
  })
}

/**
 * 获取全部的书馆转让申请记录
 * @returns {AxiosPromise<any>|Promise<unknown>|Promise<AxiosResponse<any> | void>}
 */
export function list(data) {
  return request('/libraryTransfer/getList', {
    method: 'GET',
    data: data
  })
}
