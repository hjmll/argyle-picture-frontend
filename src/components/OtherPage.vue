<template>
  <div>
    <p>登录时间: {{ loginTime }}</p>
    <p>昵称: {{ loginUser?.userName }}</p>
    <input v-model="newNickname" placeholder="输入新昵称" />
    <button @click="updateNickname">修改昵称</button>
  </div>
</template>

<script setup lang="ts">
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts';
import { ref, computed } from 'vue';

const loginUserStore = useLoginUserStore();
const loginUser = computed(() => loginUserStore.getLoginUser);
const loginTime = computed(() => loginUserStore.getLoginTime);

const newNickname = ref('');

const updateNickname = () => {
  if (newNickname.value) {
    loginUserStore.updateNickname(newNickname.value);
    alert('昵称修改成功');
  }
};
</script>

<style scoped>
/* 样式代码 */
</style>
