<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="highlight">技术博客</span> 与 
            <span class="highlight">3D案例</span> 展示
          </h1>
          <p class="hero-subtitle">
            专注于分享技术文章和展示Cesium/Three.js交互案例，<br />
            探索Web 3D可视化的无限可能
          </p>
          <div class="hero-actions">
            <router-link to="/blog" class="btn btn-primary">
              浏览博客
            </router-link>
            <router-link to="/cesium" class="btn btn-outline">
              Cesium案例
            </router-link>
            <router-link to="/threejs" class="btn btn-outline">
              Three.js案例
            </router-link>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-cube">
            <div class="cube-face cube-front"></div>
            <div class="cube-face cube-back"></div>
            <div class="cube-face cube-right"></div>
            <div class="cube-face cube-left"></div>
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-bottom"></div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">📝</div>
            <h3 class="feature-title">技术博客</h3>
            <p class="feature-desc">
              分享前沿技术文章，涵盖Vue3、Cesium、Three.js等技术栈，助你快速提升开发技能。
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌍</div>
            <h3 class="feature-title">Cesium案例</h3>
            <p class="feature-desc">
              丰富的Cesium.js 3D地球可视化案例，包含图层管理、天空盒、雷达特效等高级功能。
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎮</div>
            <h3 class="feature-title">Three.js案例</h3>
            <p class="feature-desc">
              精选Three.js交互案例，涵盖PBR材质、粒子系统、物理引擎、VR/AR等前沿技术。
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="latest-blogs-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新博客</h2>
          <router-link to="/blog" class="view-all">
            查看全部 →
          </router-link>
        </div>
        <div class="blogs-grid">
          <BlogCard v-for="blog in latestBlogs" :key="blog.id" :blog="blog" />
        </div>
      </div>
    </section>
    
    <section class="cases-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Cesium案例</h2>
          <router-link to="/cesium" class="view-all">
            查看全部 →
          </router-link>
        </div>
        <div class="cases-grid">
          <div 
            v-for="category in cesiumCategories.slice(0, 4)" 
            :key="category.id"
            class="category-preview"
          >
            <router-link :to="`/cesium/${category.id}`" class="category-card">
              <div class="category-icon">{{ getCategoryIcon(category.icon) }}</div>
              <h3 class="category-name">{{ category.name }}</h3>
              <p class="category-desc">{{ category.description }}</p>
              <span class="category-count">{{ category.items.length }} 个案例</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    
    <section class="cases-section alt-bg">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Three.js案例</h2>
          <router-link to="/threejs" class="view-all">
            查看全部 →
          </router-link>
        </div>
        <div class="cases-grid">
          <div 
            v-for="category in threejsCategories.slice(0, 4)" 
            :key="category.id"
            class="category-preview"
          >
            <router-link :to="`/threejs/${category.id}`" class="category-card">
              <div class="category-icon">{{ getCategoryIcon(category.icon) }}</div>
              <h3 class="category-name">{{ category.name }}</h3>
              <p class="category-desc">{{ category.description }}</p>
              <span class="category-count">{{ category.items.length }} 个案例</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BlogCard from '@/components/cards/BlogCard.vue'
import blogsData from '@/data/blogs.json'
import cesiumData from '@/data/cesium.json'
import threejsData from '@/data/threejs.json'

const latestBlogs = ref([])
const cesiumCategories = ref([])
const threejsCategories = ref([])

const iconMap = {
  layers: '🗺️',
  sky: '🌌',
  label: '🏷️',
  shapes: '🔷',
  cube: '📦',
  radar: '📡',
  sparkles: '✨',
  camera: '📷',
  ruler: '📏',
  city: '🏙️',
  palette: '🎨',
  sun: '☀️',
  play: '▶️',
  import: '📥',
  effects: '🎬',
  physics: '⚛️',
  particles: '🌟',
  vr: '🥽'
}

const getCategoryIcon = (icon) => {
  return iconMap[icon] || '📁'
}

onMounted(() => {
  latestBlogs.value = blogsData.slice(0, 3)
  cesiumCategories.value = cesiumData.categories
  threejsCategories.value = threejsData.categories
})
</script>

<style lang="scss" scoped>
.home-page {
  .hero-section {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, $bg-color 0%, $bg-secondary 50%, $bg-color 100%);
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba($primary-color, 0.1) 0%, transparent 50%);
      animation: pulse 10s ease-in-out infinite;
    }
    
    .container {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-2xl;
      align-items: center;
      
      @media (max-width: $breakpoint-lg) {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    
    .hero-title {
      font-size: clamp($font-size-3xl, 5vw, $font-size-4xl);
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: $spacing-lg;
      color: $text-color;
      
      .highlight {
        background: linear-gradient(90deg, $primary-color, $secondary-color);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    .hero-subtitle {
      font-size: $font-size-lg;
      color: $text-secondary;
      line-height: 1.8;
      margin-bottom: $spacing-xl;
    }
    
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-md;
      
      @media (max-width: $breakpoint-lg) {
        justify-content: center;
      }
    }
    
    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
      
      @media (max-width: $breakpoint-lg) {
        display: none;
      }
    }
  }
  
  .floating-cube {
    position: relative;
    width: 200px;
    height: 200px;
    transform-style: preserve-3d;
    animation: rotateCube 15s linear infinite;
    
    .cube-face {
      position: absolute;
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, rgba($primary-color, 0.3), rgba($secondary-color, 0.3));
      border: 2px solid rgba($primary-color, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      backdrop-filter: blur(10px);
      
      &.cube-front { transform: translateZ(100px); }
      &.cube-back { transform: rotateY(180deg) translateZ(100px); }
      &.cube-right { transform: rotateY(90deg) translateZ(100px); }
      &.cube-left { transform: rotateY(-90deg) translateZ(100px); }
      &.cube-top { transform: rotateX(90deg) translateZ(100px); }
      &.cube-bottom { transform: rotateX(-90deg) translateZ(100px); }
    }
  }
  
  .features-section {
    padding: $spacing-2xl 0;
    background: $bg-secondary;
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-xl;
      
      @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
      }
    }
    
    .feature-item {
      padding: $spacing-xl;
      background: $bg-color;
      border-radius: $border-radius-lg;
      text-align: center;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: $box-shadow-hover;
        
        .feature-icon {
          transform: scale(1.1);
        }
      }
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: $spacing-md;
      transition: transform 0.3s ease;
    }
    
    .feature-title {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $spacing-sm;
    }
    
    .feature-desc {
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.8;
    }
  }
  
  .latest-blogs-section,
  .cases-section {
    padding: $spacing-2xl 0;
    
    &.alt-bg {
      background: $bg-secondary;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-xl;
      
      @media (max-width: $breakpoint-sm) {
        flex-direction: column;
        align-items: flex-start;
        gap: $spacing-md;
      }
    }
    
    .view-all {
      color: $primary-color;
      font-size: $font-size-sm;
      font-weight: 500;
      transition: color 0.3s ease;
      
      &:hover {
        color: $primary-hover;
      }
    }
    
    .blogs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-xl;
      
      @media (max-width: $breakpoint-lg) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
      }
    }
    
    .cases-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-lg;
      
      @media (max-width: $breakpoint-lg) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: $breakpoint-sm) {
        grid-template-columns: 1fr;
      }
    }
    
    .category-card {
      display: block;
      padding: $spacing-lg;
      background: $card-bg;
      border-radius: $border-radius;
      text-align: center;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: $box-shadow-hover;
        
        .category-icon {
          transform: scale(1.15);
        }
      }
    }
    
    .category-icon {
      font-size: 2.5rem;
      margin-bottom: $spacing-md;
      transition: transform 0.3s ease;
    }
    
    .category-name {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $spacing-xs;
    }
    
    .category-desc {
      font-size: $font-size-xs;
      color: $text-muted;
      margin-bottom: $spacing-sm;
      line-height: 1.5;
    }
    
    .category-count {
      display: inline-block;
      padding: 2px 8px;
      font-size: $font-size-xs;
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      border-radius: $border-radius-sm;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes rotateCube {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}
</style>
