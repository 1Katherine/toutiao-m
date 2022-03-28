import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net', // 基础路径
  // 自定义后端返回的原始数据
  transformResponse: [
    function (data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        // 后端返回数据不是json格式字符串
        return data
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  // 请求发起会经过这里
  function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 如果请求出错会经过这里
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request
