import request from '@/utils/request'


// 按业务环节事件统计
export function getEventListApi(params) {
  return request({
    url: '/busilog/getEventList',
    method: 'post',
    data: params
  })
}
export function getSessionListApi(params) {
  return request({
    url: '/busilog/getSessionListByWhoIdGroupBySessionId',
    method: 'post',
    data: params
  })
}
export function getSessionListByWhoIdApi(params) {
  return request({
    url: '/busilog/getSessionListByWhoId',
    method: 'post',
    data: params
  })
}
export function getCountPropEventListApi(params) {
  return request({
    url: '/busilog/getCountPropEventList',
    method: 'post',
    data: params
  })
}
export function getEventRawListApi(params) {
  return request({
    url: '/busilog/getEventRawList',
    method: 'post',
    data: params
  })
}