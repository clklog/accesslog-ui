import request from '@/utils/request'


// 访问量异常数据
export function getExceptionPvApi(params) {
  return request({
    url: '/accesslog/exception/getExceptionPv',
    method: 'post',
    data: params
  })
}
// 状态码异常数据
export function getExceptionStatusApi(params) {
  return request({
    url: '/accesslog/exception/getExceptionStatus',
    method: 'post',
    data: params
  })
}
// ip异常数据
export function getExceptionIpApi(params) {
  return request({
    url: '/accesslog/exception/getExceptionIp',
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
