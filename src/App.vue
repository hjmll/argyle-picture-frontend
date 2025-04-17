
<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <BasicLayout />
    </div>

  </a-config-provider>

</template>

<script setup lang="ts">

import zhCN from "ant-design-vue/es/locale/zh_CN";

import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");
import BasicLayout from '@/layouts/BasicLayout.vue'
// import { healthCheckUsingGet } from '@/api/mainController.ts'
// import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
//
// const loginUserStore = useLoginUserStore()
// loginUserStore.fetchLoginUser()
//
// healthCheckUsingGet().then(res => {
//   console.log(res)
// })

</script>

<style scoped>

</style>
