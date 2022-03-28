import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对下个,存储当前用户的登录信息(token等数据)
    user: getItem(TOKEN_KEY)
  },
  getters: {},
  mutations: {
    getUser(state, data) {
      state.user = data
      // 为了防止刷新丢失,把数据备份到本地存储
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
