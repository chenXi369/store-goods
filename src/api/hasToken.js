import request from '@/utils/request'

// 获取收藏列表
export function getLikeProduct(data) {
  return request({
    url: '/product/likeList',
    method: 'post',
    data
  })
}

// 新增收藏
export function addLikeProdct(id) {
  return request({
    url: `/product/like/${id}`,
    method: 'post'
  })
}

// 取消收藏
export function cancelLikeProduct(id) {
  return request({
    url: `/product/cancelLike/${id}`,
    method: 'post'
  })
}

// 获取评论列表
export function getCommentList() {
  return request({
    url: `/comment/list`,
    method: 'post'
  })
}

// 获取地址列表
export function getAddressList(data) {
  return request({
    url: '/userAddress/list',
    method: 'post',
    data
  })
}

// 新增地址
export function addAddress(data) {
  return request({
    url: `/userAddress/add`,
    method: 'post',
    data
  })
}

// 删除地址
export function delAddress(id) {
  return request({
    url: `/userAddress/del/${id}`,
    method: 'delete'
  })
}

// 修改地址
export function updateAddress(data) {
  return request({
    url: `/userAddress/update`,
    method: 'post',
    data
  })
}

// 浏览记录列表
export function getScanHistory(data) {
  return request({
    url: '/browsingHistory/list',
    method: 'post',
    data
  })
}

// 添加浏览记录
export function addScanHistory(id) {
  return request({
    url: '/browsingHistory/add/' + id,
    method: 'post'
  })
}
