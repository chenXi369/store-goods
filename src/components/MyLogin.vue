<!--
 * @Description: 登录组件
 -->
<template>
  <div id="myLogin">
    <el-dialog title="登录" width="300px" center :visible.sync="isLogin">
      <el-form :model="LoginUser" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" placeholder="请输入账号" v-model="LoginUser.name"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请输入密码"
            v-model="LoginUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Login" style="width:100%;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex"
import { getUserInfo } from '@/api/hasToken'

export default {
  name: "MyLogin",
  data() {
    // 用户名的校验方法
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else {
        callback()
      }
    }
    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      }
      // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
      const passwordRule = /^[a-zA-Z]\w{4,16}$/;
      if (passwordRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass")
        return callback()
      } else {
        return callback(
          new Error("字母开头,长度5-17之间,允许字母数字和下划线")
        );
      }
    };
    return {
      LoginUser: {
        name: "",
        pass: ""
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    // 获取vuex中的showLogin，控制登录组件是否显示
    isLogin: {
      get() {
        return this.$store.getters.getShowLogin;
      },
      set(val) {
        this.$refs["ruleForm"].resetFields();
        this.setShowLogin(val);
      }
    }
  },
  methods: {
    ...mapActions(["setUser", "setShowLogin"]),
    Login() {
      this.$refs["ruleForm"].validate(valid => {
        //如果通过校验开始登录
        if (valid) {
          this.$axios
            .post("/user/login", {
              userName: this.LoginUser.name,
              password: this.LoginUser.pass
            })
            .then(res => {
              if (res.data.code === 200) {
                // 隐藏登录组件
                this.isLogin = false
                // 登录信息存到本地
                let user = res.data.data
                localStorage.setItem("user", user)
                // 登录信息存到vuex
                this.setUser(res.data.data)

                this.getUserInfo()
                // 弹出通知框提示登录成功信息
                this.notifySucceed('登录成功！')
              } else {
                // 清空输入框的校验状态
                this.$refs["ruleForm"].resetFields()
                // 弹出通知框提示登录失败信息
                this.notifyError(res.data.msg)
              }
            })
            .catch(err => {
              return Promise.reject(err)
            })
        } else {
          return false
        }
      })
    },
    // 获取用户信息
    getUserInfo() {
      getUserInfo().then(res => {
        localStorage.setItem("userInfo", JSON.stringify(res.data))
      })
    }
  }
}
</script>
<style>
</style>