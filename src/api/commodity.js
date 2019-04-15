import request from '@/utils/request'

// 商品列表
export function getcommodityList(params) {
    return request({
      url: process.env.API_ROOT+'/cms/product/list',
      method: 'get',
      params
    })
  }

// 下架&上架 state 0下，1上
export function dropoffAndShelf(data) {
  return request({
    url: process.env.API_ROOT+'/cms/product/saveOrUpdate',
    method: 'post',
    headers:{'Content-Type':'application/json'},
    data
  })
}
// 上架
export function shelf(data) {
    return request({
        url: process.env.API_ROOT+'/cms/product/saveOrUpdate',
        method: 'post',
        headers:{'Content-Type':'application/json'},
        data
    })
}

// 商品兑换列表
export function productExchange(params) {
    return request({
        url: process.env.API_ROOT+'/cms/product/order/count',
        method: 'post',
        headers:{'Content-Type':'application/json'},
        params
    })
}

// 商品兑换详情列表
export function productExchangeDetails(params) {
    return request({
        url: process.env.API_ROOT+'/cms/product/order/count/detail',
        method: 'post',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        params
    })
}
// 话费兑换列表
export function callExchange(params) {
  return request({
    url: process.env.API_ROOT+'/cms/product/mobile/list',
    method: 'get',
    params
  })
}

// 优惠码兑换列表
export function codeExchange(params) {
    return request({
      url: process.env.API_ROOT+'/cms/product/code/list',
      method: 'get',
      params
    })
}
// ==================================================================
// 下拉商品名称列表
// 暂未抽离，位置views->commodity->promoCode
export function productNameList() {
    return request({
      url: process.env.API_ROOT+'/cms/product/simple/list',
      method: 'get',
    })
}

// 添加caping商品
// 暂未抽离，位置views->commodity->components->addCommodity
export function addCapingProduct(data) {
    return request({
        url: process.env.API_ROOT+'/cms/product/saveOrUpdate',
        method: 'post',
        headers:{'Content-Type':'application/json'},
        data
    })
}

// 添加京东商品
// 暂未抽离，位置views->commodity->components->addH5
export function addJDProduct(data) {
    return request({
        url: process.env.API_ROOT+'/cms/product/saveOrUpdate',
        method: 'post',
        headers:{'Content-Type':'application/json'},
        data
    })
}


