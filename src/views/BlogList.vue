<template>
  <div class="blog-list-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">技术博客</h1>
        <p class="page-subtitle">分享前沿技术文章，涵盖Vue3、Cesium、Three.js等技术栈</p>
      </div>
    </div>
    
    <div class="container">
      <div class="page-content">
        <aside class="sidebar">
          <div class="filter-section">
            <h3 class="filter-title">文章分类</h3>
            <ul class="filter-list">
              <li>
                <button 
                  class="filter-item" 
                  :class="{ 'is-active': selectedCategory === 'all' }"
                  @click="filterByCategory('all')"
                >
                  全部文章 ({{ blogs.length }})
                </button>
              </li>
              <li v-for="category in categories" :key="category">
                <button 
                  class="filter-item" 
                  :class="{ 'is-active': selectedCategory === category }"
                  @click="filterByCategory(category)"
                >
                  {{ getCategoryLabel(category) }} ({{ getCategoryCount(category) }})
                </button>
              </li>
            </ul>
          </div>
          
          <div class="filter-section">
            <h3 class="filter-title">热门标签</h3>
            <div class="tags-cloud">
              <span 
                v-for="tag in allTags" 
                :key="tag" 
                class="tag"
                :class="{ 'is-active': selectedTag === tag }"
                @click="filterByTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </aside>
        
        <main class="main-content">
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索文章标题、内容或标签..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <div class="results-info">
            共 {{ filteredBlogs.length }} 篇文章
          </div>
          
          <div class="blogs-grid" v-if="filteredBlogs.length > 0">
            <BlogCard v-for="blog in filteredBlogs" :key="blog.id" :blog="blog" />
          </div>
          
          <div class="empty-state" v-else>
            <div class="empty-icon">📭</div>
            <h3 class="empty-title">没有找到相关文章</h3>
            <p class="empty-desc">尝试使用其他关键词搜索</p>
            <button class="btn btn-primary" @click="resetFilters">清除筛选条件</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BlogCard from '@/components/cards/BlogCard.vue'
import blogsData from '@/data/blogs.json'

const blogs = ref(blogsData)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedTag = ref('')

const categories = computed(() => {
  const cats = new Set()
  blogs.value.forEach(blog => {
    if (blog.category) cats.add(blog.category)
  })
  return Array.from(cats)
})

const allTags = computed(() => {
  const tags = new Set()
  blogs.value.forEach(blog => {
    blog.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

const getCategoryLabel = (category) => {
  const labels = {
    'cesium': 'Cesium',
    'threejs': 'Three.js',
    'blog': '技术随笔'
  }
  return labels[category] || category
}

const getCategoryCount = (category) => {
  return blogs.value.filter(b => b.category === category).length
}

const filteredBlogs = computed(() => {
  let result = blogs.value
  
  if (selectedCategory.value !== 'all') {
    result = result.filter(blog => blog.category === selectedCategory.value)
  }
  
  if (selectedTag.value) {
    result = result.filter(blog => blog.tags.includes(selectedTag.value))
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(blog => 
      blog.title.toLowerCase().includes(query) ||
      blog.summary.toLowerCase().includes(query) ||
      blog.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return result
})

const filterByCategory = (category) => {
  selectedCategory.value = category
  selectedTag.value = ''
}

const filterByTag = (tag) => {
  if (selectedTag.value === tag) {
    selectedTag.value = ''
  } else {
    selectedTag.value = tag
    selectedCategory.value = 'all'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedTag.value = ''
}
</script>

<style lang="scss" scoped>
.blog-list-page {
  .page-header {
    background: linear-gradient(135deg, $bg-secondary 0%, $bg-color 100%);
    padding: $spacing-2xl 0;
    text-align: center;
    border-bottom: 1px solid $border-color;
  }
  
  .page-title {
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $text-color;
    margin-bottom: $spacing-sm;
  }
  
  .page-subtitle {
    font-size: $font-size-lg;
    color: $text-secondary;
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
      display: flex;
      gap: $spacing-lg;
      flex-wrap: wrap;
    }
  }
  
  .filter-section {
    background: $card-bg;
    border-radius: $border-radius-lg;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: $box-shadow;
    
    @media (max-width: $breakpoint-lg) {
      flex: 1;
      min-width: 200px;
      margin-bottom: 0;
    }
  }
  
  .filter-title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-color;
  }
  
  .filter-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
  
  .filter-item {
    width: 100%;
    text-align: left;
    padding: $spacing-sm $spacing-md;
    color: $text-secondary;
    font-size: $font-size-sm;
    border-radius: $border-radius;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
    }
    
    &.is-active {
      background: rgba($primary-color, 0.15);
      color: $primary-color;
      font-weight: 500;
    }
  }
  
  .tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }
  
  .main-content {
    min-width: 0;
  }
  
  .search-bar {
    position: relative;
    margin-bottom: $spacing-lg;
  }
  
  .search-input {
    width: 100%;
    padding: $spacing-md $spacing-lg $spacing-md 48px;
    background: $card-bg;
    border: 1px solid $border-color;
    border-radius: $border-radius-lg;
    color: $text-color;
    font-size: $font-size-base;
    transition: all 0.3s ease;
    
    &::placeholder {
      color: $text-muted;
    }
    
    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
    }
  }
  
  .search-icon {
    position: absolute;
    left: $spacing-md;
    top: 50%;
    transform: translateY(-50%);
    font-size: $font-size-lg;
    color: $text-muted;
  }
  
  .results-info {
    font-size: $font-size-sm;
    color: $text-muted;
    margin-bottom: $spacing-lg;
  }
  
  .blogs-grid {
    display: grid;
    gap: $spacing-lg;
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
    margin-bottom: $spacing-lg;
  }
}
</style>
