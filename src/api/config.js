import request from '@/utils/request'

// 系统配置列表
export function getConfigList(params) {
  return request({
    url: process.env.API_ROOT+'/cms/set/config/list',
    method: 'get',
    params
  })
}

// 添加系统配置
export function addConfig(data) {
  return request({
    url: process.env.API_ROOT+'/cms/set/config/save',
    method: 'post',
    data
  })
}

// 修改系统配置
export function updateConfig(data) {
  return request({
    url: process.env.API_ROOT+'/cms/set/config/update',
    method: 'post',
    data
  })
}