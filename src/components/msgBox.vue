<template>
  <div class="msg-box">
    <ul>
      <li v-for="item in list" :key="item.id">
        <el-card shadow="hover">
          <div style="display: flex; align-items: center; position: relative;">
            <img :src="$target + item.userAvatar" alt />
            <span style="color: #666; margin-left: 12px">{{ item.nickName }}</span>
            <span style="position: absolute; top: 5px; right: 20px; color: #a5a5a5;">
              {{ item.createTime }}
            </span>
          </div>
          
          <p style="padding: 5px 20px; color: #686868; font-size: 14px;">{{ item.message }}</p>         
        </el-card>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["list"],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.msg-box {
  width: 100%;

  ul {
    width: 100%;

    li {
      width: 100%;

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }
}
</style>