<template>
  <router-link :to="`/blog/${blog.id}`" class="blog-card card">
    <div class="blog-cover">
      <img :src="blog.coverImage" :alt="blog.title" />
    </div>
    <div class="blog-content">
      <div class="blog-meta">
        <span class="blog-date">{{ blog.date }}</span>
        <span class="blog-read-time">{{ blog.readTime }}阅读</span>
      </div>
      <h3 class="blog-title">{{ blog.title }}</h3>
      <p class="blog-summary">{{ blog.summary }}</p>
      <div class="blog-tags">
        <span v-for="tag in blog.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  blog: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    
    .blog-cover img {
      transform: scale(1.05);
    }
    
    .blog-title {
      color: $primary-color;
    }
  }
}

.blog-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.blog-content {
  padding: $spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-meta {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
  font-size: $font-size-xs;
  color: $text-muted;
}

.blog-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-sm;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.blog-summary {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-md;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}
</style>
