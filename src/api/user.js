import request from '@/utils/request'

// 用户列表
export function getUserList(data) {
  return request({
    url: process.env.API_ROOT+'/cms/user/page',
    method: 'post',
    data
  })
}
//设备列表
export function getDeviceList(data) {
  return request({
    url: process.env.API_ROOT+'/cms/user/page',
    method: 'post',
    data
  })
}

// 详情
export function getDetailInfo(data) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/invite/track/info',
    method: 'post',
    data
  })
}

export function getDetailMoney(params) {
  return request({
    url: process.env.API_ROOT+'/cms/user/page/money',
    method: 'get',
    params
  })
}

export function getDetailInvite(params) {
  return request({
    url: process.env.API_ROOT+'/cms/user/page/invite',
    method: 'get',
    params
  })
}

export function getDetailConvert(params) {
  return request({
    url: process.env.API_ROOT+'/cms/user/data/order',
    method: 'get',
    params
  })
}

export function getDetailCoin(params) {
  return request({
    url: process.env.API_ROOT+'/cms/user/data/coin',
    method: 'get',
    params
  })
}



