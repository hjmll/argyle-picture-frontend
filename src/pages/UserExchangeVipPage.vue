<template>
  <!-- @author 程序员鱼皮 <a href="https://www.codefather.cn">编程导航原创项目</a> -->


  <div id="vipExchangePage">

    <div class="vipinfor">
            <!-- 修改后的视频标签 -->
             <div class="video-container">
            <video src="D:\jishe\argyle-picture-frontend-master\mypic\13389032_3840_2160_30fps.mp4" style="width: 100%; height: 100%; object-fit: cover;" autoplay="autoplay" loop="loop" muted="muted"></video>
             
            <div class="video-center-text">选择我们<CheckOutlined /><br>

              映象视界，你值得信赖
            </div>
            <div class="video-overlay"></div>
          </div>
    </div>
<div class="line" style="height: 10px; margin-bottom: 50px;"> </div>
<h2 class="section-title">会员码兑换</h2>
<p class="question-text"> <span class="highlight">为什么</span>要升级会员？</p>
<h3 class="advantage-title"><span class="highlight">更大</span>的存储空间，<span class="highlight">更多</span>的存储数量</h3>
<div class="package-container">
  <div class="package-item">
    <div class="package-name">普通版</div>
    <div class="package-detail">大小 100.00 MB， 数量 100</div>
    <div class="package-description">普通版适合偶尔使用、存储少量文件的用户，满足基本的日常存储需求。但随着您的数据不断积累，很快就会面临存储空间不足的问题。</div>
  </div>
  <div class="package-item">
    <div class="package-name">专业版</div>
    <div class="package-detail">大小 1000.00 MB， 数量 1000</div>
    <div class="package-description">专业版专为有一定存储需求的用户打造，无论是摄影师保存高清作品，还是设计师存储创意素材，都能轻松应对，让您的创作不受空间限制。</div>
  </div>
  <div class="package-item">
    <div class="package-name">旗舰版</div>
    <div class="package-detail">大小 10000.00 MB， 数量 10000</div>
    <div class="package-description">旗舰版是为大型企业和重度数据使用者准备的，海量的存储空间让您可以存储公司的所有业务数据、历史档案等，全方位保障您的数据安全与存储需求。</div>
  </div>
</div>

    <!-- 兑换码表单 -->
    <a-form name="formData" layout="vertical" :model="formData" @finish="handleSubmit">
      <div class="line" style="height: 10px; margin-bottom: 50px;"> </div>
      <a-form-item name="vipCode" label="兑换码">
        <a-input v-model:value="formData.vipCode" placeholder="请输入会员兑换码" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button 
          type="primary" 
          html-type="submit" 
          style="
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            text-align: center; 
            background-color: #000;
            color: #fff;
            border: none;
          "
          :loading="loading"
          :style="{
            backgroundColor: hovering ? '#333' : '#000'
          }"
          @mouseenter="hovering = true"
          @mouseleave="hovering = false"
        >
          兑换
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { exchangeVipUsingPost } from '@/api/userController.ts'
import { useRouter } from 'vue-router'
import { CheckOutlined } from '@ant-design/icons-vue'
// 表单数据
const formData = reactive<API.VipExchangeRequest>({
  vipCode: '',
})

// 提交任务状态
const loading = ref(false)

const router = useRouter()

/**
 * 提交表单
 */
const handleSubmit = async () => {
  // 校验兑换码是否为空
  if (!formData.vipCode) {
    message.error('请输入兑换码')
    return
  }

  loading.value = true

  try {
    // 调用兑换 API
    const res = await exchangeVipUsingPost({
      vipCode: formData.vipCode,
    })

    // 操作成功
    if (res.data.code === 0 && res.data.data) {
      message.success('兑换成功！')
      // 跳转到主页或其他页面
      router.push({
        path: `/`,
      })
    } else {
      message.error('兑换失败：' + res.data.message)
    }
  } catch (error) {
    message.error('兑换失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
//开始720px
</script>

<style scoped>
#vipExchangePage {
  max-width: 1200px;
  margin: 0 auto;

}

.vipinfor {
  background-color: #f0f0f0;
  
  border-radius: 8px;
  width: 100%;
  height: 70vh;

}
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 黑色蒙层，透明度 0.5 */
}
.video-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white; 
  font-size: 48px; /* 文字大小 */
  font-weight: bold; /* 文字加粗 */
  text-align: center; /* 文字居中对齐 */
  z-index: 1; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 添加文字阴影 */
}
.section-title {
  margin-bottom: 16px;
  font-size: 40px;
  text-align: center;
  color: #333;
  transition: color 0.3s ease;
}

.section-title:hover {
  color: #007BFF;
}

.question-text {
  text-align: center;
  font-size: 20px;
  color: #555;
}

.advantage-title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.advantage-title:hover {
  transform: scale(1.05);
}

.highlight {
  color: #007BFF;
  font-weight: bold;
}

.package-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.package-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  text-align: center;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.package-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.package-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.package-detail {
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
}

.package-description {
  font-size: 14px;
  color: #777;
  line-height: 1.6;
}
</style>
