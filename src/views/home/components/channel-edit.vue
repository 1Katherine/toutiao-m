<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        round
        plain
        size="mini"
        @click="isEditShow = !isEditShow"
        >{{ isEditShow ? '完成' : '编辑' }}</van-button
      >
    </van-cell>

    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEditShow && !fixedChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        class="grid-item"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEditShow: false,
      fixedChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    //   计算属性会观测内部依赖数据的变化
    recommendChannels() {
      const channels = []
      this.allChannels.forEach((channel) => {
        const ret = this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        const { channels } = data.data
        this.allChannels = channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      if (this.user) {
        //   登录了，存储到线上
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，存储在本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          //
          await deleteUserChannel(channel.id)
        } else {
          // 重新存一遍
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    },
    onMyChannelClick(channel, index) {
      //   编辑状态：删除频道 isEditShow=true
      // 非编辑状态：切换频道 isEditShow=false
      if (this.isEditShow) {
        //   如果是固定频道则不删除
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        // 编辑状态：删除频道
        this.myChannels.splice(index, 1)
        // 更新激活频道项，如果删除的频道早于激活频道，则激活下标-1
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1)
        }

        // 处理持久化
        this.deleteChannel(channel)
      } else {
        //   非编辑状态：切换（子触发父的自定义事件）
        this.$emit('update-active', index, false)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: #f85959;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
