<!--
 * @Description: 列表组件，用于首页、全部产品页面的商品列表
 -->
 <template>
  <div id="myList" class="myList">
    <ul>
      <li v-for="item in list" :key="item.id">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="20" style="line-height: 40px">
              {{ item.areaName.replaceAll('/', '') }}{{ item.address }}
            </el-col>
            <el-col :span="4" style="text-align: right; padding: 0 20px;">
              <el-button type="text"  icon="el-icon-edit"
                @click="updateAddress(item)">修改</el-button>
              <el-button style="color: red; margin-left: 20px;" icon="el-icon-delete"
                type="text" @click="deleteAddress(item)">删除</el-button>
            </el-col>
          </el-row>          
        </el-card>
      </li>
    </ul>
  </div>
</template>
<script>
import { delAddress } from '@/api/hasToken'

export default {
  name: "MyList",
  // list为父组件传过来的商品列表
  // isMore为是否显示“浏览更多”
  props: ["list", "isMore", "isDelete"],
  data() {
    return {}
  },
  methods: {
    // 地址删除
    deleteAddress(row) {
      this.$confirm('是否确认删除该地址？', '提示', {
        type: 'warning'
      }).then(() => {
        delAddress(row.id).then(() => {
          // 删除删除列表中的该商品信息
          for (let i = 0; i < this.list.length; i++) {
            const temp = this.list[i];
            if (temp.id == row.id) {
              this.list.splice(i, 1);
            }
          }
          // 提示删除成功信息
          this.notifySucceed('删除成功！')
        })
      })
    },
    // 修改地址
    updateAddress(row) {
      this.$emit('updateCurAddress', row)
    }
  }
}
</script>
<style scoped>
.myList ul li {
  z-index: 1;
  float: left;
  width: 100%;
  height: 80px;
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
  width: 100%;
  height: 80px;
  background: url(../assets/imgs/placeholder.png) no-repeat 50%;
  margin: 0 auto;
}
.myList ul li h2 {
  margin: 25px 10px 0;
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