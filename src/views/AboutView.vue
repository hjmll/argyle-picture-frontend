<template>
  <div class="about">
    <!-- 轮播图容器 -->
    <div class="carousel-container">
      <!-- 图片列表 -->
      <div class="carousel-images" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <img v-for="(image, index) in images" :key="index" :src="image" alt="Slide" class="carousel-image">
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
      <p class="text-style">映象视界是一个专业的图片分享和存储平台，致力于为用户提供海量、高清、多样化的图片资源。无论您是设计师寻找灵感，摄影师展示作品，还是普通用户收集美图，我们都能满足您的需求。</p>
      <p class="text-style">平台拥有丰富的图片分类，涵盖自然风光、城市建筑、人物摄影、创意设计,动漫等多个领域，并且每天都有新的图片上传，保证您总能发现新鲜、有趣的内容。</p>
    </section>
    <!-- 团队信息 -->
    <section class="section-team fade-in">
      <h2 class="underline-animation">我们的团队</h2>
      <div class="team-members">
        <div class="team-member">
          <img src="https://via.placeholder.com/200" alt="Team Member">
          <h3 class="member-name">张三</h3>
          <p class="member-role">首席设计师</p>
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

// 图片数组，可替换为你自己的图片链接
const images = [
  'https://picsum.photos/1200/400?random=1',
  'https://picsum.photos/1200/400?random=2',
  'https://picsum.photos/1200/400?random=3',
];

// 当前显示的图片索引
const currentIndex = ref(0);

// 自动播放定时器
let timer: ReturnType<typeof setInterval>;

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
  timer = setInterval(nextSlide, 3000);
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
  height: 400px;
  overflow: hidden;
  margin-bottom: 2rem;
}

/* 图片列表 */
.carousel-images {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

/* 轮播图图片 */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
}

/* 导航按钮 */
.carousel-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
}

.control-button {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.control-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.carousel-indicators span {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  margin: 0 4px;
  cursor: pointer;
}

.carousel-indicators span.active {
  background: white;
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
</style>