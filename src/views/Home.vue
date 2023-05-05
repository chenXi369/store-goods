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
      <div class="main">
        <div class="phone" v-for="tab in goodTabs" :key="tab.id">
          <div class="box-hd">
            <div class="title">{{ tab.name }}</div>
          </div>
          <div class="box-bd">
            <div class="list" v-if="tab.name === '相机'">
              <MyList :list="phoneList" :isMore="true"></MyList>
            </div>

            <div class="list" v-else-if="tab.name === '电脑配件'">
              <MyList :list="phoneList1" :isMore="true"></MyList>
            </div>

            <div class="list" v-else-if="tab.name === '耳机'">
              <MyList :list="phoneList2" :isMore="true"></MyList>
            </div>

            <div class="list" v-else-if="tab.name === '手机'">
              <MyList :list="phoneList3" :isMore="true"></MyList>
            </div>

            <div class="list" v-else-if="tab.name === '电脑'">
              <MyList :list="phoneList4" :isMore="true"></MyList>
            </div>

            <div class="list" v-else-if="tab.name === '手表'">
              <MyList :list="phoneList5" :isMore="true"></MyList>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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

      goodTabs: [],
      queryParams: {
        pageNum: 1,
        pageSize: 5
      }
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
  },
  methods: {
    getGoodCate() {
      const data = {
        pageNum: 1,
        pageSize: 20
      }
      this.$axios.post('/category/list', data).then(res => {
        console.log(res)
        this.goodTabs = [...res.data.data.list]

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
    getPromo(val, api) {
      api = api != undefined ? api : '/product/list'
      const data = {
        categoryId: val.id,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
      this.$axios
        .post(api, { ...data })
        .then(res => {
          switch (val.name) {
            case '相机':
            this.phoneList = [ ...res.data.data.list ].slice(0, 4)
              break;
              case '电脑配件':
            this.phoneList1 = [ ...res.data.data.list ].slice(0, 4)
              break;
              case '耳机':
            this.phoneList2 = [ ...res.data.data.list ].slice(0, 4)
              break;
              case '手机':
            this.phoneList3 = [ ...res.data.data.list ].slice(0, 4)
              break;
              case '电脑':
            this.phoneList4 = [ ...res.data.data.list ].slice(0, 4)
              break;
              case '手表':
            this.phoneList5 = [ ...res.data.data.list ].slice(0, 4)
              break
          }
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
</style>