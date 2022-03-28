<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索
      </van-button>
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <ArticleList :channel="channel"></ArticleList>
        <!-- 文章列表 -->
      </van-tab>

      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :myChannels="channels"
        :active="active"
        @update-active="onUpdateActive"
      ></ChannelEdit>
    </van-popup>
    <!-- 频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { mapState } from 'vuex'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data() {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false // 控制频道弹出层的显示状态
    }
  },
  created() {
    this.loadChannels()
  },
  methods: {
    async loadChannels() {
      let channels = []
      if (this.user) {
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (localChannels) {
          channels = localChannels
        } else {
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    },

    onUpdateActive(index, isChannelEditShow = true) {
      this.active = index
      // 控制弹层的关闭状态
      this.isChannelEditShow = isChannelEditShow
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      // 不参与flex空间计算，固定宽度
      flex-shrink: 0;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background-image: url('~@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
  }
}
</style>
