import request from '@/utils/request'

export function login(account, password, code) {
  return request({
    url: '/cms/sys/login',
    method: 'post',
    data: {
      account,
      password,
      code
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/sys/role/info',
    method: 'get',
    params: { token }
  })
}

export function getVerityCode() {
  return request({
    url: '/cms/getVerityCode',
    method: 'get'
  })
}

export function getUserMenus() {
  return request({
    url: '/sys/user/menu',
    method: 'get'
  })
}
