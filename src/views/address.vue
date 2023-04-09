<!--
 * @Description: 我的收藏页面组件
 -->
 <template>
  <div class="collect">
    <!-- Add a static page for my favorite module -->
    <div class="collect-header">
      <div class="collect-title">
        <i class="el-icon-collection-tag" style="color: #ff6700;"></i>
        我的地址
      </div>
    </div>
    <div class="content">
      <div class="goods-list" v-if="addressList.length>0">
        <MyAddress :list="addressList" :isDelete="true"></MyAddress>
      </div>
      <!-- 收藏列表为空的时候显示的内容 -->
      <div v-else class="collect-empty">
        <div class="empty">
          <h2>您的地址还是空的！</h2>
          <p>快去添加地址吧！</p>
          <p>
            <el-button type="info" style="width: 200px" @click="addressVisible = true">新增地址</el-button>
          </p>
        </div>
      </div>
      <!--  收藏列表为空的时候显示的内容END -->
    </div>

    <el-dialog
      title="新增地址"
      :visible.sync="addressVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAddressList } from '@/api/hasToken'
import MyAddress from '@/components/address'

export default {
  data() {
    return {
      addressList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      addressVisible: false
    }
  },
  components: {
    MyAddress
  },
  activated() {
    // 获取收藏数据
    getAddressList({...this.queryParams}).then(res => {
      this.addressList = [ ...res.data.list ]
      this.total = res.data.total
    }).catch(err => {
      return Promise.reject(err)
    })
  },
  methods: {
    // 新增地址
    addAddress() {

    },
    handleClose() {
      this.addressVisible = false
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
  padding: 20px 0;
  width: 1225px;
  margin: 0 auto;
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