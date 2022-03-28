/**
 * 搜索api
 */

import request from '@/utils/request'

export const getSearchSuggestions = (q) => {
  return request({
    method: 'get',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索请求
 */

export const getSearchResult = (params) => {
  return request({
    method: 'get',
    url: '/v1_0/search',
    params
  })
}
