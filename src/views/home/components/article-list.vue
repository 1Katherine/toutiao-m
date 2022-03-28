<template>
  <div class="article-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      success-duration="1500"
      @refresh="onRefresh"
    >
      <!-- 文章列表 -->
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></ArticleItem>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
      <!-- 文章列表 -->
    </van-pull-refresh>
    <!-- 下拉刷新 -->
  </div>
</template>

<script>
import { getActicles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data() {
    return {
      list: [],
      loading: false,
      error: false, // 控制失败的提示状态列表
      finished: false,
      timestamp: null, // 请求获取下一页数据的时间戳
      isreFreshLoading: false, // 控制文章列表下拉刷新组件
      refreshSuccessText: '刷新成功'
    }
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      try {
        const { data } = await getActicles({
          channel_id: this.channel.id,
          //   简单理解就是请求数据的页码
          // 如果请求第一页数据，传入当前时间戳
          //   用于请求之后的数据的时间戳，会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now()
        })

        // // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdasjidhjaishd')
        // }

        const { results } = data.data
        this.list.push(...results)

        // 加载状态结束,loading为flase才能再次触发onload
        this.loading = false

        // 如果本次还有数据则继续加载
        if (results.length) {
          // 更新下一次数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }

      // 数据全部加载完成
    },
    // 下拉刷新时调用该函数
    async onRefresh() {
      // 请求获取数据，将数据追加到列表顶部
      try {
        const { data } = await getActicles({
          channel_id: this.channel.id,
          timestamp: Date.now()
        })

        // // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdasjidhjaishd')
        // }

        const { results } = data.data
        this.list.unshift(...results)
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
      }

      //   关闭下拉刷新loading状态
      this.isreFreshLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  // 必须父元素100%才会生效
  height: 83vh;
  overflow-y: auto;
}
</style>
