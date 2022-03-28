<template>
  <div class="search-suggestion">
    <van-cell v-for="(text, index) in suggestions" :key="index" icon="search">
      <div
        slot="title"
        v-html="highlight(text)"
        @click="$emit('search', text)"
      ></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: []
    }
  },
  watch: {
    searchText: {
      // 当searchText发生改变之后，就会调用这个handler函数
      // handler函数名称是固定的(防抖处理)
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),

      // 该回调将会在监听开始之后被立即调用
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$$toast('数据获取失败，请稍后重试')
      }
    },
    highlight(text) {
      if (text == null) {
        return text
      }
      const highlightStr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText)
      // replace不会修改原始内容，而是生成一个新的
      return text.replace(reg, highlightStr, 'gi')
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
