import request from '@/utils/request'

export function getConfigList(params) {
    return request({
      url: process.env.API_ROOT+'/cms/set/config/list',
      method: 'get',
      params
    })
  }