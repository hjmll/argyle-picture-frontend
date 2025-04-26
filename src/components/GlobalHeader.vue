<template>
  <div id="globalHeader" ref="headerRef">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../../public/fdc3e171200c4e0c628f2de1714c2de6.jpg" alt="logo" />
            <div class="title animated-title">映象视界</div>
          </div>
        </router-link>
      </a-col>
      <div class="header-col menu-col">
        <nav class="custom-menu">
         
          <div 
            v-for="item in items" 
            :key="item.key" 
            :class="{ 'active-border': activeItem === item.key }"
          >
            <router-link 
              style="text-decoration: none;
              color: #000; 
             
              transition: all 0.3s ease;
              font-size: 16px;
              "
              active-class="after-active"
              :to="item.key" 
              @click="doMenuClick({ key: item.key }); setActiveItem(item.key)"
            >
              {{ typeof item.label === 'string' ? item.label : item.label.textContent }}
            </router-link>
          </div>
        </nav>
      </div>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space>
                
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </a-space>

              <template #overlay>

                <a-menu>
                  <a-menu-item>
                    <router-link to="/my_space">
                      <FundViewOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                  
                  <a-menu-item>
                    <router-link to="/my_information">
                      <UserOutlined />
                      个人信息
                    </router-link>
                  </a-menu-item>


                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button  style="
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            text-align: center; 
            background-color: #000;
            color: #fff;
            border: none;
          " type="primary" href="user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
    
</template>
<script lang="ts" setup>
import { computed, h, ref, onMounted, onUpdated } from 'vue'
import { HomeOutlined, LogoutOutlined, UserOutlined,FundViewOutlined} from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import { watch } from 'vue';

const loginUserStore = useLoginUserStore()
const router = useRouter()

// 未经过滤的菜单项
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/user_exchange_vip',
    label: '会员兑换',
    title: '会员兑换',
  },

  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    title: '空间管理',
  },
  {
    key: '/admin/categoryManage',
    label: '分类管理',
    title: '分类管理',
  },
  {
    key: '/admin/tagManage',
    label: '标签管理',
    title: '标签管理',
  },
  {
    key: '/about',
    label: '关于',
    title: '关于',
  },
  {
    key: 'other',
    label: h('a', { href: 'https://github.com/hjmll' }, '阳光阿盖尔'),
    title: '阳光阿盖尔',
  },
]

// 根据权限过滤菜单项
const filterMenu = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 管理员才能看到 /admin 开头的菜单
    if (menu?.key?.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}



// 展示在菜单的路由数组
const items = computed(() => filterMenu(originItems))

const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}

const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push({
      path: '/user/login',
    })
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}

// 初始化 activeItem 为空字符串
const activeItem = ref('')
const setActiveItem = (key: string) => {
  activeItem.value = key
}

// 处理路由变化
const handleRouteChange = (to) => {
  const matchedItem = items.value.find(item => item.key === to.path)
  if (matchedItem) {
    activeItem.value = to.path
  } else {
    activeItem.value = ''
  }
}
// 在组件挂载时从 localStorage 读取最新的用户名
onMounted(() => {
  const storedUserName = localStorage.getItem('userName');
  if (storedUserName) {
    loginUserStore.setLoginUser({
      ...loginUserStore.loginUser,
      userName: storedUserName
    });
  }
});
router.afterEach((to) => {
  handleRouteChange(to)
})
const headerRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startY = ref(0);
const initialTop = ref(0);

const handleMouseDown = (e: MouseEvent) => {
  if (headerRef.value) {
    isDragging.value = true;
    startY.value = e.clientY;
    initialTop.value = parseInt(getComputedStyle(headerRef.value).top);
  }
};
const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value && headerRef.value) {
    const offsetY = e.clientY - startY.value;
    headerRef.value.style.top = `${initialTop.value + offsetY}px`;
  }
};

const handleMouseUp = () => {
  if (isDragging.value && headerRef.value) {
    isDragging.value = false;
    const currentTop = parseInt(getComputedStyle(headerRef.value).top);
    const windowHeight = window.innerHeight;
    const headerHeight = headerRef.value.offsetHeight;

    if (currentTop < windowHeight / 2) {
      headerRef.value.style.top = '0px';
    } else {
      headerRef.value.style.top = `${windowHeight - headerHeight}px`;
    }
  }
};
onMounted(() => {
 
  if (headerRef.value) {
    headerRef.value.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }
});

// 监听 loginUserStore 中 loginUser 的变化
watch(() => loginUserStore.loginUser, (newUser) => {
  // 这里可以添加额外的逻辑，比如更新 localStorage
  localStorage.setItem('userName', newUser.userName);
}, { deep: true });
</script>

<style scoped>
#globalHeader {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  transition: top 0.3s ease;
  /* 添加下划线样式 */
  padding-bottom: 7px;
  border-bottom: 3px solid #eee; 
}


/* 其他样式保持不变 */
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black !important;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-col {
  display: flex;
  align-items: center;
}

.logo-col {
  flex: 0 0 200px;
}

.menu-col {
  flex: 1;
  justify-content: center;
}

.user-col {
  flex: 0 0 120px;
  justify-content: flex-end;
}

.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: white;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

.custom-menu {
  display: flex;
  gap: 20px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #000;
  border: 1px solid #fff;
  min-width: 120px;
  z-index: 1;
}

.dropdown-menu a,
.dropdown-menu router-link {
  display: block;
  padding: 8px 12px;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.dropdown-menu a:hover,
.dropdown-menu router-link:hover {
  background-color: #fff;
  color: #000;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.login-button {
  background-color: #fff;
  color: #000;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
}

.after-active {
  color:white !important;
  font-weight: bold;

}
.custom-menu > div {
  transition: border-color 0.3s ease, border-radius 0.3s ease;
  border: 1px solid transparent;
  border-radius: 30px;
  display: inline-block;
  padding: 0px 20px;
}

.active-border {
  /* 修改上下边框宽度，这里设置为 1px，你可以按需调整 */
  border-width: 0.001px 0; 
  background-color: #000;
  height: 55px;
  text-align: center;
  /* 添加以下代码实现字体居中 */
  line-height: 55px;
  margin-top: 10px ;
}
.title.animated-title {
  color: #FF5733; 
  font-weight: bold;
  transition: all 0.3s ease; /* 添加过渡效果，让变化更平滑 */
}

.title.animated-title:hover {
  color: #0099ff; /* 鼠标悬停时的文字颜色 */
  transform: scale(1.1); /* 鼠标悬停时轻微放大 */
}
</style>

