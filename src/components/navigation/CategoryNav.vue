<template>
  <div class="category-nav">
    <h3 class="nav-title">{{ title }}</h3>
    <nav class="nav-list">
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="`/${type}/${category.id}`"
        class="nav-item"
        :class="{ 'is-active': isActive(category.id) }"
      >
        <span class="nav-icon">{{ getCategoryIcon(category.icon) }}</span>
        <span class="nav-info">
          <span class="nav-label">{{ category.name }}</span>
          <span class="nav-desc">{{ category.description }}</span>
        </span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['cesium', 'threejs'].includes(value)
  },
  title: {
    type: String,
    default: '分类导航'
  }
})

const route = useRoute()

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

const isActive = (categoryId) => {
  return route.params.category === categoryId || 
         (route.path === `/${props.type}` && categoryId === props.categories[0]?.id)
}
</script>

<style lang="scss" scoped>
.category-nav {
  background: $card-bg;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $box-shadow;
  
  .nav-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-color;
  }
  
  .nav-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
  
  .nav-item {
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
    padding: $spacing-md;
    border-radius: $border-radius;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba($primary-color, 0.1);
      transform: translateX(4px);
    }
    
    &.is-active {
      background: rgba($primary-color, 0.15);
      border-left: 3px solid $primary-color;
      
      .nav-label {
        color: $primary-color;
        font-weight: 600;
      }
    }
  }
  
  .nav-icon {
    font-size: $font-size-xl;
    line-height: 1;
  }
  
  .nav-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    min-width: 0;
  }
  
  .nav-label {
    font-weight: 500;
    color: $text-color;
    transition: color 0.3s ease;
  }
  
  .nav-desc {
    font-size: $font-size-xs;
    color: $text-muted;
    line-height: 1.4;
  }
}
</style>
