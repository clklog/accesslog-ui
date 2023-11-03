import request from '@/utils/request'


// 状态码图表
export function getStatusApi(params) {
  return request({
    url: '/accesslogapi/accesslog/status/getStatus',
    method: 'post',
    data: params
  })
}