<!--
 * @Description: 社区留言
 -->
<template>
  <div class="about" id="about" name="about">
    <div class="about-header">
      <div class="about-title">
        <i class="el-icon-tickets" style="color: #ff6700;"></i>
        社区留言
      </div>
    </div>

    <div class="content">
      <template v-if="messageList.length>0">
        <div class="goods-list">
          <msg-box :list="messageList" :isDelete="true"></msg-box>
        </div>
        <el-input type="textarea" v-model="remark" style="width: 100%; height: 80px;" placeholder="请输入留言"
        ></el-input>
      </template>
      
      <!-- 收藏列表为空的时候显示的内容 -->
      <div v-else class="content-empty">
        <div class="empty">
          <h2>留言板还是空的！</h2>
          <p>快去留言吧！</p>

          <el-input type="textarea" v-model="remark" style="width: 100%; height: 80px;" placeholder="请输入留言"
          ></el-input>
        </div>
      </div>
      <!--  收藏列表为空的时候显示的内容END -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remark: null,
      messageList: []
    }
  }
}
</script>
<style scoped>
.about {
  background-color: #f5f5f5;
}
.about .about-header {
  height: 64px;
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
}
.about .about-header .about-title {
  width: 1225px;
  margin: 0 auto;
  height: 64px;
  line-height: 64px;
  font-size: 28px;
}
.about .content {
  padding: 20px 0;
  width: 1225px;
  margin: 0 auto;
}
.about .content .goods-list {
  margin-left: -13.7px;
  overflow: hidden;
}
.about .about-content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
}

/* 收藏列表为空的时候显示的内容CSS */
.content .content-empty {
  width: 1225px;
  margin: 0 auto;
}

.content .content-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}

.content .content-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}

.content .content-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}
</style>
