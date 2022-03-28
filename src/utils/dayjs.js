import Vue from 'vue'
import dayjs from 'dayjs'

// dayjs默认语言是英文，这里配置中文
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

dayjs.locale('zh-cn') // 全局使用

// 定义一个全局过滤器，可以在任何组件模板中使用
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})
