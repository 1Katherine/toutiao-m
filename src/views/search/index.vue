<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
      />
      <!-- /搜索栏 -->

      <!-- 搜索结果 -->
      <SearchResult v-if="isResultShow" :searchText="searchText"></SearchResult>
      <!-- /搜索结果 -->

      <!-- 联想建议 -->
      <SearchSuggestion
        v-else-if="searchText"
        :searchText="searchText"
        @search="onSearch"
      ></SearchSuggestion>
      <!-- /联想建议 -->

      <!-- 搜索历史记录 -->
      <SearchHistory
        v-else
        :searchHistories="searchHistories"
        @clearHistories="searchHistories = []"
        @search="onSearch"
      ></SearchHistory>
      <!-- /搜索历史记录 -->
    </form>
  </div>
</template>

<script>
import { getItem, setItem } from '@/utils/storage'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
// import {getItem, setItem} from '@/utils/storage'
export default {
  name: 'SearchIndex',
  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  watch: {
    searchHistories(value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val

      // 存储历史搜索记录
      // 不要有重复历史记录
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 删除原有记录
        this.searchHistories.splice(index, 1)
      }
      // 把搜索记录插入到最前面
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  /deep/ .van-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
