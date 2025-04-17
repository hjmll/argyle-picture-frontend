<template>
  <div id="globalSider">
    <el-aside v-if="loginUserStore.loginUser.id" width="200px">
      <el-menu
        mode="vertical"
        :default-active="current"
        @select="doMenuClick"
         :key="current"
      >
        <!-- 固定菜单 -->
        <template v-for="item in fixedMenuItems" :key="item.key">
          <el-menu-item :index="item.key">
            <template #title>
              <el-icon><icon-menu /></el-icon><span>{{ item.label }}</span>
            </template>
          </el-menu-item>
        </template>
        <!-- 团队空间菜单组 -->
      
      </el-menu>
    </el-aside>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController.ts'
import { ElMessage } from 'element-plus'

// 固定的菜单列表
const fixedMenuItems = [
  {
    key: '/',
    label: '公共图库',
  },
  {
    key: '/my_space',
    label: '我的空间',
  },
  {
    key: `/add_space?type=${SPACE_TYPE_ENUM.TEAM}`,
    label: '创建团队',
  },
]

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 当前选中菜单
const current = ref<string>('')
// 监听路由变化，更新当前选中菜单
router.afterEach((to) => {
  current.value = to.path
  
})

// 路由跳转事件
const doMenuClick = (key: string) => {
  router.push(key)
}

const teamSpaceList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  // 没有团队空间，只展示固定菜单
  if (teamSpaceList.value.length < 1) {
    return fixedMenuItems
  }
  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: `/space/${spaceUser.spaceId}`,
      label: space?.spaceName,
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }
  return [...fixedMenuItems, teamSpaceMenuGroup]
})

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    ElMessage.error(`加载我的团队空间失败，${res.data.message}`)
  }
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})
</script>

<style scoped>
#globalSider {
  background: none;
}

/* 修改选中菜单项的样式 */

</style>    