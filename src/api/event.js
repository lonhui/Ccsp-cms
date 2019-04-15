import request from '@/utils/request'

// 事件列表
export function geteventList(params) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/event',
    method: 'get',
    params
  })
}

// 阅读事件预览列表(key_id=3)&开宝箱事件预览(key_id=2)&(触发型事件key_id=10)
export function readeventList(data) {
    return request({
      url: process.env.API_ROOT+'/cms/statistic/browse',
      method: 'post',
      data
    })
}

// 阅读类型(type=3)&宝箱类型(type=2)
export function readTypeList(params) {
    return request({
      url: process.env.API_ROOT+'/cms/statistic/type',
      method: 'get',
      params
    })
}

// 邀请事件列表
export function inviteEventList(data) {
    return request({
      url: process.env.API_ROOT+'/cms/statistic/invite',
      method: 'post',
      data
    })
}

// 邀请跟踪列表
export function trackEventList(data) {
    return request({
      url: process.env.API_ROOT+'/cms/statistic/invite/track',
      method: 'post',
      data
    })
}
// 被邀请人列表
export function inviteesList(data) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/invite/info',
    method: 'post',
    data
  })
}
// 被邀请人详情
export function inviteesDetailsList(params) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/invite/track/info',
    method: 'post',
    params
  })
}

// 分享内容列表
export function shareEventList(data) {
    return request({
      url: process.env.API_ROOT+'/cms/statistic/browse',
      method: 'post',
      data
    })
}

// 签到列表
export function checkinEventList(data) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/sign',
    method: 'post',
    data
  })
}

// 事件配置
export function eventConfigList(params) {
  return request({
    url: process.env.API_ROOT+'/cms/set/event/list',
    method: 'get',
    params
  })
}
// 编辑事件配置
export function updataEventconfig(params) {
  return request({
    url: process.env.API_ROOT+'/cms/set/event/update',
    method: 'get',
    params
  })
}
