import request from '@/http/http'
import { stringify } from 'query-string'
export async function postAPI(params, url) {
  return request(`/api${url}`, {
    method: 'POST',
    data: params
  })
}

export async function getAPI(params, url) {
  return request(`/api${url}`, {
    method: 'GET',
    params: params
  })
}
export async function postUrlAPI(params, url) {
  return request(`/api${url}?${stringify(params)}`, {
    method: 'POST',
    data: params
  })
}
