<template>
  <div class="personal-info-container">
    <!-- 头像上传区域 -->
    <div class="avatar-section">
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        @change="handleAvatarChange"
      >
      
        <!-- 修改 img 样式，添加 class -->
        <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar round-avatar" />
        <!-- 修改 el-icon 样式，添加 class -->
        <el-icon v-else class="avatar-icon round-avatar"><Plus /></el-icon>
      </el-upload>
    </div>

    <!-- 信息表单 -->
    <el-form ref="formRef" :model="userInfo" :rules="formRules" label-width="120px">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="userInfo.nickname" clearable />
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="loginUser.userAccount" disabled />
      </el-form-item>
      <el-form-item label="id号">
        <el-input v-model="loginUser.id" disabled />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-input v-model="riqi"  disabled/>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="updateUserName"
          class="black-button"
        >保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, reactive, ref } from 'vue';
import type { FormInstance, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts';

const loginUserStore = useLoginUserStore();

onBeforeMount(() => {
  // 从 localStorage 中读取用户名
  const storedUserName = localStorage.getItem('userName'); 
  console.log(storedUserName);
  userInfo.nickname = storedUserName || '';
})
onMounted(() => {
  try {
    const res = loginUserStore.loginUser;
    // 从 localStorage 中读取用户名
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      userInfo.nickname = storedUserName;
      res.userName = storedUserName;
      console.log(storedUserName);
      loginUserStore.setLoginUser(res);
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
})
const loginUser = loginUserStore.loginUser;

const res=loginUser;
// 修改 
function updateUserName(){
  res.userName = userInfo.nickname;
  loginUserStore.setLoginUser(res);
  console.log(loginUser);
  // 将修改后的用户名存储到 localStorage 中
  localStorage.setItem('userName', userInfo.nickname);
  localStorage.setItem('avatar', userInfo.avatar);
        res.userAvatar = userInfo.avatar;
        loginUserStore.setLoginUser(res);
  ElMessage.success('保存修改成功');
}
// 初始化用户信息
const userInfo = reactive<UserInfo>({
  avatar: loginUser.userAvatar,
  nickname: localStorage.getItem('userName'),
  
});

const splitDateTime = (dateTimeStr: string) => {
  const parts = dateTimeStr.split('T');
  const datePart = parts[0];
  const timePart = parts[1]?.split('.')[0] || '';
  return {
    date: datePart,
    time: timePart
  };
};

// 示例使用
const dateTimeStr = loginUser.createTime;
const { date, time } = splitDateTime(dateTimeStr);
const riqi=date+time
// 表单引用
const formRef = ref<FormInstance>();

// 表单验证规则
const formRules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 16, message: '长度在 2 - 16 个字符', trigger: 'blur' }
  ]
};

// 头像上传前的校验
const beforeAvatarUpload = (file: File): boolean => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件');
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB');
  }
  return isImage && isLt2M;
};

// 处理头像上传变化
const handleAvatarChange = (file: UploadFile) => {
  if (file.raw) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        userInfo.avatar = e.target.result as string;
       
      }
    };
    reader.readAsDataURL(file.raw);
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    // 模拟调用 API 保存修改
    setTimeout(() => {
      ElMessage.success('个人信息保存成功');
    }, 1000);
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};
</script>

<style scoped>
.personal-info-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-section {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .avatar-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.black-button {
  background-color: #000;
  border-color: #000;
  color: #fff;
}
.round-avatar {
  border-radius: 50%;
  object-fit: cover; /* 确保图片填充整个圆形区域 */
}
</style>