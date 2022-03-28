<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
        <span @click="$emit('clearHistories', [])">全部删除</span>
        &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data() {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  props: {
    // prop受父组件数据影响
    // 数据如果是普通数字，数字、字符串、布尔值绝对不能改，即便改了也不会传给父组件
    // 如果是引用类型数据（数组、对象），可以修改.push ，不能重新赋值 =
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态，点击后删除元素
        this.searchHistories.splice(index, 1)
      } else {
        // 点击状态，点击后跳转页面
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
