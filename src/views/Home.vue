<!--
 * @Description: 首页组件
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 13:36:12
 -->
<template>
  <div class="home" id="home" name="home">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="item in carousel" :key="item.id">
          <img style="height:460px;" :src="item.imgPath" alt />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 轮播图END -->

    <div class="main-box">
      <div class="main" style="margin-top: 15px">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="tab in goodTabs" :label="tab.name" :name="tab.id" :key="tab.id"></el-tab-pane>
        </el-tabs>

        <div class="main-content">
            <div class="left-product">
            <h3>最新</h3>
          </div>
          <div class="right-score">
            <h3>最热</h3>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { scoreRecommendList } from '@/api/hasToken'

export default {
  data() {
    return {
      carousel: [], // 轮播图数据
      phoneList: "", // 手机商品列表
      phoneList1: [],
      phoneList2: [],
      phoneList3: [],
      phoneList4: [],
      phoneList5: [],
      applianceActive: 1, // 家电当前选中的商品分类
      accessoryActive: 1, // 配件当前选中的商品分类

      activeName: null,
      goodTabs: [],
      queryParams: {
        pageNum: 1,
        pageSize: 5
      },
      scoreGoodList: []
    }
  },
  watch: {
    // 家电当前选中的商品分类，响应不同的商品数据
    applianceActive: function(val) {
      // 页面初始化的时候把applianceHotList(热门家电商品列表)直接赋值给applianceList(家电商品列表)
      // 所以在切换商品列表时判断applianceHotList是否为空,为空则是第一次切换,把applianceList赋值给applianceHotList
      if (this.applianceHotList == "") {
        this.applianceHotList = this.applianceList;
      }
      if (val == 1) {
        // 1为热门商品
        this.applianceList = this.applianceHotList;
        return;
      }
      if (val == 2) {
        // 2为电视商品
        this.applianceList = this.miTvList;
        return;
      }
    },
    accessoryActive: function(val) {
      // 页面初始化的时候把accessoryHotList(热门配件商品列表)直接赋值给accessoryList(配件商品列表)
      // 所以在切换商品列表时判断accessoryHotList是否为空,为空则是第一次切换,把accessoryList赋值给accessoryHotList
      if (this.accessoryHotList == "") {
        this.accessoryHotList = this.accessoryList;
      }
      if (val == 1) {
        // 1为热门商品
        this.accessoryList = this.accessoryHotList;
        return;
      }
      if (val == 2) {
        // 2为保护套商品
        this.accessoryList = this.protectingShellList
        return;
      }
      if (val == 3) {
        //3 为充电器商品
        this.accessoryList = this.chargerList
        return
      }
    }
  },
  created() {
    // 获取轮播图数据(推荐商品)
    this.$axios
      .post('/product/recommend')
      .then(() => {
        this.carousel = [
          { id: 1, imgPath: require('@/assets/swiper/1.jpg') },
          { id: 2, imgPath: require('@/assets/swiper/2.jpg') },
          { id: 3, imgPath: require('@/assets/swiper/3.jpg') },
          { id: 4, imgPath: require('@/assets/swiper/4.jpg') },
          { id: 5, imgPath: require('@/assets/swiper/5.jpg') },
        ]
      })
      .catch(err => {
        return Promise.reject(err)
      })
    // 先获取商品分类
    this.getGoodCate()
    // 获取根据积分排的列表
    this.scoreRecommendList()
  },
  methods: {
    // tab切换时的处理
    handleClick(e) {
      this.activeName = e.name

      this.getPromo(e.name)
    },
    scoreRecommendList() {
      const data = {
        pageNum: 1,
        pageSize: 10,
        status: '1'
      }
      scoreRecommendList(data).then(res => {
        console.log(res.data)
      })
    },
    getGoodCate() {
      const data = {
        pageNum: 1,
        pageSize: 20
      }
      this.$axios.post('/category/list', data).then(res => {
        this.goodTabs = [...res.data.data.list].map(item => {
          return {
            ...item, id: String(item.id)
          }
        })
        this.activeName = this.goodTabs[0].id
        if(this.goodTabs && this.goodTabs.length) {
          // 获取各类商品数据
          Promise.all(this.goodTabs.map(item => {
            return this.getPromo(item)
          }))       
        }
      })
    },
    // 获取家电模块子组件传过来的数据
    getChildMsg(val) {
      this.applianceActive = val;
    },
    // 获取配件模块子组件传过来的数据
    getChildMsg2(val) {
      this.accessoryActive = val;
    },
    // 获取各类商品数据方法封装
    getPromo(id, api) {
      api = api != undefined ? api : '/product/list'
      const data = {
        categoryId: id,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
      this.$axios
        .post(api, { ...data })
        .then(res => {
          this.phoneList = [ ...res.data.data.list ]
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
  }
}
</script>

<style scoped>
@import "../assets/css/index.css";

.main-content {
  display: flex;
  flex-direction: row;
}
.main .right-score {
  width: 280px;
  padding: 14px;
  margin-left: 10px;
  background: #fff;
  border: 1px solid #f5f5f5;
}
.main .left-product {
  padding: 14px;
  background: #fff;
  border: 1px solid #f5f5f5;
  width: calc(100% - 290px);
}
</style>