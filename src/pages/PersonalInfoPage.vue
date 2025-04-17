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
        <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
        <el-icon v-else class="avatar-icon"><Plus /></el-icon>
      </el-upload>
    </div>

    <!-- 信息表单 -->
    <el-form ref="formRef" :model="userInfo" :rules="formRules" label-width="120px">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="userInfo.nickname" clearable />
      </el-form-item>
      <el-form-item label="团队昵称">
        <el-input v-model="userInfo.teamNickname" disabled />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-input v-model="userInfo.registerTime" disabled />
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="submitForm">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// 定义用户信息类型
interface UserInfo {
  avatar: string;
  nickname: string;
  teamNickname: string;
  registerTime: string;
}

// 初始化用户信息
const userInfo = reactive<UserInfo>({
  avatar: 'https://example.com/default-avatar.png',
  nickname: '默认昵称',
  teamNickname: '示例团队',
  registerTime: '2024-01-01 12:00:00'
});

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
</style>