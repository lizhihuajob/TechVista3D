<template>
  <div class="cesium-category-page">
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <span class="current">Cesium案例</span>
          <template v-if="currentCategory">
            <span class="separator">/</span>
            <span class="current">{{ currentCategory.name }}</span>
          </template>
        </div>
        
        <div class="page-intro">
          <div class="intro-icon">🌍</div>
          <div class="intro-content">
            <h1 class="page-title">Cesium.js 案例库</h1>
            <p class="page-subtitle">
              丰富的Cesium.js 3D地球可视化案例，涵盖图层管理、天空盒、雷达特效、测量分析等高级功能
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container">
      <div class="page-content">
        <aside class="sidebar">
          <CategoryNav 
            :categories="categories" 
            type="cesium"
            title="Cesium分类"
          />
        </aside>
        
        <main class="main-content">
          <div class="category-info" v-if="currentCategory">
            <h2 class="category-title">{{ currentCategory.name }}</h2>
            <p class="category-desc">{{ currentCategory.description }}</p>
            <span class="category-count">共 {{ currentCategory.items.length }} 个案例</span>
          </div>
          
          <div class="category-info" v-else>
            <h2 class="category-title">全部案例</h2>
            <p class="category-desc">浏览所有Cesium.js案例，按分类筛选查看</p>
            <span class="category-count">共 {{ totalCases }} 个案例</span>
          </div>
          
          <div class="cases-grid" v-if="displayCases.length > 0">
            <CaseCard 
              v-for="item in displayCases" 
              :key="item.id" 
              :item="item"
              :type="'cesium'"
              :category="getCategoryIdByItem(item)"
            />
          </div>
          
          <div class="empty-state" v-else>
            <div class="empty-icon">📦</div>
            <h3 class="empty-title">暂无案例</h3>
            <p class="empty-desc">该分类下暂无案例，请查看其他分类</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import CategoryNav from '@/components/navigation/CategoryNav.vue'
import CaseCard from '@/components/cards/CaseCard.vue'
import cesiumData from '@/data/cesium.json'

const route = useRoute()

const categories = ref(cesiumData.categories)

const currentCategory = computed(() => {
  if (route.params.category) {
    return categories.value.find(c => c.id === route.params.category)
  }
  return null
})

const totalCases = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.items.length, 0)
})

const displayCases = computed(() => {
  if (currentCategory.value) {
    return currentCategory.value.items
  }
  // 显示所有分类的前几个案例
  const allCases = []
  categories.value.forEach(cat => {
    cat.items.forEach(item => {
      allCases.push({ ...item, categoryId: cat.id })
    })
  })
  return allCases
})

const getCategoryIdByItem = (item) => {
  if (item.categoryId) return item.categoryId
  if (currentCategory.value) return currentCategory.value.id
  return categories.value[0]?.id || 'layer-management'
}

watch(() => route.params.category, () => {
  window.scrollTo(0, 0)
})

onMounted(() => {
  if (!route.params.category) {
    // 默认选中第一个分类
  }
})
</script>

<style lang="scss" scoped>
.cesium-category-page {
  .page-header {
    background: linear-gradient(135deg, $bg-secondary 0%, $bg-color 100%);
    border-bottom: 1px solid $border-color;
    padding: $spacing-lg 0;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xl;
    
    a {
      color: $text-secondary;
      transition: color 0.3s ease;
      
      &:hover {
        color: $primary-color;
      }
    }
    
    .separator {
      color: $text-muted;
    }
    
    .current {
      color: $text-color;
      font-weight: 500;
    }
  }
  
  .page-intro {
    display: flex;
    gap: $spacing-lg;
    align-items: center;
    
    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .intro-icon {
    font-size: 4rem;
    
    @media (max-width: $breakpoint-sm) {
      font-size: 3rem;
    }
  }
  
  .page-title {
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $text-color;
    margin-bottom: $spacing-sm;
    
    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-2xl;
    }
  }
  
  .page-subtitle {
    font-size: $font-size-base;
    color: $text-secondary;
    line-height: 1.6;
    max-width: 600px;
  }
  
  .page-content {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: $spacing-xl;
    padding: $spacing-xl 0;
    
    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }
  
  .sidebar {
    @media (max-width: $breakpoint-lg) {
      order: 2;
    }
  }
  
  .main-content {
    @media (max-width: $breakpoint-lg) {
      order: 1;
    }
  }
  
  .category-info {
    margin-bottom: $spacing-xl;
    padding-bottom: $spacing-lg;
    border-bottom: 1px solid $border-color;
  }
  
  .category-title {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-sm;
  }
  
  .category-desc {
    font-size: $font-size-base;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }
  
  .category-count {
    display: inline-block;
    padding: 2px 8px;
    font-size: $font-size-sm;
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: $border-radius-sm;
  }
  
  .cases-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
    
    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
    }
  }
  
  .empty-state {
    text-align: center;
    padding: $spacing-2xl;
    background: $card-bg;
    border-radius: $border-radius-lg;
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: $spacing-lg;
  }
  
  .empty-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-sm;
  }
  
  .empty-desc {
    color: $text-secondary;
  }
}
</style>
