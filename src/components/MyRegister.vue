<!--
 * @Description: 用户注册组件
 -->
<template>
  <div id="register">
    <el-dialog title="注册" width="500px" center :visible.sync="isRegister">
      <el-form
        :model="RegisterUser"
        :rules="rules"
        status-icon
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入账号"
            v-model="RegisterUser.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="nickName">
          <el-input
            prefix-icon="el-icon-s-custom"
            placeholder="请输入昵称"
            v-model="RegisterUser.nickName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span>上传头像</span>
          <el-upload
            class="avatar-uploader"
            action="https://h3w3053111.oicp.vip/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            
            <img v-if="RegisterUser.avatar" :src="RegisterUser.avatar" class="avatar">
            
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请输入密码"
            v-model="RegisterUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请再次输入密码"
            v-model="RegisterUser.confirmPass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Register" style="width:100%">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "MyRegister",
  props: ["register"],
  data() {
    // 用户名的校验方法
    let validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"))
      }
      // 用户名以字母开头,长度在5-16之间,允许字母数字下划线
      const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
      if (!userNameRule.test(value)) {
        callback(new Error("字母开头,长度5-16之间,允许字母数字下划线"))
      } else {
        callback()
      }
    }
    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
      }
      // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
      const passwordRule = /^[a-zA-Z]\w{5,17}$/
      if (!passwordRule.test(value)) {
        callback(
          new Error("字母开头,长度6-18之间,允许字母数字和下划线")
        )
      } else {
        callback()
      }
    }
    // 确认密码的校验方法
    let validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"))
      }
      // 校验是否以密码一致
      if (this.RegisterUser.pass == "" && value !== this.RegisterUser.pass) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }
    return {
      isRegister: false, // 控制注册组件是否显示
      RegisterUser: {
        name: "",
        pass: "",
        avatar: null,
        nickName: null,
        confirmPass: ""
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        nickName: [{ required: true, message: '请输入分类', trigger: 'blur' }],
        confirmPass: [{ validator: validateConfirmPass, trigger: "blur" }]
      }
    }
  },
  watch: {
    // 监听父组件传过来的register变量，设置this.isRegister的值
    register: function(val) {
      if (val) {
        this.isRegister = val;
      }
    },
    // 监听this.isRegister变量的值，更新父组件register变量的值
    isRegister: function(val) {
      if (!val) {
        this.$refs["ruleForm"].resetFields();
        this.$emit("fromChild", val);
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.RegisterUser.avatar = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    Register() {
      // 通过element自定义表单校验规则，校验用户输入的用户信息
      this.$refs["ruleForm"].validate(valid => {
        //如果通过校验开始注册
        if (valid) {
          this.$axios
            .post("/user/register", {
              nickName: this.RegisterUser.nickName,
              userName: this.RegisterUser.name,
              password: this.RegisterUser.pass,
              avatar: this.RegisterUser.avatar
            })
            .then(res => {
              if (res.data.code === 200) {
                // 隐藏注册组件
                this.isRegister = false
                // 弹出通知框提示注册成功信息
                this.notifySucceed(res.data.msg)
              } else {
                // 弹出通知框提示注册失败信息
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
    }
  }
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>