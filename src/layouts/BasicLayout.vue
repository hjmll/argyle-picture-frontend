<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header"><GlobalHeader /></a-layout-header>
      <!-- 使用 a-layout-sider 明确侧边栏 -->
      <a-layout>
        <a-layout-sider 
          class="sider"  
          v-if="loginUserStore.loginUser.id" 
          :width="siderCollapsed ? 65 : 200"
        > 
          <!-- 绑定处理方法到事件 -->
          <GlobalSider @isCollapse="handleSiderCollapse" />
        </a-layout-sider>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        <a href="https://github.com/hjmll" target="_blank"> 映象视界 by hjm </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts';
import { onMounted, ref } from 'vue';

const loginUserStore = useLoginUserStore();

// 定义变量存储侧边栏折叠状态
const siderCollapsed = ref(false);

// 定义处理方法
const handleSiderCollapse = (collapsed: boolean) => {
  siderCollapsed.value = collapsed;
  console.log('侧边栏折叠状态:', siderCollapsed.value);
};

onMounted(async () => {
  try {
    await loginUserStore.fetchLoginUser();
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
});
const loginUser = loginUserStore.loginUser;
console.log(loginUser.userName);
</script>

<style scoped>
#basicLayout .header {
  padding-inline: 20px;
  background: white;
  color: unset;
  margin-bottom: 1px;
}

#basicLayout .sider {
  background: #fff;
  border-right: 0.5px solid #eee;
  padding-top: 20px;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

#basicLayout .content {
  padding: 28px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1000;
}
</style>