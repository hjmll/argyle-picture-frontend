<template>
  <div id="homePage">
    <!-- 搜索框 -->
    <div :style="style">
      <div class="search-mask"></div>
    <div class="search-bar">
      <h2 style="text-align: center; color: white; margin-bottom: 30px; ">才华横溢的作者在这里免费分享最精彩的素材图片</h2>
      <div class="custom-search-container">
        <input
          type="text"
          placeholder="搜索海量图片"
          v-model="searchParams.searchText"
          class="custom-search-input"
        />
        
        <button @click="doSearch" class="custom-search-button"><SearchOutlined /></button>
      </div>
    </div>
    </div>
    <!-- 分类 + 标签 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="公共素材图片" />
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>

    <!-- 图片列表 -->
    <PictureList :dataList="dataList"  />    
     <!-- :loading="loading上面本该有 -->
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="onPageChange"
    />
  
    <template v-if="showRocket">
      <div class="rocket-icon" @click="scrollToTop">
        <RocketOutlined />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// 数据
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import PictureList from '@/components/PictureList.vue'
import {
  SearchOutlined,
  RocketOutlined
} from '@ant-design/icons-vue';
const style = ref({
  // 修改为驼峰命名法并将 url 作为字符串处理
  backgroundImage: `url('../mypic/pexels-tom-fly-2150802027-31410286.jpg')`, 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '4px',
  height: '60vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative' // 为蒙版定位
})


const dataList = ref<API.PictureVo[]>([])
const total = ref(0)
const loading = ref(true)
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
const showRocket = ref(false);

const handleScroll = () => {
  showRocket.value = window.scrollY > 0;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 18,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [] as string[],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

//标签和分类列表
const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')


const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

</script>

<style scoped>
#homePage {
  margin-bottom: 16px;
}

#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

#homePage .tag-bar {
  margin-bottom: 10px;
}
#homePage .search-background {
  background-image: url('../mypic/pexels-tom-fly-2150802027-31410286.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  height: 60vh;
  display: flex;
  align-items: center;
  position: relative; /* 为蒙版定位 */
}

#homePage .search-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明背景，可调整透明度 */
  border-radius: 4px;
}

#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto;
  z-index: 1; /* 确保搜索框在蒙版之上 */
}
.custom-search-container {
  display: flex;
  align-items: center;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.custom-search-input {
  flex: 1;
  border: none;
  padding: 0 25px;
  font-size: 16px;
  height: 50px;
  background-color: transparent;
  outline: none;
}

.custom-search-button {
  /* 修改背景样式 */
  
  border: none;
  color: lightgray;
  font-size:20px;
  padding: 0 25px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-search-button:hover {
  /* 修改悬停背景样式 */
  background: lightgray;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
  color: rgba(0, 0, 0, 0.3); 
}
.rocket-icon {
  position: fixed;
  top: 600px;
  right: 100px;
  width: 50px;
  height: 50px;
  background: black;
  color: #FFF;
  font-size: 24px;
  border-radius: 50%; /* 添加这一行，将元素变成圆形 */
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
</style>
