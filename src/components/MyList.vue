<!--
 * @Description: 列表组件，用于首页、全部商品页面的商品列表
 -->
<template>
  <div id="myList" class="myList">
    <ul>
      <li v-for="item in list" :key="item.id">
        <el-popover placement="top">
          <p>
            <i type="info" class="el-icon-warning"></i> 确定删除吗？
          </p>
          <div style="text-align: right; margin: 10px 0 0">
            <el-button size="mini" @click="colsePopover">取消</el-button>
            <el-button type="primary" size="mini" @click="deleteCollect(item.id)">确定</el-button>
          </div>
          <i class="el-icon-close delete" slot="reference" v-show="isDelete"></i>
        </el-popover>
        <router-link :to="{ path: '/goods/details', query: {productId: item.id} }">
          <img :src="$target + item.bannerImg" alt />
          <h2>{{item.name}}</h2>
          <h3>{{item.remark}}</h3>
          <p>
            <span>{{item.price}}元</span>
            <!-- <span class="del">{{item.price}}元</span> -->
          </p>
        </router-link>
      </li>
      <li v-show="isMore && list.length>=1" id="more" style="float: right">
        <router-link :to="{ path: '/goods', query: {categoryId: categoryId} }">
          浏览更多
          <i class="el-icon-d-arrow-right"></i>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { cancelLikeProduct } from '@/api/hasToken'

export default {
  name: "MyList",
  // list为父组件传过来的商品列表
  // isMore为是否显示“浏览更多”
  props: ["list", "isMore", "isDelete"],
  data() {
    return {};
  },
  computed: {
    // 通过list获取当前显示的商品的分类ID，用于“浏览更多”链接的参数
    categoryId: function() {
      let categoryId = [];
      if (this.list != "") {
        for (let i = 0; i < this.list.length; i++) {
          const id = this.list[i].category_id;
          if (!categoryId.includes(id)) {
            categoryId.push(id);
          }
        }
      }
      return categoryId;
    }
  },
  methods: {
    // 取消关注成功
    deleteCollect(product_id) {
      cancelLikeProduct(product_id).then(() => {
        // 删除删除列表中的该商品信息
        for (let i = 0; i < this.list.length; i++) {
          const temp = this.list[i];
          if (temp.id == product_id) {
            this.list.splice(i, 1);
          }
        }
        // 提示删除成功信息
        this.notifySucceed('删除成功！')
      })
    },
    colsePopover() {

    }
  }
};
</script>
<style scoped>
.myList ul li {
  z-index: 1;
  float: left;
  width: 234px;
  height: 280px;
  padding: 10px 0;
  margin: 0 0 14.5px 13.7px;
  background-color: white;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  position: relative;
}
.myList ul li:hover {
  z-index: 2;
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
}
.myList ul li img {
  display: block;
  width: 160px;
  height: 160px;
  background: url(../assets/imgs/placeholder.png) no-repeat 50%;
  margin: 0 auto;
}
.myList ul li h2 {
  margin: 25px 6px 0;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li h3 {
  margin: 5px 10px;
  height: 18px;
  font-size: 12px;
  font-weight: 400;
  color: #b0b0b0;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.myList ul li p {
  margin: 10px 10px 10px;
  text-align: center;
  color: #ff6700;
}
.myList ul li p .del {
  margin-left: 0.5em;
  color: #b0b0b0;
  text-decoration: line-through;
}
.myList #more {
  text-align: center;
  line-height: 280px;
}
.myList #more a {
  font-size: 18px;
  color: #333;
}
.myList #more a:hover {
  color: #ff6700;
}
.myList ul li .delete {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}
.myList ul li:hover .delete {
  display: block
}
.myList ul li .delete:hover {
  color: #ff6700;
}
</style>