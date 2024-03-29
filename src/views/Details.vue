<!--
 * @Description: 商品详情页面组件
 -->
<template>
  <div id="details">
    <!-- 头部 -->
    <div class="page-header">
      <div class="title">
        <p>{{productDetail.name}}</p>
        <div class="list">
          <ul>
            <li>
              <el-button type="text" @click="baseInfo = 1" style="color: #ff6700">概述</el-button>
            </li>
            <li>
              <el-button type="text" @click="baseInfo = 0" style="color: #ff6700">用户评价</el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 头部END -->

    <!-- 主要内容 -->
    <div class="main">
      <!-- 左侧商品轮播图 -->
      <div class="block">
        <el-carousel height="560px" v-if="productPicture.length>1">
          <el-carousel-item v-for="item in productPicture" :key="item.id">
            <img style="height:560px;" :src="$target + item.bannerImg" alt />
          </el-carousel-item>
        </el-carousel>
        <div v-if="productPicture.length==1">
          <img
            style="height:560px; width: 100%;"
            :src="$target + productDetail.bannerImg"
            :alt="productDetail.rotation"
          />
        </div>
      </div>
      <!-- 左侧商品轮播图END -->

      <!-- 右侧内容区 -->
      <div class="content">
        <h1 class="name">{{productDetail.name}}</h1>
        <p class="intro">{{productDetail.remark}} (评分：{{ productDetail.score ? productDetail.score : '暂无评分' }})</p>
        <p class="store">{{ productDetail.brand }}</p>
        <div class="price">
          <span>{{productDetail.price}}元</span>
          <span
            v-show="productDetail.price != productDetail.price"
            class="del"
          >{{productDetail.price}}元</span>

          <div class="remark" v-html="productDetail.detail"></div>
        </div>
        
        <template v-if="baseInfo === 1">
          <div class="pro-list">
            <span class="pro-name">{{productDetail.name}}</span>
            <span class="pro-price">
              <span>{{productDetail.price}}元</span>
              <span
                v-show="productDetail.price != productDetail.price"
                class="pro-del"
              >{{productDetail.price}}元</span>
            </span>
            <p class="price-sum">总计 : {{productDetail.price}}元</p>
          </div>
          <!-- 内容区底部按钮 -->
          <div class="button">
            <!-- <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入购物车</el-button> -->
            <el-button class="like" type="primary" @click="addCollect(productDetail.id)">收藏</el-button>
          </div>
        </template>

        <template v-else>
          <h3 style="margin: 8px 5px">用户评论</h3>
          <div class="commen-list">
            <section>
              <el-input type="textarea" v-model="userComment"></el-input>
              <div style="text-align: right; margin-top: 12px;">
                <el-button size="mini" type="primary" @click="addUserComment">评论</el-button>
              </div>
            </section>
            <div v-if="total == 0">
              暂无评论
            </div>
            <template v-else>
              <div class="comment-item" v-for="item in commentList" :key="item.id"
                style="border-bottom: 1px solid #eaeaea; padding-bottom: 12px;">
                <p style="height: 40px; display: flex; flex-direction: row; align-items: center;">
                  <img style="width: 24px; height: 24px; border-radius: 50%;" :src="$target + item.userAvatar">
                  <span style="margin-left: 10px">{{ item.createBy }}</span>
                </p>
                <p>{{ item.content }}</p>
              </div>
            </template>
          </div>
        </template>
      </div>
      <!-- 右侧内容区END -->
    </div>
    <!-- 主要内容END -->
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { getToken } from '@/utils/auth'
 
import { addLikeProdct, addScanHistory, getCommentList, addCommentItem } from '@/api/hasToken'
export default {
  data() {
    return {
      dis: false, // 控制“加入购物车按钮是否可用”
      productId: "", // 商品id
      productDetail: {}, // 商品详细信息
      productPicture: [],
      baseInfo: 1,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      commentList: [],
      userComment: null
    }
  },
  // 通过路由获取商品id
  activated() {
    if (this.$route.query.productId != undefined) {
      this.productId = this.$route.query.productId
      this.userComment = null
      this.getDetails()
    }
  },
  computed: {
    computedAppraise() {
      return `/Appraise?productId=${this.productId}`
    },
    // 商品图片
  },  
  methods: {
    ...mapActions(["unshiftShoppingCart", "addShoppingCartNum"]),
    // 获取商品详细信息
    getDetails() {
      this.$axios
        .post('/product/' + this.productId, {
          pageNum: 1,
          pageSize: 10
        })
        .then(res => {
          this.productDetail = { ...res.data.data }
          this.productPicture = this.productDetail.bannerImg.split(',')

          // 同时把改浏览记录添加
          if(getToken()) {
            addScanHistory(this.productDetail.id)
          }
          // 获取评论列表
          this.getCommentList(this.productDetail.id)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 获取评论列表
    getCommentList(id) {
      const data = {
        id: id,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
      getCommentList(data).then(res => {
        this.commentList = [...res.data.list]
        this.total = res.data.total
      })
    },
    addCollect(id) {
      // 判断是否登录,没有登录则显示登录组件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true)
        return
      }

      addLikeProdct(id).then(res => {
        if (res.code == '200') {
          // 添加收藏成功
          this.notifySucceed('收藏成功')
        } else {
          // 添加收藏失败
          this.notifyError(res.data.msg)
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    addUserComment() {
      // 判断是否登录,没有登录则显示登录组件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true)
        return
      }
      console.log(this.productId)
      const data = {
        content: this.userComment,
        productId: this.productId,
        userAvatar: JSON.parse(localStorage.getItem('userInfo')).avatar
      }
      addCommentItem(data).then(() => {
        this.notifySucceed('评论成功')
        this.userComment = null
        this.getCommentList(this.productId)
      })
    }
  }
}
</script>

<style>
/* 头部CSS */
#details .page-header {
  height: 64px;
  margin-top: -20px;
  z-index: 4;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}
#details .page-header .title {
  width: 1225px;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  font-weight: 400;
  color: #212121;
  margin: 0 auto;
}
#details .page-header .title p {
  float: left;
}
#details .page-header .title .list {
  height: 64px;
  float: right;
}
#details .page-header .title .list li {
  float: left;
  margin-left: 20px;
}
#details .page-header .title .list li a {
  font-size: 14px;
  color: #616161;
}
#details .page-header .title .list li a:hover {
  font-size: 14px;
  color: #ff6700;
}
/* 头部CSS END */

/* 主要内容CSS */
#details .main {
  width: 1225px;
  height: 560px;
  padding-top: 30px;
  margin: 0 auto;
}
#details .main .block {
  float: left;
  width: 560px;
  height: 560px;
}
#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}
#details .main .content .name {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: normal;
  color: #212121;
}
#details .main .content .intro {
  color: #b0b0b0;
  padding-top: 10px;
}
#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}
#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0 25px; 
}
#details .main .content .price .remark {
  font-size: 14px;
  margin-top: 10px;
  color: #999;
  overflow: hidden;
  overflow-y: scroll;
  max-height: 100px;
}

#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}
#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
}
#details .main .content .pro-list span {
  line-height: 30px;
  color: #616161;
}
#details .main .content .pro-list .pro-price {
  float: right;
}
#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 24px;
  padding-top: 20px;
}
#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}
#details .main .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}

#details .main .content .button .like {
  opacity: 0.8;
  width: 100%;
}
#details .main .content .button .like:hover {
  opacity: 0.5;
}
#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}

.comment-list {
  padding: 15px;
}

.comment-item {
  width: 100%;
  min-height: 60px;
}
/* 主要内容CSS END */
</style>