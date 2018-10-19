import request from '@/utils/request'

export function getOverView(params) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/all',
    method: 'get',
    params
  })
}

export function getDayRank(params) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/rank',
    method: 'get',
    params
  })
}

export function getWeekRank(params) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/rank/week',
    method: 'get',
    params
  })
}

export function getMonthRank(params) {
  return request({
    url: process.env.API_ROOT+'/cms/statistic/rank/month',
    method: 'get',
    params
  })
}

export function getEventList(params) {
  return request({
    url: 'http://13.250.63.147:8005/statistic/event',
    method: 'get',
    params
  })
}