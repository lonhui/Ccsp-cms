import request from '@/utils/request'

export function getAdminList(data) {
    return request({
      url: process.env.API_ROOT+'/cms/sys/user/list',
      method: 'post',
      data
    })
}
// 暂未抽离
export function getRoleList(params) {
    return request({
      url: process.env.API_ROOT+'/cms/sys/role/list',
      method: 'get',
      params
    })
}

export function getMenuList(params) {
    return request({
      url: process.env.API_ROOT+'/cms/sys/menu/list',
      method: 'get',
      params
    })
}
//暂未抽离
export function addAdmin(data) {
  return request({
    url: process.env.API_ROOT+'/cms/sys/user/add',
    method: 'post',
    headers:{
      'Content-Type':'application/json',
      'X-abn-session-token':this.GLOBAL.token
    },
    data
  })
}
