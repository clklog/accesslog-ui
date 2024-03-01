import request from '@/utils/request'


// 状态码数据图表
export function getStatusApi(params) {
  return request({
    url: '/accesslog/status/getStatus',
    method: 'post',
    data: params
  })
}
// 状态码列表
export function getStatusListApi(params) {
  return request({
    url: '/accesslog/status/getStatusList',
    method: 'post',
    data: params
  })
}
// 状态码分析所有数据列表
export function getStatusFlowTrendApi(params) {
  return request({
    url: '/accesslog/status/getStatusFlowTrend',
    method: 'post',
    data: params
  })
}
// 状态码详情
export function getStatusDetailApi(params) {
  return request({
    url: '/accesslog/status/getStatusDetail',
    method: 'post',
    data: params
  })
}