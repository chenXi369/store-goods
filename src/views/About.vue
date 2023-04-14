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
        <comment @doSend="doSend"></comment>
        <div class="goods-list">
          <msg-box :list="messageList" :isDelete="true"></msg-box>
        </div>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="queryParams.pageSize"
            :total="total"
            @current-change="currentChange"
          ></el-pagination>
        </div>
      </template>
      
      <!-- 收藏列表为空的时候显示的内容 -->
      <div v-else class="content-empty">
        <div class="empty">
          <h2>留言板还是空的！</h2>
          <p>快去留言吧！</p>

          <comment :placeholder="'快来留言吧~'" @doSend="doSend"></comment>
        </div>
      </div>
      <!--  收藏列表为空的时候显示的内容END -->
    </div>
  </div>
</template>

<script>
import { addMessage, getMessages } from '@/api/hasToken.js'
import comment from 'bright-comment'
import MsgBox from '@/components/msgBox.vue'

export default {
  data() {
    return {
      remark: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      messageList: []
    }
  },
  components:{
    comment,
    MsgBox
  },
  mounted() {
    this.getMessageList()
  },
  methods: {
    // 获取留言列表
    getMessageList() {
      getMessages(this.queryParams).then(res => {
        this.messageList = [...res.data.list]
        this.total = res.data.total
      })
    },
    doSend(e) {
      const data = { message: e }
      addMessage(data).then(() => {
        this.$message.success('留言成功！')
        this.getMessageList()
      }) 
    },
    // 翻页的处理
    currentChange() {
      this.getMessageList()
    }
  }
}
</script>
<style scoped>
/deep/.btn {
  background: #ff6700 !important;
}
/deep/.btn-cancel {
  background: #a5a5a5 !important;
}
/deep/.hbl-comm {
  padding: 0 !important;
}
/deep/.OwO .OwO-items {
  width: 330px !important;
}

/deep/.comm {
  display: none !important;
}
/deep/.hbl-child {
  display: none !important;
}
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
  min-height: 580px;
  margin: 0 auto;
}
.about .content .goods-list {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: -13.7px;
  overflow: hidden;
}

.about .content .pagination {
  width: 100%;
  text-align: center;
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
  height: 400px;
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
