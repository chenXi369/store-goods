<!--
 * @Description: 全部商品页面组件(包括全部商品,商品分类,商品搜索)
 -->
<template>
  <div class="goods" id="goods" name="goods">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>全部产品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 面包屑END -->

    <!-- 分类标签 -->
    <div class="nav">
      <div class="product-nav">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane
            v-for="item in tabList"
            :key="item.id"
            :label="item.name"
            :name="item.name"
          />
        </el-tabs>
      </div>
    </div>
    <!-- 分类标签END -->

    <!-- 主要内容区 -->
    <div class="main">
      <ul class="sidebar">
        <li v-for="item in categoryList" :key="item.id" class="side-item"
        :class="{'active-bar': categoryId === item.id}" @click="selectCurCate(item)"
        >{{ item.name }}</li>
      </ul>
      <div class="list">
        <MyList :list="product" v-if="product.length>0"></MyList>
        <div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="goodParams.pageSize"
          :total="total"
          @current-change="currentChange"
        ></el-pagination>
      </div>
      <!-- 分页END -->
    </div>
    <!-- 主要内容区END -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabList: [
        { id: 0, name: '全部产品' },
        { id: 1, name: '待测产品' },
        { id: 2, name: '已测产品' }
      ],
      categoryList: "", //分类列表
      categoryId: null, // 分类id
      product: "", // 商品列表
      productList: "",

      total: 0, // 商品总量
      activeName: "全部产品", // 分类列表当前选中的id

      queryParams: {
        pageSize: 10,
        pageNum: 1
      },
      goodParams: {
        pageSize: 8,
        pageNum: 1,
        status: null
      }
    };
  },
  created() {
    // 获取分类列表
    this.getCategory()
  },
  activated() {
    this.total = 0; // 初始化商品总量为0
    this.currentPage = 1; //初始化当前页码为1
    // 如果路由没有传递参数，默认为显示全部商品
    if (Object.keys(this.$route.query).length == 0) {
      this.categoryId = null
      return
    }
    // 如果路由传递了categoryId，则显示对应的分类商品
    if (this.$route.query.categoryId != undefined) {
      this.categoryId = this.$route.query.categoryId
      if (this.categoryId.length == 1) {
        this.activeSort = "" + this.categoryId[0]
      }
      return
    }
  },
  watch: {
    activeName: function(val) {
      this.goodParams.status = (val == '全部产品' ? '' : val == '待测产品' ? 0 : 1)
      this.getData()
    },
    // 监听分类id，响应相应的商品
    categoryId: function() {
      this.getData()
    },
    // 监听路由变化，更新路由传递了搜索条件
    $route: function(val) {
      if (val.path == "/goods") {
        if (val.query.search != undefined) {
          this.activeName = "全部产品"
          this.currentPage = 1
          this.total = 0
        }
      }
    }
  },
  methods: {
    // 返回顶部
    backtop() {
      const timer = setInterval(function() {
        const top = document.documentElement.scrollTop || document.body.scrollTop;
        const speed = Math.floor(-top / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          top + speed;

        if (top === 0) {
          clearInterval(timer);
        }
      }, 20);
    },
    // 页码变化调用currentChange方法
    currentChange(currentPage) {
      this.goodParams.pageNum = currentPage
      this.getData()
      const timer = setTimeout(() => {
        this.backtop()
        clearTimeout(timer)
      }, 1000)
    },
    // 产品分类的修改
    selectCurCate(row) {
      this.categoryId = row.id
    },
    // 向后端请求分类列表数据
    getCategory() {
      this.$axios
        .post('/category/list', {...this.queryParams}).then(res => {
          const val = {
            id: 0,
            name: "全部"
          }
          const cate = res.data.data.list
          cate.unshift(val)
          this.categoryList = cate
          this.categoryId = this.categoryList[0].id
          this.getData()
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 向后端请求全部商品或分类商品数据
    getData() {
      // 如果分类列表为空则请求全部商品数据，否则请求分类商品数据
      const data = {
        pageNum: this.goodParams.pageNum,
        pageSize: this.goodParams.pageSize,
        status: this.goodParams.status
      }
      if(this.categoryId) {
        data.categoryId = this.categoryId
      }
      this.$axios
        .post('/product/list', {...data})
        .then(res => {
          this.product = [...res.data.data.list]
          this.total = res.data.data.total
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 通过搜索条件向后端请求商品数据
    getProductBySearch() {
      this.$axios
        .post("/api/product/getProductBySearch", {
          pageNum: this.goodParams.pageNum,
          pageSize: this.goodParams.pageSize
        })
        .then(res => {
          this.product = res.data.Product;
          this.total = res.data.total;
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.goods {
  background-color: #f5f5f5;
}
/* 面包屑CSS */
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}
.goods .breadcrumb {
  height: 50px;
  background-color: white;
}
.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 面包屑CSS END */

/* 分类标签CSS */
.goods .nav {
  background-color: white;
}
.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}
/* 分类标签CSS END */

/* 主要内容区CSS */
.goods .main {
  padding-top: 4px;
  margin: 0 auto;
  max-width: 1225px;
  clear: both;

  .sidebar {
    background: #ffffff;
    width: 220px;
    min-height: 680px;
    float: left;

    .side-item {
      box-sizing: border-box;
      width: 100%;
      color: #666;
      font-size: 16px;
      height: 56px;
      line-height: 36px;
      cursor: pointer;
      padding: 10px 20px;
      border-bottom: 1px solid #eaeaea;

      &:hover {
        background: #ff6700;
        opacity: 0.5;
        color: #fff;
      }
    }

    .active-bar {
      background: #ff6700;
      opacity: 0.8;
      color: #fff;
    }
  }
}
.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: 210px;
  margin-right: 0;
  overflow: auto;
}
.goods .main .pagination {
  margin-top: -10px;
  height: 40px;
  text-align: center;
}
.goods .main .none-product {
  color: #333;
  margin-left: 13.7px;
}
/* 主要内容区CSS END */
</style>