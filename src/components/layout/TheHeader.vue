<template>
  <header class="header">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">📐</span>
        <span class="logo-text">Dev3D</span>
      </router-link>
      
      <nav class="nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="nav-link"
          :class="{ 'is-active': isActive(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>
      
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span v-if="!isMobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>
    
    <div class="mobile-menu" :class="{ 'is-open': isMobileMenuOpen }">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path" 
        class="mobile-nav-link"
        @click="isMobileMenuOpen = false"
      >
        {{ item.label }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '技术博客' },
  { path: '/cesium', label: 'Cesium案例' },
  { path: '/threejs', label: 'Three.js案例' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba($bg-secondary, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $border-color;
  
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-xl;
    font-weight: 700;
    color: $text-color;
    transition: color 0.3s ease;
    
    &:hover {
      color: $primary-color;
    }
    
    .logo-icon {
      font-size: $font-size-2xl;
    }
  }
  
  .nav {
    display: flex;
    gap: $spacing-xl;
    
    @media (max-width: $breakpoint-md) {
      display: none;
    }
  }
  
  .nav-link {
    position: relative;
    padding: $spacing-sm 0;
    font-weight: 500;
    color: $text-secondary;
    transition: color 0.3s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, $primary-color, $secondary-color);
      transition: width 0.3s ease;
    }
    
    &:hover,
    &.is-active {
      color: $primary-color;
      
      &::after {
        width: 100%;
      }
    }
  }
  
  .mobile-menu-btn {
    display: none;
    padding: $spacing-sm;
    font-size: $font-size-xl;
    color: $text-color;
    cursor: pointer;
    transition: color 0.3s ease;
    
    &:hover {
      color: $primary-color;
    }
    
    @media (max-width: $breakpoint-md) {
      display: block;
    }
  }
  
  .mobile-menu {
    display: none;
    padding: $spacing-lg;
    background: $bg-secondary;
    border-top: 1px solid $border-color;
    
    @media (max-width: $breakpoint-md) {
      display: block;
      max-height: 0;
      overflow: hidden;
      padding: 0;
      transition: all 0.3s ease;
      
      &.is-open {
        max-height: 300px;
        padding: $spacing-lg;
      }
    }
  }
  
  .mobile-nav-link {
    display: block;
    padding: $spacing-md 0;
    font-size: $font-size-lg;
    color: $text-secondary;
    border-bottom: 1px solid $border-color;
    transition: color 0.3s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      color: $primary-color;
    }
  }
}
</style>
