<template>
  <router-link :to="getDetailLink" class="case-card card">
    <div class="case-cover">
      <img :src="item.previewImage" :alt="item.title" />
      <div class="case-overlay">
        <span class="case-difficulty" :class="`difficulty-${item.difficulty}`">
          {{ item.difficulty }}
        </span>
      </div>
    </div>
    <div class="case-content">
      <h3 class="case-title">{{ item.title }}</h3>
      <p class="case-description">{{ item.description }}</p>
      <div class="case-tags">
        <span v-for="tag in item.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['cesium', 'threejs'].includes(value)
  },
  category: {
    type: String,
    required: true
  }
})

const getDetailLink = computed(() => {
  return `/${props.type}/${props.category}/${props.item.id}`
})
</script>

<style lang="scss" scoped>
.case-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    
    .case-cover img {
      transform: scale(1.05);
    }
    
    .case-title {
      color: $primary-color;
    }
  }
}

.case-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .case-overlay {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
  }
}

.case-difficulty {
  display: inline-block;
  padding: 2px 8px;
  font-size: $font-size-xs;
  font-weight: 500;
  border-radius: $border-radius-sm;
  
  &.difficulty-入门 {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
  
  &.difficulty-中级 {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }
  
  &.difficulty-高级 {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
}

.case-content {
  padding: $spacing-md;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.case-title {
  font-size: $font-size-base;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-sm;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.case-description {
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

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}
</style>
