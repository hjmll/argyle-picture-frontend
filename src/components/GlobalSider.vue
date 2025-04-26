<template>
  <div id="globalSider" ref="siderRef">
    <el-button 
      @click="isCollapse = !isCollapse"
      :class="['no-border-button', { 'expanded-button': !isCollapse, 'collapsed-button': isCollapse }]"
    >
      <el-icon>
        <!-- 根据 isCollapse 状态动态显示图标 -->
        <template v-if="isCollapse">
          <ArrowRightBold />
        </template>
        <template v-else>
          <el-icon><ArrowLeftBold /></el-icon><el-icon><ArrowLeftBold /></el-icon><el-icon><ArrowLeftBold /></el-icon>收回
        </template>
      </el-icon>
    </el-button>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo custom-menu" 
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- 原有的菜单项，修改 index 属性并添加 @click 事件 -->
    <el-menu-item :index="fixedMenuItems[0].key" @click="doMenuClick(fixedMenuItems[0].key)">
      <el-icon><IconMenu /></el-icon>
      <template #title>公共图库</template>
    </el-menu-item>
    <el-menu-item :index="fixedMenuItems[1].key" @click="doMenuClick(fixedMenuItems[1].key)">
      <el-icon><Document /></el-icon>
      <template #title>我的空间</template>
    </el-menu-item>
    <el-menu-item :index="fixedMenuItems[2].key" @click="doMenuClick(fixedMenuItems[2].key)">
      <el-icon><Setting /></el-icon>
      <template #title>创建团队</template>
    </el-menu-item>
  </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect,watch,defineEmits} from 'vue'
import { useRouter } from 'vue-router'
// 移除 .ts 扩展名
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { SPACE_TYPE_ENUM } from '@/constants/space'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController'
import { ElMessage } from 'element-plus'
import {
  ArrowLeftBold,
  ArrowRightBold,
  Document,
  Menu as IconMenu,
  Setting,
  DArrowRight,
  DArrowLeft,
} from '@element-plus/icons-vue'
const emit = defineEmits(['isCollapse'])
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
// 修改初始值为 false，让侧边栏默认展开
const isCollapse = ref(false)
// 定义 ref 引用侧边栏元素

watch(isCollapse,(New, Old)=>{
  emit('isCollapse',New)

	console.log(`新值:${New} ——— 老值:${Old}`)
})
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  height: 100vh;
}

/* 新增样式，去掉按钮边框 */
.no-border-button {
  border: none;
  padding: 0; 
  background: transparent; 
}

/* 菜单栏展开时按钮的样式 */
.expanded-button {
  width: 200px; /* 可根据实际情况调整 */
  text-align: left; /* 让内容靠左显示 */
}

/* 菜单栏折叠时按钮的样式 */
.collapsed-button {
  width: 65px; /* 可根据实际情况调整 */
}

/* 激活菜单项的样式 */
.custom-menu .el-menu-item.is-active {
  border: 1px solid #000;
  color: #fff;
  background-color: #000;
}
</style>    