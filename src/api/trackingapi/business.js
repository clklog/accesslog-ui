import request from '@/utils/request'


// 按业务环节事件统计
export function getEventListApi(params) {
  return request({
    url: '/accesslogapi/busilog/getEventList',
    method: 'post',
    data: params
  })
}
export function getSessionListApi(params) {
  return request({
    url: '/accesslogapi/busilog/getSessionListByWhoIdGroupBySessionId',
    method: 'post',
    data: params
  })
}
export function getSessionListByWhoIdApi(params) {
  return request({
    url: '/accesslogapi/busilog/getSessionListByWhoId',
    method: 'post',
    data: params
  })
}
export function getCountPropEventListApi(params) {
  return request({
    url: '/accesslogapi/busilog/getCountPropEventList',
    method: 'post',
    data: params
  })
}
export function getEventRawListApi(params) {
  return request({
    url: '/accesslogapi/busilog/getEventRawList',
    method: 'post',
    data: params
  })
}