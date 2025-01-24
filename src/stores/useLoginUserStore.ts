import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * 存储登录用户信息的store
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<any>({
    userName: '未登录',
  })

  async function fetchLoginUser() {
    //todo: 调用接口获取登录用户信息
    setTimeout(() => {
      loginUser.value = { userName: '测试用户1' ,id: 1}
    },3000)
  }
  /**
   * 设置登录用户
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }


  return { loginUser, fetchLoginUser, setLoginUser }
})
