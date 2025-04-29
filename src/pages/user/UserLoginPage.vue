<template>
  <div :style="background">
    <!-- 添加蒙版元素 -->
    <div class="overlay"></div>
    <div id="userLoginPage">
      <div class="login-form-animation">
        <!-- 修改标题颜色为白色 -->
        <h2 class="title" style="color: #fff;">映象视界 - 用户登录</h2>
        <!-- 修改描述颜色为浅灰色 -->
        <div class="desc" style="color: #ccc;">企业级智能协同云图库</div>
        <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
          <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
            <!-- 修改输入框占位符颜色为浅灰色 -->
            <a-input 
              v-model:value="formState.userAccount" 
              placeholder="请输入账号" 
              style="color: #000; ::placeholder { color: #ccc; }"
            />
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
          <div class="tips">
            没有账号？
            <RouterLink to="/user/register">去注册</RouterLink>
          </div>
          <a-form-item>
            <a-button  type="primary" html-type="submit"  style="
                width: 100%;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                text-align: center; 
                background-color: #000;
                color: #fff;
                border: none;
              ">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userLoginUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { reactive,ref} from 'vue'

const background = ref({
  // 使用驼峰命名法，将 url 作为字符串处理
  backgroundImage: `url("../mypic/pexels-kuma-jio-2150949207-31416365.jpg")`,
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '100%',
  minHeight: '100vh',
  position: 'relative' // 为蒙版定位做准备
})

const formState = reactive<{
  userAccount: string;
  userPassword: string;
}>({
  userAccount: '',
  userPassword: '',
})

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: { userAccount: string; userPassword: string }) => {
  const res = await userLoginUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    loginUserStore.setLoginUser(res.data.data)
    message.success('登录成功')
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      router.push({
        path: redirect,
        replace: true,
      })
    } else {
      router.push({
        path: '/',
        replace: true,
      })
    }
  } else {
    message.error('登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
.background { 
  background: url("../mypic/pexels-kuma-jio-2150949207-31416365.jpg") center center no-repeat;
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  position: relative; /* 为蒙版定位做准备 */
}

/* 新增蒙版样式，设置为黑色 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 使用 rgba 设置黑色蒙版，最后一个参数 0.5 是透明度，可按需调整 */
  background-color: rgba(0, 0, 0, 0.5); 
}

#userLoginPage {
 padding-top: 100px;
  max-width: 480px; 
  margin: 0 auto;
  position: relative; /* 确保表单内容显示在蒙版之上 */
  z-index: 1; /* 确保表单内容显示在蒙版之上 */
}

.title {
  text-align: center;
  margin-bottom: 24px; 
  font-size: 28px; 
  color: #fff; /* 设置标题颜色为白色 */
}

.desc {
  text-align: center;
  margin-bottom: 24px; 
  font-size: 18px; 
  color: #ccc; /* 设置描述颜色为浅灰色 */
}

.tips {
  margin-bottom: 24px; 
  font-size: 16px; 
  text-align: right;
  color: #ccc; /* 设置提示文字颜色为浅灰色 */
}

.ant-input::placeholder, .ant-input-password::placeholder {
  color: #ccc; /* 设置输入框占位符颜色为浅灰色 */
}

.ant-input, .ant-input-password {
  color: #fff; /* 设置输入框文字颜色为白色 */
}

.ant-input, .ant-input-password, .ant-btn {
  font-size: 18px;
  height: 48px;
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

.login-form-animation {
  animation: fadeInUp 0.8s ease-out;
}
</style>
