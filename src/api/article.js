/**
 * 文章请求模块
 */
import request from '@/utils/request'

export const getActicles = (params) => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
  })
}

/**
 * 获取文章详情
 */
export const getActiclesById = (articleId) => {
  return request({
    method: 'get',
    url: `/v1_0/articles/${articleId}`
  })
}
