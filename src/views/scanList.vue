<!--
 * @Description: 我的收藏页面组件
 -->
 <template>
  <div class="collect">
    <!-- Add a static page for my favorite module -->
    <div class="collect-header">
      <div class="collect-title">
        <i class="el-icon-collection-tag" style="color: #ff6700;"></i>
        浏览记录
      </div>
    </div>
    <div class="content">
      <template v-if="scanList.length > 0">
        <div class="goods-list">
          <MyScan :list="scanList"></MyScan>
        </div>

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
      <div v-else class="collect-empty">
        <div class="empty">
          <h2>您还没有浏览记录！</h2>
          <p>快去浏览商品吧！</p>
        </div>
      </div>
      <!--  收藏列表为空的时候显示的内容END -->
    </div>
  </div>
</template>

<script>
import { getScanHistory } from '@/api/hasToken'
import MyScan from '@/components/myScan'

export default {
  data() {
    return {
      scanList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  components: {
    MyScan
  },
  activated() {
    this.getAddressList()
  },
  methods: {
    getAddressList() {
      // 获取地址数据
      getScanHistory(this.queryParams).then(res => {
        this.scanList = [...res.data.list]
        this.total = res.data.total
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    currentChange() {
      this.getAddressList()
    }
  }
}
</script>
<style>
.collect {
  background-color: #f5f5f5;
}

.collect .collect-header {
  height: 64px;
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
}

.collect .collect-header .collect-title {
  width: 1225px;
  margin: 0 auto;
  height: 64px;
  line-height: 58px;
  font-size: 28px;
}

.collect .content {
  padding-top: 20px;
  width: 1225px;
  min-height: 540px;
  margin: 0 auto;
}

.collect .content .pagination {
  text-align: center;
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin: 10px 0;
}

.collect .content .goods-list {
  margin-left: -13.7px;
  overflow: hidden;
}

/* 收藏列表为空的时候显示的内容CSS */
.collect .collect-empty {
  width: 1225px;
  margin: 0 auto;
}

.collect .collect-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}

.collect .collect-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}

.collect .collect-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}

/* 收藏列表为空的时候显示的内容CSS END */
</style>