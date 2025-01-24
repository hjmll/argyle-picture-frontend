<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">阿盖尔云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick"/>
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            {{loginUserStore.loginUser.username ?? '无名'}}
          </div>
          <div v-else>
            <a-button type="primary" href="user/login">登录</a-button>
          </div>

        </div>
      </a-col>
    </a-row>
  </div>

</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { HomeOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const loginUserStore = useLoginUserStore()

const items = ref<MenuProps['items']>([
  {
    key:'/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页'
  },
  {
    key:'/about',
    label: '关于',
    title: '关于'
  },
  {
    key:'other',
    label:h('a',{href:'https://github.com/hjmll'},'阳光阿盖尔'),
    title: '阳光阿盖尔'
  }

]);
const router = useRouter();
const current = ref<string[]>(['mail']);
router.afterEach((to,from,next) => {
  current.value = [to.path]
})
const doMenuClick = ({ key }) => {

  router.push({
    path: key
  })
}



</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
