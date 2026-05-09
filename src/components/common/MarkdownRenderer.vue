<template>
  <div class="markdown-renderer" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'javascript'
    return hljs.highlight(code, { language }).value
  },
  breaks: true,
  gfm: true
})

const renderedContent = computed(() => {
  return marked.parse(props.content)
})
</script>

<style lang="scss" scoped>
.markdown-renderer {
  color: $text-color;
  line-height: 1.8;
  
  :deep(h1) {
    font-size: $font-size-3xl;
    font-weight: 700;
    margin: $spacing-2xl 0 $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 2px solid $border-color;
    color: $text-color;
  }
  
  :deep(h2) {
    font-size: $font-size-2xl;
    font-weight: 600;
    margin: $spacing-xl 0 $spacing-md;
    padding-left: $spacing-md;
    border-left: 4px solid $primary-color;
    color: $text-color;
  }
  
  :deep(h3) {
    font-size: $font-size-xl;
    font-weight: 600;
    margin: $spacing-lg 0 $spacing-sm;
    color: $text-color;
  }
  
  :deep(h4), :deep(h5), :deep(h6) {
    font-size: $font-size-lg;
    font-weight: 600;
    margin: $spacing-md 0 $spacing-sm;
    color: $text-color;
  }
  
  :deep(p) {
    margin: $spacing-md 0;
    font-size: $font-size-base;
    color: $text-secondary;
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  :deep(ul), :deep(ol) {
    margin: $spacing-md 0;
    padding-left: $spacing-xl;
    color: $text-secondary;
    
    li {
      margin: $spacing-sm 0;
      line-height: 1.7;
      
      &::marker {
        color: $primary-color;
      }
    }
  }
  
  :deep(ul) {
    li {
      list-style-type: disc;
    }
  }
  
  :deep(ol) {
    li {
      list-style-type: decimal;
    }
  }
  
  :deep(blockquote) {
    margin: $spacing-lg 0;
    padding: $spacing-md $spacing-lg;
    background: rgba($primary-color, 0.05);
    border-left: 4px solid $primary-color;
    border-radius: $border-radius;
    color: $text-secondary;
    font-style: italic;
    
    p {
      margin: 0;
    }
  }
  
  :deep(pre) {
    margin: $spacing-lg 0;
    padding: $spacing-lg;
    background: #1e1e2e;
    border-radius: $border-radius;
    overflow-x: auto;
    position: relative;
    
    &::before {
      content: attr(class);
      position: absolute;
      top: $spacing-xs;
      right: $spacing-sm;
      font-size: $font-size-xs;
      color: $text-muted;
      text-transform: uppercase;
    }
    
    code {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: $font-size-sm;
      line-height: 1.6;
      background: transparent;
      padding: 0;
      border-radius: 0;
    }
  }
  
  :deep(code) {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.9em;
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    padding: 2px 6px;
    border-radius: $border-radius-sm;
  }
  
  :deep(a) {
    color: $primary-color;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
      border-bottom-color: $primary-color;
    }
  }
  
  :deep(table) {
    width: 100%;
    margin: $spacing-lg 0;
    border-collapse: collapse;
    font-size: $font-size-sm;
    
    th, td {
      padding: $spacing-sm $spacing-md;
      text-align: left;
      border: 1px solid $border-color;
    }
    
    th {
      background: $bg-secondary;
      font-weight: 600;
      color: $text-color;
    }
    
    td {
      color: $text-secondary;
    }
    
    tr:nth-child(even) {
      background: rgba($bg-secondary, 0.5);
    }
  }
  
  :deep(hr) {
    margin: $spacing-xl 0;
    border: none;
    border-top: 1px solid $border-color;
  }
  
  :deep(img) {
    max-width: 100%;
    border-radius: $border-radius;
    margin: $spacing-lg 0;
  }
  
  :deep(strong) {
    color: $text-color;
    font-weight: 600;
  }
  
  :deep(em) {
    font-style: italic;
  }
  
  :deep(del) {
    text-decoration: line-through;
    color: $text-muted;
  }
}
</style>
