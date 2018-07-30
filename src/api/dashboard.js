import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/cms/statistic/all',
    method: 'get',
  })
}