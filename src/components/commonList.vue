<template>
  <div class="common-list">
    <div class="common-item" v-for="item in commonList" :key="item.id">
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    commonList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>