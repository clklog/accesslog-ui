import request from '@/utils/request'

// 按应用流量指标概览
export function getHostOverviewApi(params) {
  return request({
    // url: '/accesslog/getHostOverview',
    url: '/accesslogapi/getHostOverview',
    method: 'post',
    data: params
  })
}
// 指标概览
export function getOverviewApi(params) {
  return request({
    // url: '/accesslog/getOverview',
    url: '/accesslogapi/getOverview',
    method: 'post',
    data: params
  })
}
//性能分析
export function getPerformanceDetailApi(params) {
  return request({
    url: '/accesslogapi/getPerformanceDetail',
    method: 'post',
    data: params
  })
}
//状态码分析
export function getStatusApi(params) {
  return request({
    url: '/accesslogapi/getStatus',
    method: 'post',
    data: params
  })
}
//应用列表
export function getHostApi(params) {
  return request({
    url: '/accesslogapi/getHost',
    method: 'post',
    data: params
  })
}