<template>
  <van-button
    v-if="isFollowed"
    round
    size="small"
    @click="onFollow"
    :loading="Loading"
    >已关注</van-button
  >
  <van-button
    v-else
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="Loading"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      Loading: false
    }
  },
  methods: {
    async onFollow() {
      // 展示关注按钮的 loading 状态
      this.Loading = true
      try {
        const authorId = this.userId
        if (this.isFollowed) {
          //   已关注，取消关注
          const { data } = await deleteFollow(authorId)
          console.log('取消关注', data)
        } else {
          //   没有关注，添加关注
          await addFollow(authorId)
        }
        // 更新f父组件视图状态
        this.$emit('update-is_followed', this.isFollowed)
      } catch (err) {
        let message = '操作失败，请稍后重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast.fail(message)
      }
      // 取消关注按钮的 loading 状态
      this.Loading = false
    }
  }
}
</script>

<style></style>
