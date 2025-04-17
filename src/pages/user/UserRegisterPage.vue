<template>
  <div class="background">
    <!-- 添加蒙版元素 -->
    <div class="overlay"></div>
    <!-- 使用 Flex 布局的容器 -->
    <div class="register-container">
      
      <!-- 左边的注册表单部分 -->
      <div class="register-form-section">
        <div id="userRegisterPage">
          <div class="register-form-animation">
           
        
            <h2 class="title title-animation" style="margin-bottom:100px;"> 开始分享你的照片，<br>让每一个珍贵瞬间在我们的云图库中永久留存。<br>展示你的独特视角，发现更多精彩内容</h2>
            <h2 class="title">映象视界 - 用户注册</h2>
            <div class="desc">企业级智能协同云图库</div>
            <a-form
              :model="formState"
              name="basic"
              label-align="left"
              autocomplete="off"
              @finish="handleSubmit"
            >
              <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
                <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
              </a-form-item>
              <a-form-item
                name="userPassword"
                :rules="[
                  { required: true, message: '请输入密码' },
                  { min: 8, message: '密码不能小于 8 位' },
                ]"
              >
                <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
              </a-form-item>
              <a-form-item
                name="checkPassword"
                :rules="[
                  { required: true, message: '请输入确认密码' },
                  { min: 8, message: '确认密码不能小于 8 位' },
                ]"
              >
                <a-input-password v-model:value="formState.checkPassword" placeholder="请输入确认密码" />
              </a-form-item>
              <div class="tips">
                已有账号？
                <RouterLink to="/user/login">去登录</RouterLink>
              </div>
              <a-form-item>
                <a-button type="primary" html-type="submit" style="
                    width: 100%;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    text-align: center; 
                    background-color: #000;
                    color: #fff;
                    border: none;
                  ">注册</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <!-- 右边的图片部分 -->
      <div class="image-section">
        <img src="../../../mypic/pexels-muverrihhanim-17718007.jpg" alt="注册图片" class="register-image">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { userRegisterUsingPost } from '@/api/userController'

const formState = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const router = useRouter()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values) => {
  if (formState.userPassword !== formState.checkPassword) {
    message.error('二次输入的密码不一致')
    return
  }
  const res = await userRegisterUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    router.push({
      path: '/user/login',
      replace: true,
    })
  } else {
    message.error('注册失败，' + res.data.message)
  }
}
</script>

<style scoped>




.register-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.register-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px; 
  z-index: -1;
}

#userRegisterPage {
  max-width: 360px;
}

.title {
  text-align: center;
  margin-bottom: 16px;
  font-size: 28px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
  font-size: 18px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 16px;
  text-align: right;
}

.ant-input,
.ant-input-password,
.ant-btn {
  font-size: 18px;
  height: 48px;
  padding: 0 16px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-form-animation {
  animation: fadeInUp 0.8s ease-out;
}

/* 定义淡入和缩放动画 */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 应用动画到标题 */
.title-animation {
  animation: fadeInScale 1s ease-out forwards;
}
</style>
