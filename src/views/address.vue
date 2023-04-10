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
      <div class="goods-list" v-if="addressList.length > 0">
        <p style="margin: 8px 20px 20px 16px">
          <el-button type="info" style="width: 200px" @click="addressVisible = true">新增地址</el-button>
        </p>
        <MyAddress :list="addressList" @updateCurAddress="updateCurAddress"></MyAddress>
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

    <el-dialog title="新增地址" :visible.sync="addressVisible" width="500px" :before-close="handleClose">
      <el-form ref="addressForm" :model="addressForm" :rules="rules" label-width="80px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addressForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="areaCode">
          <el-cascader :options="areaSelectData" @change="handleChange" size="large"
            v-model="addressForm.areaCode" placeholder="请选择您所在的城市" style="width: 100%" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAddressList, addAddress, updateAddress } from '@/api/hasToken'
import MyAddress from '@/components/address'

import { regionData, 
    CodeToText,
    // TextToCode
  } from "element-china-area-data";

export default {
  data() {
    return {
      addressList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      addressVisible: false,
      addressForm: {
        name: null,
        phone: null,
        areaCode: null,
        address: null,
        areaName: null
      },
      rules: {
        areaCode: [
          { required: true, message: '请选择省市区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ]
      },
      areaSelectData: regionData
    }
  },
  components: {
    MyAddress
  },
  activated() {
    this.getAddressList()
  },
  methods: {
    getAddressList() {
      // 获取地址数据
      getAddressList(this.queryParams).then(res => {
        this.addressList = [...res.data.list]
        this.total = res.data.total
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    // 修改地址
    updateCurAddress(row) {
      this.addressVisible = true
      this.addressForm = { ...row }
      console.log(this.addressForm)
      this.addressForm.areaCode = row.areaCode.split(',')
    },
    // 新增地址
    confirmAdd() {
      if(this.addressForm.hasOwnProperty('id')) {
        updateAddress({...this.addressForm}).then(() => {
          this.addressVisible = false
          this.notifySucceed('修改地址成功')
          this.getAddressList()
        })
      } else {
        addAddress({...this.addressForm}).then(() => {
          this.addressVisible = false
          this.notifySucceed('新增地址成功')
          this.getAddressList()
        })
      }
    },
    handleClose() {
      this.addressVisible = false
      this.addressForm = {
        name: null,
        phone: null,
        areaCode: null,
        address: null,
        areaName: null
      }
      this.$refs.addressForm.resetFields()
    },
    handleChange(value) {
      // value为省市区code数组
      if (value) {
        const provinceCode = CodeToText[value[0]] //code转为省
        const cityCode = CodeToText[value[1]] //市
        const orgion = CodeToText[value[2]] //区

        this.$nextTick(() => {
          this.addressForm.areaCode = value.join(',')
          this.addressForm.areaName = provinceCode + '/' + cityCode + '/' + orgion
        })
      }
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
  min-height: 400px;
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