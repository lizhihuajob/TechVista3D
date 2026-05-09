<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="logo">
            <span class="logo-icon">📐</span>
            <span class="logo-text">Dev3D</span>
          </div>
          <p class="description">
            一个集技术博客与3D案例展示于一体的现代化个人网站，专注于分享技术文章和展示交互案例。
          </p>
        </div>
        
        <div class="footer-section">
          <h3 class="section-title">快速链接</h3>
          <ul class="links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/blog">技术博客</router-link></li>
            <li><router-link to="/cesium">Cesium案例</router-link></li>
            <li><router-link to="/threejs">Three.js案例</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="section-title">Cesium分类</h3>
          <ul class="links">
            <li><router-link to="/cesium/layer-management">图层管理</router-link></li>
            <li><router-link to="/cesium/skybox">天空盒</router-link></li>
            <li><router-link to="/cesium/billboard-label">标牌标注</router-link></li>
            <li><router-link to="/cesium/basic-graphics">基础图形</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="section-title">Three.js分类</h3>
          <ul class="links">
            <li><router-link to="/threejs/basic-scene">基础场景</router-link></li>
            <li><router-link to="/threejs/geometry">几何体</router-link></li>
            <li><router-link to="/threejs/material-texture">材质纹理</router-link></li>
            <li><router-link to="/threejs/lighting-shadow">光照阴影</router-link></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Dev3D. All rights reserved.</p>
        <p class="tech-stack">Built with Vue3 + Cesium + Three.js</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
.footer {
  background: $bg-secondary;
  border-top: 1px solid $border-color;
  padding: $spacing-2xl 0 $spacing-lg;
  
  .footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: $spacing-2xl;
    padding-bottom: $spacing-2xl;
    border-bottom: 1px solid $border-color;
    
    @media (max-width: $breakpoint-lg) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      gap: $spacing-xl;
    }
  }
  
  .footer-section {
    .logo {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;
      
      .logo-icon {
        font-size: $font-size-2xl;
      }
      
      .logo-text {
        font-size: $font-size-xl;
        font-weight: 700;
        color: $text-color;
      }
    }
    
    .description {
      color: $text-secondary;
      line-height: 1.8;
      font-size: $font-size-sm;
    }
    
    .section-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $spacing-lg;
    }
    
    .links {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      
      a {
        color: $text-secondary;
        font-size: $font-size-sm;
        transition: color 0.3s ease;
        
        &:hover {
          color: $primary-color;
        }
      }
    }
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: $spacing-lg;
    color: $text-muted;
    font-size: $font-size-sm;
    
    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      gap: $spacing-sm;
      text-align: center;
    }
    
    .tech-stack {
      color: $text-muted;
    }
  }
}
</style>
