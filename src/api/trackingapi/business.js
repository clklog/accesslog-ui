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