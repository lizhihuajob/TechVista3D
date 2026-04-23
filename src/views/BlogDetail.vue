<template>
  <div class="blog-detail-page" v-if="blog">
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <router-link to="/blog">技术博客</router-link>
          <span class="separator">/</span>
          <span class="current">{{ blog.title }}</span>
        </div>
      </div>
    </div>
    
    <div class="container">
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">{{ blog.title }}</h1>
          
          <div class="article-meta">
            <div class="meta-left">
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ blog.date }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                {{ blog.readTime }}阅读
              </span>
              <span class="meta-item">
                <span class="meta-icon">✍️</span>
                {{ blog.author }}
              </span>
            </div>
            
            <div class="meta-right">
              <button class="action-btn" @click="shareArticle">
                <span class="btn-icon">🔗</span>
                分享
              </button>
            </div>
          </div>
          
          <div class="article-tags">
            <span v-for="tag in blog.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </header>
        
        <div class="article-cover">
          <img :src="blog.coverImage" :alt="blog.title" />
        </div>
        
        <div class="article-content">
          <MarkdownRenderer :content="blog.content" />
        </div>
        
        <footer class="article-footer">
          <div class="article-nav" v-if="hasPrev || hasNext">
            <router-link 
              v-if="hasPrev" 
              :to="`/blog/${prevBlog.id}`"
              class="nav-link prev"
            >
              <span class="nav-label">上一篇</span>
              <span class="nav-title">{{ prevBlog.title }}</span>
            </router-link>
            <router-link 
              v-if="hasNext" 
              :to="`/blog/${nextBlog.id}`"
              class="nav-link next"
            >
              <span class="nav-label">下一篇</span>
              <span class="nav-title">{{ nextBlog.title }}</span>
            </router-link>
          </div>
          
          <div class="related-articles" v-if="relatedBlogs.length > 0">
            <h3 class="section-title">相关文章</h3>
            <div class="related-grid">
              <router-link 
                v-for="related in relatedBlogs" 
                :key="related.id"
                :to="`/blog/${related.id}`"
                class="related-card"
              >
                <div class="related-cover">
                  <img :src="related.coverImage" :alt="related.title" />
                </div>
                <div class="related-info">
                  <h4 class="related-title">{{ related.title }}</h4>
                  <span class="related-date">{{ related.date }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  </div>
  
  <div class="not-found" v-else>
    <div class="not-found-icon">📖</div>
    <h2>文章不存在</h2>
    <p>您访问的文章可能已被删除或不存在</p>
    <router-link to="/blog" class="btn btn-primary">返回博客列表</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import blogsData from '@/data/blogs.json'

const route = useRoute()
const router = useRouter()

const blog = ref(null)
const blogs = ref(blogsData)

const currentIndex = computed(() => {
  return blogs.value.findIndex(b => b.id === route.params.id)
})

const prevBlog = computed(() => {
  if (currentIndex.value > 0) {
    return blogs.value[currentIndex.value - 1]
  }
  return null
})

const nextBlog = computed(() => {
  if (currentIndex.value < blogs.value.length - 1) {
    return blogs.value[currentIndex.value + 1]
  }
  return null
})

const hasPrev = computed(() => prevBlog.value !== null)
const hasNext = computed(() => nextBlog.value !== null)

const relatedBlogs = computed(() => {
  if (!blog.value) return []
  
  const currentTags = blog.value.tags
  const currentId = blog.value.id
  
  return blogs.value
    .filter(b => b.id !== currentId)
    .filter(b => b.tags.some(tag => currentTags.includes(tag)))
    .slice(0, 3)
})

const loadBlog = () => {
  const found = blogs.value.find(b => b.id === route.params.id)
  if (found) {
    blog.value = found
    window.scrollTo(0, 0)
  } else {
    blog.value = null
  }
}

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: blog.value.title,
      text: blog.value.summary,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

watch(() => route.params.id, () => {
  loadBlog()
})

onMounted(() => {
  loadBlog()
})
</script>

<style lang="scss" scoped>
.blog-detail-page {
  .page-header {
    background: $bg-secondary;
    border-bottom: 1px solid $border-color;
    padding: $spacing-lg 0;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
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
  
  .article {
    max-width: 900px;
    margin: 0 auto;
    padding: $spacing-xl 0;
  }
  
  .article-header {
    margin-bottom: $spacing-xl;
    
    .article-title {
      font-size: clamp($font-size-2xl, 4vw, $font-size-3xl);
      font-weight: 700;
      color: $text-color;
      line-height: 1.3;
      margin-bottom: $spacing-lg;
    }
    
    .article-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-md;
      
      @media (max-width: $breakpoint-sm) {
        flex-direction: column;
        align-items: flex-start;
        gap: $spacing-md;
      }
    }
    
    .meta-left {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-lg;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: $font-size-sm;
      color: $text-secondary;
      
      .meta-icon {
        font-size: $font-size-base;
      }
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-sm $spacing-md;
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      border-radius: $border-radius;
      font-size: $font-size-sm;
      transition: all 0.3s ease;
      
      &:hover {
        background: $primary-color;
        color: white;
      }
    }
    
    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
    }
  }
  
  .article-cover {
    margin-bottom: $spacing-xl;
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: $box-shadow;
    
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
  
  .article-content {
    font-size: $font-size-base;
    line-height: 1.8;
  }
  
  .article-footer {
    margin-top: $spacing-2xl;
    padding-top: $spacing-xl;
    border-top: 1px solid $border-color;
    
    .article-nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-lg;
      margin-bottom: $spacing-2xl;
      
      @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
      }
    }
    
    .nav-link {
      padding: $spacing-lg;
      background: $card-bg;
      border-radius: $border-radius;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      
      &:hover {
        border-color: $primary-color;
        transform: translateY(-2px);
      }
      
      &.prev {
        text-align: left;
      }
      
      &.next {
        text-align: right;
      }
    }
    
    .nav-label {
      display: block;
      font-size: $font-size-xs;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: $spacing-xs;
    }
    
    .nav-title {
      font-size: $font-size-base;
      font-weight: 500;
      color: $text-color;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .related-articles {
      .section-title {
        font-size: $font-size-xl;
        font-weight: 600;
        color: $text-color;
        margin-bottom: $spacing-lg;
      }
      
      .related-grid {
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
        height: 120px;
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
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: color 0.3s ease;
      }
      
      .related-date {
        display: block;
        margin-top: $spacing-xs;
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }
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
