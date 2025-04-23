<template>
  <div class="about">
    <!-- 轮播图容器 -->
    <div class="carousel-container">
      <!-- 渐变遮罩 -->
      <div class="carousel-mask"></div>
      <!-- 图片列表 -->
      <div 
        class="carousel-images" 
        :style="{ 
          transform: `perspective(1500px) rotateY(${currentIndex * -25}deg) translateX(-${currentIndex * 100}%) scale(0.95)`,
          transition: transitionStyle 
        }"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      >
        <img 
          v-for="(image, index) in images" 
          :key="index" 
          :src="image" 
          alt="Slide" 
          class="carousel-image"
          :class="{ 'is-loading': isImageLoading[index], 'glow-effect': index === currentIndex }"
          @load="imageLoaded(index)"
          @error="imageLoadError(index)"
        >
      </div>
      <!-- 导航按钮 -->
      <div class="carousel-controls">
        <button @click="prevSlide" class="control-button">‹</button>
        <button @click="nextSlide" class="control-button">›</button>
      </div>
      <!-- 指示器 -->
      <div class="carousel-indicators">
        <span
          v-for="(image, index) in images"
          :key="index"
          :class="{ active: index === currentIndex }"
          @click="setSlide(index)"
        ></span>
      </div>
    </div>
    <h1 class="title-animation">映象视界</h1>
    <!-- 图库简介 -->
    <section class="section-intro fade-in">
      <h2 class="underline-animation">图库简介</h2>
      <!-- 平台定位板块 -->
      <div class="intro-sub-section">
        <h3 class="sub-section-title">平台定位</h3>
        <p class="text-style">映象视界是一个专业的图片分享和存储平台，致力于为用户提供海量、高清、多样化的图片资源。无论您是设计师寻找灵感，摄影师展示作品，还是普通用户收集美图，我们都能满足您的需求。</p>
      </div>
      <!-- 图片分类板块 -->
      <div class="intro-sub-section">
        <h3 class="sub-section-title">图片分类</h3>
        <p class="text-style">平台拥有丰富的图片分类，涵盖自然风光、城市建筑、人物摄影、创意设计、动漫等多个领域，并且每天都有新的图片上传，保证您总能发现新鲜、有趣的内容。</p>
      </div>
      <!-- AI 扩图功能板块 -->
      <div class="intro-sub-section">
        <h3 class="sub-section-title">AI 扩图功能</h3>
        <p class="text-style">映象视界引入了先进的人工智能技术，支持强大的 AI 扩图功能。借助深度学习算法，该功能能够智能地对图片进行无损放大，不仅保持图片的清晰度和细节，还能自动优化色彩和纹理。无论您是需要将小尺寸的缩略图放大用于印刷，还是为设计作品提供更高分辨率的素材，AI 扩图功能都能轻松应对。</p>
      </div>
      <!-- 空间分析功能板块 -->
      <div class="intro-sub-section">
        <h3 class="sub-section-title">空间占用分析功能</h3>
        <p class="text-style">除了 AI 扩图，我们还提供专业的空间分析功能。映象视界的空间占用分析功能，能够帮助您清晰了解图片在存储系统中的空间使用情况。该功能会对您上传的图片进行详细的统计和分析，让您知道不同类型、不同尺寸的图片分别占用了多少存储空间。这有助于您合理规划存储空间，及时清理不必要的图片，优化存储资源。无论是个人用户管理自己的图片库，还是企业用户维护大量的图片素材，空间占用分析功能都能为您提供有效的存储管理支持。</p>
      </div>
    </section>
    <!-- 团队信息 -->
    <section class="section-team fade-in">
      <h2 class="underline-animation">我们的团队</h2>
      <div class="team-members">
        <div class="team-member">
          <img src="../../mypic/b_3494ae58a71c806389aef48e01d44b3a.jpg" alt="Team Member">
          <h3 class="member-name">贺金梅</h3>
          <p class="member-role">后端开发</p>
        </div>
        <div class="team-member">
          <img src="../../mypic/b_35baa890e1f40db93f054af68b6888e6.jpg" alt="Team Member">
          <h3 class="member-name">唐超</h3>
          <p class="member-role">前端开发</p>
        </div>
        <div class="team-member">
          <img src="../../mypic/b_ddea2779459beb551ab94cb3cd8d5522.jpg" alt="Team Member">
          <h3 class="member-name">张新鑫</h3>
          <p class="member-role">后端开发</p>
        </div>
        <div class="team-member">
          <img src="../../mypic/b_67f36698fbf7620439edad82ad5b9687.jpg" alt="Team Member">
          <h3 class="member-name">廖莎</h3>
          <p class="member-role">文档编写</p>
        </div>
        <div class="team-member">
          <img src="../../mypic/b_c928d592ae81eae0c230d8fe1f5369dd.jpg" alt="Team Member">
          <h3 class="member-name">陈依心</h3>
          <p class="member-role">PPT制作</p>
        </div>
        <!-- ... 其他团队成员 ... -->
      </div>
      
    </section>
    <!-- 联系我们 -->
    <section class="section-contact fade-in">
      <h2 class="underline-animation">联系我们</h2>
      <p class="text-style">如果您有任何问题、建议或合作意向，欢迎随时联系我们：</p>
      <ul>
        <li>邮箱：<a href="mailto:support@argylegallery.com">xxx</a></li>
        <li>电话：+86 123 456 7890</li>
        <li>社交媒体：<a href="https://www.facebook.com/argylegallery" target="_blank">Facebook</a> | <a href="https://www.twitter.com/argylegallery" target="_blank">Twitter</a></li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 增加更多图片链接到数组中
const images = [
  'https://picsum.photos/1200/400?random=1',
  'https://picsum.photos/1200/400?random=2',
  'https://picsum.photos/1200/400?random=3',
  'https://picsum.photos/1200/400?random=4',
  'https://picsum.photos/1200/400?random=5',
  'https://picsum.photos/1200/400?random=6',
  // 你可以继续添加更多图片链接
];

// 当前显示的图片索引
const currentIndex = ref(0);
// 自动播放定时器
let timer: ReturnType<typeof setInterval>;
// 过渡样式
const transitionStyle = ref('transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)');
// 鼠标按下标志
const isDragging = ref(false);
// 鼠标按下时的 X 坐标
const startX = ref(0);
// 鼠标移动的距离
const dragOffset = ref(0);
// 图片加载状态
const isImageLoading = ref(images.map(() => true));

// 图片加载成功
const imageLoaded = (index: number) => {
  isImageLoading.value[index] = false;
};

// 图片加载失败
const imageLoadError = (index: number) => {
  isImageLoading.value[index] = false;
  console.error(`Image ${index} failed to load`);
};

// 鼠标按下事件处理
const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true;
  startX.value = event.clientX;
  transitionStyle.value = 'none';
};

// 鼠标移动事件处理
const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    dragOffset.value = event.clientX - startX.value;
  }
};

// 鼠标抬起事件处理
const handleMouseUp = () => {
  if (isDragging.value) {
    const threshold = 100;
    if (dragOffset.value > threshold) {
      prevSlide();
    } else if (dragOffset.value < -threshold) {
      nextSlide();
    }
    isDragging.value = false;
    dragOffset.value = 0;
    transitionStyle.value = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
};

// 切换到上一张图片
const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? images.length - 1 : currentIndex.value - 1;
};

// 切换到下一张图片
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

// 切换到指定图片
const setSlide = (index: number) => {
  currentIndex.value = index;
};

// 开始自动播放
const startAutoPlay = () => {
  timer = setInterval(nextSlide, 5000);
};

// 停止自动播放
const stopAutoPlay = () => {
  clearInterval(timer);
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.about {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 轮播图容器 */
.carousel-container {
  position: relative;
  width: 100%;
  height: 500px; /* 增加高度 */
  overflow: hidden;
  margin-bottom: 2rem;
  perspective: 1500px; /* 增加透视效果 */
}

/* 图片列表 */
.carousel-images {
  display: flex;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1); /* 更平滑的过渡 */
}

/* 轮播图图片 */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 10px; /* 添加圆角 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 添加阴影 */
  transition: all 0.5s ease;
}

/* 发光效果 */
.glow-effect {
  box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.5);
}

/* 导航按钮 */
.carousel-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 2;
}

.control-button {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 2.5rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-radius: 50%; /* 圆形按钮 */
  transition: all 0.3s ease;
}

.control-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1); /* 悬停放大 */
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 2;
}

.carousel-indicators span {
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  margin: 0 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: white;
  transform: scale(1.3); /* 激活状态放大 */
}

/* 原有的标题动画样式 */
.title-animation {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  animation: slideDown 1s ease-out;
  font-family: 'Playfair Display', serif;
  color: #333;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 下划线动画 */
.underline-animation {
  font-size: 2rem;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
  font-family: 'Roboto', sans-serif;
  color: #666;
}

.underline-animation::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #666;
  animation: underline 1s ease-out forwards;
}

@keyframes underline {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* 文字样式 */
.text-style {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-family: 'Open Sans', sans-serif;
  color: #666;
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.team-members {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.team-member {
  text-align: center;
  width: 200px;
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
}

.team-member img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.member-name {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

.member-role {
  font-size: 1rem;
  color: #666;
  font-family: 'Open Sans', sans-serif;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 0.5rem;
  font-family: 'Open Sans', sans-serif;
  color: #666;
}

ul li a {
  color: #007bff;
  text-decoration: none;
}

ul li a:hover {
  text-decoration: underline;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.intro-sub-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-left: 3px solid #007bff;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.sub-section-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-family: 'Roboto', sans-serif;
}
/* 渐变遮罩 */
.carousel-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
  z-index: 1;
}

/* 3D 翻页动画 */
.carousel-images {
  display: flex;
  transform-style: preserve-3d;
  will-change: transform;
}

/* 图片加载状态 */
.carousel-image.is-loading {
  filter: blur(10px);
  opacity: 0.5;
}

/* 触摸反馈 */
.carousel-images:active {
  transform: scale(0.98);
}
</style>

