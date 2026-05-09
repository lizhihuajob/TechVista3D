<template>
  <div class="case-detail-page" v-if="caseItem">
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <router-link to="/threejs">Three.js案例</router-link>
          <span class="separator">/</span>
          <router-link :to="`/threejs/${category.id}`">{{ category.name }}</router-link>
          <span class="separator">/</span>
          <span class="current">{{ caseItem.title }}</span>
        </div>
      </div>
    </div>
    
    <div class="container">
      <div class="case-content">
        <header class="case-header">
          <div class="case-meta">
            <span class="difficulty-badge" :class="`difficulty-${caseItem.difficulty}`">
              {{ caseItem.difficulty }}
            </span>
            <span class="category-tag">{{ category.name }}</span>
          </div>
          
          <h1 class="case-title">{{ caseItem.title }}</h1>
          <p class="case-description">{{ caseItem.description }}</p>
          
          <div class="case-tags">
            <span v-for="tag in caseItem.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </header>
        
        <div class="case-preview">
          <div class="preview-container" :class="{ 'has-component': hasComponent }">
            <template v-if="hasComponent && caseComponent">
              <component 
                :is="caseComponent" 
                ref="caseComponentRef"
                class="case-demo-component"
              />
            </template>
            <template v-else>
              <img :src="caseItem.previewImage" :alt="caseItem.title" class="preview-image" />
              <div class="preview-overlay">
                <span class="preview-placeholder">预览区域</span>
                <span class="preview-hint">案例组件开发中，敬请期待</span>
              </div>
            </template>
          </div>
          
          <div class="screenshot-toolbar" v-if="hasComponent && caseComponentRef">
            <button @click="takeScreenshot" class="screenshot-btn">
              📷 截图
            </button>
            <span class="screenshot-hint">点击截图可下载当前画面</span>
          </div>
        </div>
        
        <div class="case-body">
          <div class="section">
            <h2 class="section-title">📝 代码示例</h2>
            <div class="code-section">
              <CodeBlock :code="caseItem.codeSnippet" :language="'javascript'" />
            </div>
          </div>
          
          <div class="section" v-if="relatedCases.length > 0">
            <h2 class="section-title">🔗 相关案例</h2>
            <div class="related-cases">
              <div 
                v-for="related in relatedCases" 
                :key="related.id"
                class="related-card"
              >
                <router-link 
                  :to="`/threejs/${category.id}/${related.id}`"
                  class="related-link"
                >
                  <div class="related-cover">
                    <img :src="related.previewImage" :alt="related.title" />
                  </div>
                  <div class="related-info">
                    <h3 class="related-title">{{ related.title }}</h3>
                    <span class="related-difficulty" :class="`difficulty-${related.difficulty}`">
                      {{ related.difficulty }}
                    </span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="navigation-section">
            <router-link 
              v-if="hasPrev" 
              :to="`/threejs/${category.id}/${prevCase.id}`"
              class="nav-btn prev"
            >
              <span class="nav-arrow">←</span>
              <div class="nav-text">
                <span class="nav-label">上一个案例</span>
                <span class="nav-title">{{ prevCase.title }}</span>
              </div>
            </router-link>
            <router-link 
              :to="`/threejs/${category.id}`"
              class="nav-btn back"
            >
              <span class="nav-icon">📋</span>
              <span class="nav-label">返回列表</span>
            </router-link>
            <router-link 
              v-if="hasNext" 
              :to="`/threejs/${category.id}/${nextCase.id}`"
              class="nav-btn next"
            >
              <div class="nav-text">
                <span class="nav-label">下一个案例</span>
                <span class="nav-title">{{ nextCase.title }}</span>
              </div>
              <span class="nav-arrow">→</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="not-found" v-else>
    <div class="not-found-icon">📦</div>
    <h2>案例不存在</h2>
    <p>您访问的案例可能已被删除或不存在</p>
    <router-link to="/threejs" class="btn btn-primary">返回案例列表</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import CodeBlock from '@/components/common/CodeBlock.vue'
import threejsData from '@/data/threejs.json'
import { getThreejsComponent } from '@/components/cases'

const route = useRoute()

const categories = ref(threejsData.categories)
const caseComponent = ref(null)
const caseComponentRef = ref(null)
const hasComponent = ref(false)

const category = computed(() => {
  return categories.value.find(c => c.id === route.params.category)
})

const caseItem = computed(() => {
  if (!category.value) return null
  return category.value.items.find(item => item.id === route.params.id)
})

const currentIndex = computed(() => {
  if (!category.value || !caseItem.value) return -1
  return category.value.items.findIndex(item => item.id === caseItem.value.id)
})

const prevCase = computed(() => {
  if (currentIndex.value > 0 && category.value) {
    return category.value.items[currentIndex.value - 1]
  }
  return null
})

const nextCase = computed(() => {
  if (category.value && currentIndex.value < category.value.items.length - 1) {
    return category.value.items[currentIndex.value + 1]
  }
  return null
})

const hasPrev = computed(() => prevCase.value !== null)
const hasNext = computed(() => nextCase.value !== null)

const relatedCases = computed(() => {
  if (!category.value || !caseItem.value) return []
  return category.value.items
    .filter(item => item.id !== caseItem.value.id)
    .slice(0, 3)
})

const loadCaseComponent = async (caseId) => {
  caseComponent.value = null
  hasComponent.value = false
  
  const componentLoader = getThreejsComponent(caseId)
  if (componentLoader) {
    try {
      const loadedComponent = await componentLoader()
      caseComponent.value = loadedComponent.default || loadedComponent
      hasComponent.value = true
    } catch (error) {
      console.warn(`Case component ${caseId} not found or failed to load:`, error)
      hasComponent.value = false
    }
  }
}

const takeScreenshot = () => {
  if (caseComponentRef.value && caseComponentRef.value.getScreenshot) {
    const dataUrl = caseComponentRef.value.getScreenshot()
    if (dataUrl) {
      const link = document.createElement('a')
      link.download = `${caseItem.value?.title || 'screenshot'}.png`
      link.href = dataUrl
      link.click()
    }
  }
}

watch(() => route.params.id, (newId) => {
  window.scrollTo(0, 0)
  if (newId) {
    loadCaseComponent(newId)
  }
})

onMounted(() => {
  window.scrollTo(0, 0)
  if (route.params.id) {
    loadCaseComponent(route.params.id)
  }
})

onUnmounted(() => {
  caseComponent.value = null
})
</script>

<style lang="scss" scoped>
.case-detail-page {
  .page-header {
    background: $bg-secondary;
    border-bottom: 1px solid $border-color;
    padding: $spacing-lg 0;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $text-secondary;
    
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
  
  .case-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: $spacing-xl 0;
  }
  
  .case-header {
    margin-bottom: $spacing-xl;
    
    .case-meta {
      display: flex;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;
    }
    
    .difficulty-badge {
      display: inline-block;
      padding: 4px 12px;
      font-size: $font-size-xs;
      font-weight: 600;
      border-radius: $border-radius;
      
      &.difficulty-入门 {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
      }
      
      &.difficulty-中级 {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
      }
      
      &.difficulty-高级 {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
      }
    }
    
    .category-tag {
      display: inline-block;
      padding: 4px 12px;
      font-size: $font-size-xs;
      font-weight: 500;
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      border-radius: $border-radius;
    }
    
    .case-title {
      font-size: clamp($font-size-2xl, 4vw, $font-size-3xl);
      font-weight: 700;
      color: $text-color;
      line-height: 1.3;
      margin-bottom: $spacing-md;
    }
    
    .case-description {
      font-size: $font-size-lg;
      color: $text-secondary;
      line-height: 1.6;
      margin-bottom: $spacing-lg;
    }
    
    .case-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
    }
  }
  
  .case-preview {
    margin-bottom: $spacing-xl;
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: $box-shadow;
    
    .preview-container {
      position: relative;
      aspect-ratio: 16/9;
      background: $bg-secondary;
      
      &.has-component {
        min-height: 500px;
        aspect-ratio: auto;
      }
      
      .case-demo-component {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    
    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .preview-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: $spacing-md;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      color: white;
      
      @media (max-width: $breakpoint-sm) {
        display: none;
      }
    }
    
    .preview-placeholder {
      display: block;
      font-size: $font-size-sm;
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .preview-hint {
      display: block;
      font-size: $font-size-xs;
      opacity: 0.7;
    }
  }
  
  .screenshot-toolbar {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md;
    background: $bg-secondary;
    border-top: 1px solid $border-color;
  }
  
  .screenshot-btn {
    padding: $spacing-sm $spacing-md;
    background: $primary-color;
    color: white;
    border: none;
    border-radius: $border-radius;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: $primary-hover;
      transform: translateY(-2px);
    }
  }
  
  .screenshot-hint {
    font-size: $font-size-xs;
    color: $text-muted;
  }
  
  .case-body {
    .section {
      margin-bottom: $spacing-2xl;
    }
    
    .section-title {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $spacing-lg;
      padding-bottom: $spacing-sm;
      border-bottom: 1px solid $border-color;
    }
    
    .code-section {
      margin-top: $spacing-md;
    }
  }
  
  .related-cases {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-lg;
    
    @media (max-width: $breakpoint-md) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }
  
  .related-card {
    .related-link {
      display: block;
      background: $card-bg;
      border-radius: $border-radius;
      overflow: hidden;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: $box-shadow-hover;
        
        .related-title {
          color: $primary-color;
        }
      }
    }
    
    .related-cover {
      height: 140px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }
    
    .related-info {
      padding: $spacing-md;
    }
    
    .related-title {
      font-size: $font-size-sm;
      font-weight: 500;
      color: $text-color;
      line-height: 1.4;
      margin-bottom: $spacing-sm;
      transition: color 0.3s ease;
    }
    
    .related-difficulty {
      display: inline-block;
      padding: 2px 8px;
      font-size: $font-size-xs;
      font-weight: 500;
      border-radius: $border-radius-sm;
      
      &.difficulty-入门 {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
      }
      
      &.difficulty-中级 {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
      }
      
      &.difficulty-高级 {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
      }
    }
  }
  
  .navigation-section {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: $spacing-lg;
    padding-top: $spacing-xl;
    border-top: 1px solid $border-color;
    
    @media (max-width: $breakpoint-md) {
      flex-direction: column;
    }
  }
  
  .nav-btn {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: $card-bg;
    border-radius: $border-radius;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    flex: 1;
    max-width: 300px;
    
    &:hover {
      border-color: $primary-color;
      transform: translateY(-2px);
    }
    
    &.prev {
      justify-content: flex-start;
    }
    
    &.next {
      justify-content: flex-end;
      text-align: right;
    }
    
    &.back {
      justify-content: center;
      flex: 0 0 auto;
      max-width: 150px;
      flex-direction: column;
      gap: $spacing-xs;
      
      @media (max-width: $breakpoint-md) {
        order: 3;
        max-width: 100%;
        flex-direction: row;
      }
    }
  }
  
  .nav-arrow {
    font-size: $font-size-2xl;
    color: $primary-color;
  }
  
  .nav-icon {
    font-size: $font-size-xl;
  }
  
  .nav-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  
  .nav-label {
    font-size: $font-size-xs;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }
  
  .nav-title {
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.not-found {
  text-align: center;
  padding: $spacing-2xl;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .not-found-icon {
    font-size: 5rem;
    margin-bottom: $spacing-lg;
  }
  
  h2 {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-sm;
  }
  
  p {
    color: $text-secondary;
    margin-bottom: $spacing-xl;
  }
}
</style>
