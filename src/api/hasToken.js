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

// 新增评论
